import React, { Fragment, useState, useEffect, useContext } from "react";
import { GoogleMap, useLoadScript, Marker, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";
import { UpdateVehiculoLocUseCase } from '../../Domain/useCases/Vehiculos/UpdateVehiculoLoc';
import { show_alert } from '../../funtions';
import { VehiculoContext } from "../context/VehiculoContext";

export const Maps: React.FC = () => {
    const { vehiculos, getAllVehiculos, getVehiculoById, vehiculo } = useContext(VehiculoContext);
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyAa_PpoUJCj42y6oZkgzk5jLnqFwMFKhWQ',
    });
    const [activeMarker, setActiveMarker] = useState<google.maps.LatLngLiteral | null>(null);
    const [vehicleLocation, setVehicleLocation] = useState<google.maps.LatLngLiteral | null>(null);
    const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [searchText, setSearchText] = useState<string>('');
    const [searchText2, setSearchText2] = useState<string>('');
    const [showMessage, setShowMessage] = useState(false);
    const [detailLoc, setdetailLoc] = useState("");
    const [routingEnabled, setRoutingEnabled] = useState(false);
    console.log(activeMarker)
    



    useEffect(() => {
        getAllVehiculos()

    }, [])


    const center = userLocation || { lat: 28.7041, lng: 77.1025 };

    useEffect(() => {
        // Obtener la ubicación del usuario
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLatLng: google.maps.LatLngLiteral = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setUserLocation(userLatLng);
                },
                (error) => {
                    console.error("Error al obtener la ubicación del usuario:", error);
                }
            );
        } else {
            console.error("La geolocalización no está soportada por este navegador.");
        }
    }, []);

    const handleMapClick = async (event: google.maps.MapMouseEvent) => {
        if (event.latLng && !routingEnabled) {
            const clickedLocation: google.maps.LatLngLiteral = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            };
    
            setVehicleLocation(clickedLocation);
            setActiveMarker(clickedLocation);
    
            const addressDetails = await getAddressDetails(clickedLocation);
    
            setdetailLoc(addressDetails);
    
            console.log("Ubicación seleccionada:", clickedLocation);
            console.log("Detalles de la ubicación:", addressDetails);
        }
    };;


    const getAddressDetails = async (location: google.maps.LatLngLiteral) => {
        const geocoder = new google.maps.Geocoder();
        return new Promise<string>((resolve, reject) => {
            geocoder.geocode({ location }, (results, status) => {
                if (status === "OK" && results && results[0]) {
                    resolve(results[0].formatted_address);
                } else {
                    reject("No se pudo obtener detalles de la dirección");
                }
            });
        });
    };

    const handleMapClickToShowMessage = () => {

        setShowMessage(true);


        setTimeout(() => {
            setShowMessage(false);
        }, 5000);
    };

    const validar = async () => {
        if (searchText.trim() === '') {
            show_alert('Ingresa el ID del vehículo', 'warning');
        } else if (!vehicleLocation) {
            show_alert('Selecciona la ubicación del vehículo en el mapa', 'warning');
        } else if (detailLoc.trim() === '') {
            show_alert('No se pudo obtener detalles de la dirección', 'warning');
        } else if (!vehiculos.some(vehiculo => vehiculo.id && vehiculo.id.toString() === searchText.trim())) {
            show_alert('El ID del vehículo no está en la lista de vehículos', 'warning');
        } else {
            try {
                await UpdateVehiculoLocUseCase(searchText, `${vehicleLocation.lat}`, `${vehicleLocation.lng}`, detailLoc);
                console.log("Vehículo actualizado con éxito.");
                show_alert('Vehículo actualizado exitosamente', 'success');
            } catch (error) {
                console.error("Error al actualizar el vehículo:", error);
                show_alert('Error al actualizar el vehículo', 'error');
            }
        }
    }

    const handleAddButtonClick = () => {
        validar();
    }

    const validar2 = async () => {
        const isNumeric = !isNaN(parseFloat(searchText2)) && isFinite(parseFloat(searchText2));
    
        if (searchText2.trim() === '' || !isNumeric) {
          show_alert('Ingresa un ID de vehículo válido (número)', 'warning');
          return false;
        } else {
          const existsInVehiculos = vehiculos.some(vehiculo => vehiculo.id && vehiculo.id.toString() === searchText2.trim());
    
          if (!existsInVehiculos) {
            show_alert('El ID del vehículo no está en la lista de vehículos', 'warning');
            return false;
          } else {
            try {
              await getVehiculoById(searchText2);
              console.log("Log para ver si trae datos vehiculo" + JSON.stringify(vehiculo))
    
              if (Array.isArray(vehiculo) && vehiculo.length > 0) {
                const firstVehiculo = vehiculo[0];
                console.log(vehiculo)
                setVehicleLocation({
                  lat: parseFloat(firstVehiculo.lat),
                  lng: parseFloat(firstVehiculo.lng),
                });
    
                // Activar el enrutamiento
                setRoutingEnabled(true);
    
                console.log("Id que se va a rastrear " + vehicleLocation)
                show_alert('Vehículo va a ser rastreado.', 'success');
                console.log(vehicleLocation);
              } else {
                show_alert('Error al obtener la información del vehículo', 'error');
              }
            } catch (error) {
              console.error("Error al obtener el vehículo:", error);
              show_alert('Error al obtener la información del vehículo', 'error');
            }
          }
        }
        return true;
      }

    useEffect(() => {

        console.log("Nuevo valor de vehicleLocation:", vehicleLocation);
    }, [vehicleLocation]);


    const handleAddButtonClick2 = () => {
        validar2();
    }
    return (
        <Fragment>
      <div className="container">
        <div style={{ height: "50vh", width: "100%" }} onClick={handleMapClickToShowMessage}>
          {loadError ? (
            <div>Error al cargar el mapa</div>
          ) : isLoaded ? (
            <GoogleMap
              center={center}
              zoom={10}
              onClick={handleMapClick}
              mapContainerStyle={{ width: "100%", height: "50vh" }}
            >
              {routingEnabled && userLocation && vehicleLocation && (
                <DirectionsService
                  options={{
                    destination: vehicleLocation,
                    origin: userLocation,
                    travelMode: google.maps.TravelMode.DRIVING,
                  }}
                  callback={(result) => {
                    if (result !== null) {
                      setDirections(result);
                    }
                  }}
                />
              )}
              {directions && (
                <DirectionsRenderer
                  options={{
                    directions: directions,
                    polylineOptions: {
                      strokeColor: "#FF0000",
                      strokeOpacity: 0.8,
                      strokeWeight: 4,
                    },
                    suppressMarkers: true,
                  }}
                />
              )}

              {routingEnabled && userLocation && (
                <Marker
                  position={userLocation}
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  }}
                />
              )}
              {vehicleLocation && (
                <Fragment>
                  <Marker
                    position={vehicleLocation}
                    onClick={() => setActiveMarker(vehicleLocation)}
                  />
                  <Marker
                    position={vehicleLocation}
                    label={"Vehículo"}
                    title={"Ubicación del vehículo"}
                  />
                </Fragment>
              )}
            </GoogleMap>
          ) : (
            <div>Cargando mapa...</div>
          )}
        </div>

                <div className="row mt-3">
                    <div className="col-md-6 offset-md-3 d-flex">
                        {/* Primer TextInput con botón */}
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="ID a rastrear"
                                aria-describedby="button-addon1"
                                onChange={(e) => setSearchText2(e.target.value)}
                            />
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                id="button-addon1"
                                onClick={handleAddButtonClick2}
                            >
                                Rastrear
                            </button>
                        </div>

                        {/* Segundo TextInput con botón */}
                        <div className="input-group ms-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="ID a agregar"
                                aria-describedby="button-addon2"
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                id="button-addon2"
                                onClick={handleAddButtonClick}
                            >
                                Agregar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mensaje de instrucciones con transición */}
                {showMessage && (
                    <div className="row mt-3">
                        <div className="col-md-6 offset-md-3">
                            <p className="text-muted message-fade-in">
                                Si deseas agregar la ubicación al vehículo, por favor haz clic en el mapa y
                                ingresa el ID del vehículo que quieras asociar a esa ubicación.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Fragment>
    );
}
export default Maps;
