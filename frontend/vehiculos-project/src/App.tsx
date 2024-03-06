import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ShowVehiculos } from './Presentation/components/ShowVehiculos';



function App() {
  
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ShowVehiculos></ShowVehiculos>}></Route>
      </Routes>
    </BrowserRouter>
  )
}




export default App
