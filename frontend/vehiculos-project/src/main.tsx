import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { VehiculoProvider } from './Presentation/context/VehiculoContext.tsx'
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap/dist/css/bootstrap.min.css'


const VehiculoState = ({ children }: any) => {

  return(
    <VehiculoProvider>
      {children}
    </VehiculoProvider>
  )

}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <VehiculoState>
    <App />
    </VehiculoState>
  </React.StrictMode>,
)
