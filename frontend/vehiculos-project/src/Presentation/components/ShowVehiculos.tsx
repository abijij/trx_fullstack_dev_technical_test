import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alert } from '../../funtions';
import { VehiculoContext } from '../context/VehiculoContext';
import { Vehiculo } from '../../Domain/entities/Vehiculos';

export const ShowVehiculos = () => {
  const { getAllVehiculos, vehiculos, create, update, remove } = useContext(VehiculoContext);
  const [title, setTitle] = useState('');
  const [operation, setOperation] = useState(1)

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
  const onChanget = (property: string, value: any) => {
    setValues({ ...values, [property]: value });
  }

  useEffect(() => {
    getAllVehiculos();

  }, [])

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


  console.log("Log para la tabla boton" + JSON.stringify(vehiculos, null, 3))

  return (
    <div className='App'>
      <div className='container-fluid'>
        <div className='row mt-3'>
          <div className='col-md-4 offset-md-4'>
            <div className='d-grind mx-auto'>
              <button onClick={() => openModal(1, '', '', '', '', 0, '', 0, '', '', 0, '')} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalVehiculos'>
                <i className='fa-solid fa-circle-plus'></i>Añadir
              </button>
            </div>
          </div>
        </div>
        <div className='row mt-3'>
          <div className='' col-12 col-lg-8 offset-0 offset-lg-2>
            <div className='table-responsive'>
              <table className='table table-bordered'>
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
                  {vehiculos.map((vehiculo) => (
                    <tr key={vehiculo.id}>
                      <td>{vehiculo.id}</td>
                      <td>{vehiculo.placa}</td>
                      <td>{vehiculo.numero_economico}</td>
                      <td>{vehiculo.vim}</td>
                      <td>{vehiculo.asientos}</td>
                      <td>{vehiculo.seguro}</td>
                      <td>{vehiculo.seguro_numero}</td>
                      <td>{vehiculo.brand}</td>
                      <td>{vehiculo.model}</td>
                      <td>{vehiculo.year}</td>
                      <td>{vehiculo.color}</td>
                      <td>
                        <button onClick={() => openModal(2, vehiculo.id || '', vehiculo.placa || '', vehiculo.numero_economico || '', vehiculo.vim || '', vehiculo.asientos || 0, vehiculo.seguro || '', vehiculo.seguro_numero || 0, vehiculo.brand || '', vehiculo.model || '', vehiculo.year || 0, vehiculo.color || '')} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalVehiculos'>
                          <i className='fa-solid fa-edit'></i>
                        </button>
                      </td>
                      <td>
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
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
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
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
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
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
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
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
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
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
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
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
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
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                <input
                  type="text"
                  id='brand'
                  className='form-control'
                  placeholder='Brand'
                  value={values.brand}
                  onChange={(e) => onChanget('brand', e.target.value)}
                />
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                <input
                  type="text"
                  id='model'
                  className='form-control'
                  placeholder='Model'
                  value={values.model}
                  onChange={(e) => onChanget('model', e.target.value)}
                />
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                <input
                  type="number"
                  id='year'
                  className='form-control'
                  placeholder='Year'
                  value={values.year}
                  onChange={(e) => onChanget('year', parseInt(e.target.value, 10))}
                />
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                <input
                  type="text"
                  id='color'
                  className='form-control'
                  placeholder='Color'
                  value={values.color}
                  onChange={(e) => onChanget('color', e.target.value)}
                />
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

