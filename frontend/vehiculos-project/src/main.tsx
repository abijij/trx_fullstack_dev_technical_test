import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { VehiculoProvider } from './Presentation/context/VehiculoContext.tsx'


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
