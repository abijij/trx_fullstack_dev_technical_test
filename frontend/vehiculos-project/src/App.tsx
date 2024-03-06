import { useContext, useEffect, useState } from 'react'
import { VehiculoContext } from './Presentation/context/VehiculoContext'





function App() {
  const { getAllVehiculos,vehiculos} = useContext(VehiculoContext);
  
  useEffect(() => {
    getAllVehiculos();
    
  }, [])
  
 
  console.log("Log para la tabla Vehiculos" + JSON.stringify(vehiculos, null, 3))
  console.log(typeof vehiculos)

  return (
    <div className='App'>
      <div className='table-responsive'>
        <table className='table table-sm table-bordered'>
          <thead>
            <tr>
              <th>Id</th>
              <th>Placa</th>
              <th>Vim</th>
              <th>Asientos</th>
              <th>Seguro</th>
              <th>N#_Seguro</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Year</th>
              <th>Color</th>
            </tr>
          </thead>
          <tbody>
            {vehiculos.map((vehiculo) => (
              <tr key={vehiculo.id}>
                <td>{vehiculo.id}</td>
                <td>{vehiculo.placa}</td>
                <td>{vehiculo.vin}</td>
                <td>{vehiculo.asientos}</td>
                <td>{vehiculo.seguro}</td>
                <td>{vehiculo.seguro_numero}</td>
                <td>{vehiculo.brand}</td>
                <td>{vehiculo.model}</td>
                <td>{vehiculo.year}</td>
                <td>{vehiculo.color}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}




export default App
