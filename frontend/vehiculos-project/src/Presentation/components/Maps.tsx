import React, { Fragment, useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

export const Maps: React.FC = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAa_PpoUJCj42y6oZkgzk5jLnqFwMFKhWQ',
  });

  const [activeMarker, setActiveMarker] = useState<google.maps.LatLngLiteral | null>(null);
  const [vehicleLocation, setVehicleLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);

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
  }, []); // El segundo argumento [] asegura que el efecto se ejecute solo una vez al montar el componente

  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const clickedLocation: google.maps.LatLngLiteral = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      // Guardar la ubicación del vehículo
      setVehicleLocation(clickedLocation);
      setActiveMarker(clickedLocation);

      // Obtener detalles de la ubicación (geocodificación inversa)
      const addressDetails = await getAddressDetails(clickedLocation);

      // Logear la ubicación con detalles
      console.log("Ubicación seleccionada:", clickedLocation);
      console.log("Detalles de la ubicación:", addressDetails);
    }
  };

  // Función para obtener detalles de la dirección usando Geocoding
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

  return (
    <Fragment>
      <div className="container">
        <div style={{ height: "50vh", width: "100%" }}>
          {loadError ? (
            <div>Error al cargar el mapa</div>
          ) : isLoaded ? (
            <GoogleMap
              center={center}
              zoom={10}
              onClick={handleMapClick}
              mapContainerStyle={{ width: "100%", height: "50vh" }}
            >
              {userLocation && (
                <Marker
                  position={userLocation}
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  }}
                />
              )}
              {vehicleLocation && (
                <Marker
                  position={vehicleLocation}
                  onClick={() => setActiveMarker(vehicleLocation)}
                />
              )}
            </GoogleMap>
          ) : (
            <div>Cargando mapa...</div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Maps;
