import { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alert } from '../../funtions';
import { VehiculoContext } from '../context/VehiculoContext';
import { Vehiculo } from '../../Domain/entities/Vehiculos';
import '../../style.css';
import { GetVehiculosByBrandUseCase } from '../../Domain/useCases/Vehiculos/SearchVehiculoByBrand';
import { GetVehiculoByModelUseCase } from '../../Domain/useCases/Vehiculos/SearchVehiculoByModel';
import { GetVehiculoByYearUseCase } from '../../Domain/useCases/Vehiculos/SearchVehiculoByYear';
import {Maps} from './Maps'

export const ShowVehiculos = () => {
  const { getAllVehiculos, vehiculos, create, update, remove, saveVehiculosSession } = useContext(VehiculoContext);
  const [title, setTitle] = useState('');
  const [operation, setOperation] = useState(1)
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 5;
  const [searchType, setSearchType] = useState('Marca');
  const [vehiculo, setVehiculo] = useState<Vehiculo[]>([]);
  const [searchText, setSearchText] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const [years, setYears] = useState<number[]>([]);

  const searchVehiculos = async (name: string) => {
    if (name.trim() === '') {
      getAllVehiculos();
    } else {
      let result;

      switch (searchType) {
        case 'brand':
          const brandResult = await GetVehiculosByBrandUseCase(name);
          result = brandResult;
          saveVehiculosSession(result);
          break;
        case 'model':
          const modelResult = await GetVehiculoByModelUseCase(name);
          result = modelResult;
          saveVehiculosSession(result);
          break;
        case 'year':
          const yearResult = await GetVehiculoByYearUseCase(parseInt(name));
          result = yearResult;
          saveVehiculosSession(result);
          break;
        default:
          break;
      }
      console.log('Contenido de vehiuculo:', vehiculos);
      setVehiculo(result || []);
    }
  };

  const handleSearchClick = () => {

    setSearchActive(true);
  };



  useEffect(() => {

    if (searchActive) {
      searchVehiculos(searchText);
      setSearchActive(false);
    }
  }, [searchActive, searchText]);

  const [values, setValues] = useState({
    id: '',
    placa: '',
    numero_economico: '',
    vim: '',
    asientos: 0,
    seguro: '',
    seguro_numero: 0,
    brand: '',
    model: '',
    year: 0,
    color: ''
  })
  const marcasDeVehiculos = [
    "Audi",
    "BMW",
    "Chevrolet",
    "Fiat",
    "Ford",
    "Honda",
    "Hyundai",
    "Jaguar",
    "Kia",
    "Land Rover",
    "Mazda",
    "Mercedes-Benz",
    "Nissan",
    "Peugeot",
    "Renault",
    "Subaru",
    "Tesla",
    "Toyota",
    "Volkswagen",
    "Volvo"
  ];
  const onChanget = (property: string, value: any) => {
    setValues({ ...values, [property]: value });
  }

  useEffect(() => {
    getAllVehiculos();

  }, [])

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const startingYear = 1960;
    const yearsArray = Array.from({ length: currentYear - startingYear + 1 }, (_, index) => startingYear + index).reverse();
    setYears(yearsArray);
  }, []);

  const openModal = (op: number, id: string, placa: string, numero_economico: string, vim: string, asientos: number, seguro: string, seguro_numero: number, brand: string, model: string, year: number, color: string) => {
    setValues({
      id: '',
      placa: '',
      numero_economico: '',
      vim: '',
      asientos: 0,
      seguro: '',
      seguro_numero: 0,
      brand: '',
      model: '',
      year: 0,
      color: ''
    });

    setOperation(op);

    if (op === 1) {
      setTitle('Registrar Vehículo');
    } else if (op === 2) {
      setTitle('Editar Vehículo');
      setValues({
        id,
        placa,
        numero_economico,
        vim,
        asientos,
        seguro,
        seguro_numero,
        brand,
        model,
        year,
        color
      });
    }

    window.setTimeout(function () {
      const idElement = document.getElementById('id');
      if (idElement) {
        idElement.focus();
      }
    }, 500);
  }
  const checkDuplicate = (placa: string): boolean => {
    const duplicateVehiculo = vehiculos.find((v) => v.placa === placa);
    return !!duplicateVehiculo;
  };
  const validar = async () => {
    if (values.placa.trim() === '') {
      show_alert('Escribe la placa del vehículo', 'warning');
    } else if (values.numero_economico.trim() === '') {
      show_alert('Escribe el número económico del vehículo', 'warning');
    } else if (values.vim.trim() === '') {
      show_alert('Escribe el VIM del vehículo', 'warning');
    } else if (values.asientos <= 0) {
      show_alert('Ingresa un número válido de asientos', 'warning');
    } else if (values.seguro.trim() === '') {
      show_alert('Escribe el tipo de seguro del vehículo', 'warning');
    } else if (values.seguro_numero <= 0) {
      show_alert('Ingresa un número válido para el seguro', 'warning');
    } else if (values.brand.trim() === '') {
      show_alert('Escribe la marca del vehículo', 'warning');
    } else if (values.model.trim() === '') {
      show_alert('Escribe el modelo del vehículo', 'warning');
    } else if (values.year <= 0) {
      show_alert('Ingresa un año válido para el vehículo', 'warning');
    } else if (values.color.trim() === '') {
      show_alert('Escribe el color del vehículo', 'warning');
    } else if (operation === 1 && checkDuplicate(values.placa)) {
      // Validar duplicados solo al añadir
      show_alert('Ya existe un vehículo con la misma placa', 'error');
    } else {
      console.log('Formulario válido. Puedes realizar la acción correspondiente.');

      try {
        if (operation === 1) {
          await create(values);
          getAllVehiculos();
          show_alert('Vehículo creado exitosamente', 'success');
        } else if (operation === 2) {
          // Verificar si se realizaron cambios
          const changesMade = Object.keys(values).some((key) => values[key as keyof typeof values] !== vehiculos.find((v) => v.id === values.id)![key as keyof typeof values]);

          if (changesMade) {
            await update(values);
            getAllVehiculos();
            show_alert('Vehículo actualizado exitosamente', 'success');
          } else {
            // Mostrar alerta si no se realizaron cambios
            show_alert('No se realizaron cambios en el vehículo', 'info');
          }
        }
      } catch (error) {
        console.error('Error en la solicitud', error);
        show_alert('Error en la solicitud', 'error');
      }
    }
  };

  const deleteVehiculo = async (vehiculo: Vehiculo) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: '¿Seguro de eliminar el producto ' + vehiculo.id + ' ?',
      icon: 'question',
      text: 'No se podrá dar marcha atrás',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await remove(vehiculo);
        getAllVehiculos();
        show_alert('Vehículo eliminado exitosamente', 'success');
      } else {
        show_alert('El vehículo NO fue eliminado', 'info');
      }
    });
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };



  console.log("Log para la tabla boton" + JSON.stringify(vehiculos, null, 3))

  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = vehiculos.slice(indexOfFirstVehicle, indexOfLastVehicle);

  return (
    <div className='App'>
      <div className='container-fluid'>
      <div className='mt-3'>
        <Maps />
        </div>
        <div className='row mt-3'>
          <div className='col-md-6 offset-md-3'>
            <div className='d-flex justify-content-between align-items-center'>
              <div className='input-group me-2'>
                <select
                  className='form-select'
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  <option value='brand'>Por Marca</option>
                  <option value='model'>Por Modelo</option>
                  <option value='year'>Por Año</option>
                </select>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Buscar...'
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <button className='btn btn-outline-secondary' type='button' onClick={handleSearchClick}>
                  <i className='fa-solid fa-search'></i>
                </button>
              </div>
              <button onClick={() => openModal(1, '', '', '', '', 0, '', 0, '', '', 0, '')} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalVehiculos'>
                <i className='fa-solid fa-circle-plus'></i> Añadir
              </button>
            </div>
          </div>
        </div>
        <div className='row mt-3'>
          <div className=' '>
            <div className='table-responsive'>
              <table className='table table-bordered table-sm'>
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Placa</th>
                    <th>Numero economico</th>
                    <th>Vim</th>
                    <th>Asientos</th>
                    <th>Seguro</th>
                    <th>Numero Seguro</th>
                    <th>Brand</th>
                    <th>Model</th>
                    <th>Year</th>
                    <th>Color</th>
                  </tr>
                </thead>
                <tbody className='table-group-divider'>
                  {currentVehicles.map((vehiculo) => (
                    <tr key={vehiculo.id}>
                      <td className='table-cell'>{vehiculo.id}</td>
                      <td className='table-cell'>{vehiculo.placa}</td>
                      <td className='table-cell'>{vehiculo.numero_economico}</td>
                      <td className='table-cell'>{vehiculo.vim}</td>
                      <td>{vehiculo.asientos}</td>
                      <td className='table-cell'>{vehiculo.seguro}</td>
                      <td className='table-cell'>{vehiculo.seguro_numero}</td>
                      <td className='table-cell'>{vehiculo.brand}</td>
                      <td>{vehiculo.model}</td>
                      <td className='table-cell'>{vehiculo.year}</td>
                      <td className='table-cell'>{vehiculo.color}</td>
                      <td className='table-cell'>
                        <button onClick={() => openModal(2, vehiculo.id || '', vehiculo.placa || '', vehiculo.numero_economico || '', vehiculo.vim || '', vehiculo.asientos || 0, vehiculo.seguro || '', vehiculo.seguro_numero || 0, vehiculo.brand || '', vehiculo.model || '', vehiculo.year || 0, vehiculo.color || '')} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalVehiculos'>
                          <i className='fa-solid fa-edit'></i>
                        </button>
                      </td>
                      <td className='table-cell'>
                        <button
                          onClick={() => deleteVehiculo(vehiculo)}
                          className='btn btn-danger'>
                          <i className='fa-solid fa-trash'></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <nav>
                <ul className="pagination">
                  {Array.from({ length: Math.ceil(vehiculos.length / vehiclesPerPage) }, (_, index) => (
                    <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

            </div>
          </div>
        </div>
      </div>
      <div id='modalVehiculos' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'>
          ?<div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className='modal-body'>
              <input type="hidden" id='id' ></input>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-car'></i></span>
                <input
                  type="text"
                  id='placa'
                  className='form-control'
                  placeholder='Placa'
                  value={values.placa}
                  onChange={(e) => onChanget('placa', e.target.value)}
                />
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-dollar-sign'></i></span>
                <input
                  type="text"
                  id='numero_economico'
                  className='form-control'
                  placeholder='Número Económico'
                  value={values.numero_economico}
                  onChange={(e) => onChanget('numero_economico', e.target.value)}
                />
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-note-sticky'></i></span>
                <input
                  type="text"
                  id='vim'
                  className='form-control'
                  placeholder='VIM'
                  value={values.vim}
                  onChange={(e) => onChanget('vim', e.target.value)}
                />
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-chair'></i></span>
                <input
                  type="number"
                  id='asientos'
                  className='form-control'
                  placeholder='Asientos'
                  value={values.asientos}
                  onChange={(e) => onChanget('asientos', parseInt(e.target.value, 10))}
                />
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-brands fa-digital-ocean'></i></span>
                <input
                  type="text"
                  id='seguro'
                  className='form-control'
                  placeholder='Seguro'
                  value={values.seguro}
                  onChange={(e) => onChanget('seguro', e.target.value)}
                />
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-copyright'></i></span>
                <input
                  type="number"
                  id='seguro_numero'
                  className='form-control'
                  placeholder='Número de Seguro'
                  value={values.seguro_numero}
                  onChange={(e) => onChanget('seguro_numero', parseInt(e.target.value, 10))}
                />
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-copyright'></i></span>
                <select
                  id='brand'
                  className='form-select'
                  value={values.brand}
                  onChange={(e) => onChanget('brand', e.target.value)}
                >
                  <option value="">Selecciona una marca</option>
                  {marcasDeVehiculos.map((marca, index) => (
                    <option key={index} value={marca}>{marca}</option>
                  ))}
                </select>
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-car-side'></i></span>
                <input
                  type="text"
                  id='model'
                  className='form-control'
                  placeholder='Agrega el Modelo'
                  value={values.model}
                  onChange={(e) => onChanget('model', e.target.value)}
                />
              </div>

              <div className='input-group mb-3'>
                    <span className='input-group-text'><i className='fa-solid fa-calendar-days'></i></span>
                    <select
                      className="form-select"
                      value={values.year}
                      onChange={(e) => onChanget('year', parseInt(e.target.value, 10))}
                    >
                      <option value="">Selecciona un año</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='input-group mb-3'>
                    <span className='input-group-text'><i className='fa-solid fa-droplet'></i></span>
                    <select
                      id='color'
                      className='form-select'
                      value={values.color}
                      onChange={(e) => onChanget('color', e.target.value)}
                    >
                      <option value="">Selecciona un color</option>
                      <option value="red">Rojo</option>
                      <option value="blue">Azul</option>
                      <option value="green">Verde</option>
                      <option value="yellow">Amarillo</option>
                      <option value="orange">Naranja</option>
                      <option value="purple">Púrpura</option>
                      <option value="pink">Rosado</option>
                      <option value="brown">Marrón</option>
                      <option value="black">Negro</option>
                      <option value="white">Blanco</option>
                      <option value="gray">Gris</option>
                      <option value="cyan">Cian</option>
                      <option value="magenta">Magenta</option>
                      <option value="lime">Limón</option>
                      <option value="olive">Oliva</option>
                      <option value="teal">Verde Azulado</option>
                      <option value="navy">Azul Marino</option>
                      <option value="silver">Plata</option>
                      <option value="gold">Oro</option>
                      <option value="indigo">Índigo</option>
                    </select>
                  </div>

              <div className='d-grid col-6 mx-auto'>
                <button onClick={() => validar()} className='btn btn-success'>
                  <i className='fa-solid fa-floppy-disk'></i> Guardar
                </button>
              </div>
            </div>
            <div className='modal-footer'>
              <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

