import { createContext, useState } from 'react';
import {Vehiculo} from "../../Domain/entities/Vehiculos"
import { ResponseApiVehiculos } from '../../Data/sources/remote/Models/ResponseApiDelivery';
import { GetVehiculoByIdUseCase } from '../../Domain/useCases/Vehiculos/GetVehiculosById';
import { CreateVehiculoUseCase } from '../../Domain/useCases/Vehiculos/CreateVehiculo';
import { UpdateVeiculoUseCase } from '../../Domain/useCases/Vehiculos/UpdateVehiculo';
import { DeleteVehiculoUseCase } from '../../Domain/useCases/Vehiculos/DeleteVehiculo';
import { GetAllVehiculosUseCase } from '../../Domain/useCases/Vehiculos/GetAllVehiculo';
import { SaveVehiculosLocalUseCase } from '../../Domain/useCases/VehiculoLocal/SaveVehiculo';


export const VehiculoInitialState: Vehiculo = {

    id: '',
    placa: '',
    numero_economico:'',
    vim: '', 
    asientos: 0,
    seguro: '',
    seguro_numero: 0,
    brand: '',
    model: '',
    year: 0,
    color: '',
    lat: '',
    lng:'',
    ubicacion: ''
}


export interface VehiculosContextProps{

     vehiculo : Vehiculo[],

    vehiculos : Vehiculo[],

    saveVehiculosSession: (vehiculo: Vehiculo[]) => Promise<void>;

    getVehiculoById(idVehiculo: string): Promise<void>,

    create(vehiculo:Vehiculo): Promise<ResponseApiVehiculos>,

    update(vehiculo: Vehiculo): Promise<ResponseApiVehiculos>,

    remove(vehiculo: Vehiculo): Promise<ResponseApiVehiculos>,

    getAllVehiculos(): Promise<Vehiculo[]>;

}

export const VehiculoContext = createContext({} as VehiculosContextProps);

export const VehiculoProvider = ({children}: any) => {

    const [vehiculo, setvehiculo] = useState<Vehiculo[]>([VehiculoInitialState]);

    const [vehiculos, setvehiculos] = useState<Vehiculo[]>([])

   


    const getVehiculoById = async(idVehiculo: string): Promise <void> => {

        const result = await GetVehiculoByIdUseCase(idVehiculo);
        setvehiculo(result);
    }

    const create = async(vehiculo: Vehiculo): Promise<ResponseApiVehiculos> => {
        const response = await CreateVehiculoUseCase(vehiculo);

        return response;
    }

    const update = async(vehiculo: Vehiculo): Promise<ResponseApiVehiculos> => {
        const response = await UpdateVeiculoUseCase(vehiculo);

        return response;
    }


    const remove = async (vehiculo: Vehiculo): Promise<ResponseApiVehiculos> => {
        const response = await DeleteVehiculoUseCase(vehiculo);
        return response;
    }

    

    const getAllVehiculos = async (): Promise<Vehiculo[]> => {
        const result = await GetAllVehiculosUseCase();
        setvehiculos(Array.isArray(result) ? result : []);
        return result;
    }

    const saveVehiculosSession = async (vehiculos: Vehiculo[]) => {
        const result= await SaveVehiculosLocalUseCase(vehiculos);
        setvehiculos(result);
      };

    return(
        <VehiculoContext.Provider value={{
            vehiculo,
            vehiculos,
            getAllVehiculos,
            getVehiculoById,
            create,
            remove,
            update,
            saveVehiculosSession
        }}>

            {children}
        </VehiculoContext.Provider>
    )
}