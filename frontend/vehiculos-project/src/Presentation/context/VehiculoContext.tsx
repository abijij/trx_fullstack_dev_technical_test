import { createContext, useEffect, useState } from 'react';
import {Vehiculo} from "../../Domain/entities/Vehiculos"
import { ResponseApiVehiculos } from '../../Data/sources/remote/Models/ResponseApiDelivery';
import { GetVehiculoByIdUseCase } from '../../Domain/useCases/Vehiculos/GetVehiculosById';
import { CreateVehiculoUseCase } from '../../Domain/useCases/Vehiculos/CreateVehiculo';
import { UpdateVeiculoUseCase } from '../../Domain/useCases/Vehiculos/UpdateVehiculo';
import { DeleteVehiculoUseCase } from '../../Domain/useCases/Vehiculos/DeleteVehiculo';
import { GetVehiculoLocalUseCase } from '../../Domain/useCases/VehiculoLocal/GetVehiculoLocal';
import { RemoveVehiculoLocalUseCase } from '../../Domain/useCases/VehiculoLocal/RemoveVehiculoLocal';
import { GetAllVehiculosUseCase } from '../../Domain/useCases/Vehiculos/GetAllVehiculo';
import { SaveVehiculoLocalUseCase } from '../../Domain/useCases/VehiculoLocal/SaveVehiculo';


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
    color: ''
}


export interface VehiculosContextProps{

     vehiculo : Vehiculo,

    vehiculos : Vehiculo[],

    getVehiculoSession: () => Promise<void>;

    saveVehiculoSession: (vehiculo: Vehiculo) => Promise<void>;

    removeVehiculoSession: () => Promise<void>;
    
    getVehiculoById(idVehiculo: string): Promise<void>,

    create(vehiculo:Vehiculo): Promise<ResponseApiVehiculos>,

    update(vehiculo: Vehiculo): Promise<ResponseApiVehiculos>,

    remove(vehiculo: Vehiculo): Promise<ResponseApiVehiculos>,

    getAllVehiculos(): Promise<void>,

}

export const VehiculoContext = createContext({} as VehiculosContextProps);

export const VehiculoProvider = ({children}: any) => {

    const [vehiculo, setvehiculo] = useState(VehiculoInitialState);

    const [vehiculos, setvehiculos] = useState<Vehiculo[]>([])

    useEffect(() => {
        getVehiculoSession();
    }, [])
    

    const getVehiculoById = async(idVehiculo: string): Promise <void> => {

        const result = await GetVehiculoByIdUseCase(idVehiculo);
        setvehiculos(result);
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

    const getVehiculoSession = async() => {
        const vehiculo = await GetVehiculoLocalUseCase();
        setvehiculo(vehiculo);
    }

    const removeVehiculoSession = async() => {
        await RemoveVehiculoLocalUseCase();
        setvehiculo(VehiculoInitialState);
    }

    const getAllVehiculos = async (): Promise<void> => {
        const result = await GetAllVehiculosUseCase();
        setvehiculos(Array.isArray(result) ? result : []);
    }

    const saveVehiculoSession = async(vehiculo: Vehiculo) => {
        await SaveVehiculoLocalUseCase(vehiculo);
        setvehiculo(vehiculo);
    }

    return(
        <VehiculoContext.Provider value={{
            vehiculo,
            vehiculos,
            getAllVehiculos,
            getVehiculoById,
            create,
            remove,
            getVehiculoSession,
            removeVehiculoSession,
            update,
            saveVehiculoSession
        }}>

            {children}
        </VehiculoContext.Provider>
    )
}