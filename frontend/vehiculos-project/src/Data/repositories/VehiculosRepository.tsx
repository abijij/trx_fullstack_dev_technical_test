import { AxiosError } from 'axios';
import { Vehiculo } from '../../Domain/entities/Vehiculos';
import { VehiculoRepository } from '../../Domain/repositories/VehiculoRepository';
import { ResponseApiVehiculos } from '../sources/remote/Models/ResponseApiDelivery';
import {ApiVehiculos} from '../sources/remote/api/ApiVehiculos';

export class VehiculosRepositoryImpl implements VehiculoRepository{
    async create(vehiculo: Vehiculo): Promise<ResponseApiVehiculos> {
        try {
            const response = await ApiVehiculos.post<ResponseApiVehiculos>('/vehiculos/create', vehiculo);
            return Promise.resolve(response.data);
        } catch (error) {
            let e = (error as AxiosError);
            console.log('ERROR: ' + JSON.stringify(e.response?.data));
            const apiError: ResponseApiVehiculos = JSON.parse(JSON.stringify(e.response?.data));
            return Promise.resolve(apiError);
        }

    }
    async findById(idVehiculo: string): Promise<Vehiculo[]> {
        try {
            const response = await ApiVehiculos.get<Vehiculo[]>(`/vehiculos/findById/${idVehiculo}`);
            return Promise.resolve(response.data);
        } catch (error) {
            let e = (error as AxiosError);
            console.log('ERROR: ' + JSON.stringify(e.response?.data));
            return Promise.resolve([]);
            
        }
    }
    async update(vehiculo: Vehiculo): Promise<ResponseApiVehiculos> {
        try {
            const response = await ApiVehiculos.put<ResponseApiVehiculos>(`/vehiculos/update`, vehiculo);
            return Promise.resolve(response.data);
        } catch (error) {
            let e = (error as AxiosError);
            console.log('ERROR: ' + JSON.stringify(e.response?.data));
            const apiError: ResponseApiVehiculos = JSON.parse(JSON.stringify(e.response?.data));
            return Promise.resolve(apiError)
        }
    }
    async remove(vehiculo: Vehiculo): Promise<ResponseApiVehiculos> {
        try {
            const response= await ApiVehiculos.delete<ResponseApiVehiculos>(`/vehiculos/delete/${vehiculo.id}`);
            return Promise.resolve(response.data);
        } catch (error) {
            let e = (error as AxiosError);
            console.log('ERROR: ' + JSON.stringify(e.response?.data));
            const apiError: ResponseApiVehiculos = JSON.parse(JSON.stringify(e.response?.data));
            return Promise.resolve(apiError)
            
        }
    }
    async searchByModel(model: string): Promise<Vehiculo[]> {
        try {
            const response = await ApiVehiculos.get<Vehiculo[]>(`/vehiculos/searchByModel/${model}`);
            return Promise.resolve(response.data);
        } catch (error) {
            let e = (error as AxiosError);
                console.log('ERROR: ' + JSON.stringify(e.response?.data));
                return Promise.resolve([]);
        }
    }
    async searchByYear(year: number): Promise<Vehiculo[]> {
        try {
            const response = await ApiVehiculos.get<Vehiculo[]>(`/vehiculos/searchByYear/${year}`);
            return Promise.resolve(response.data);
        } catch (error) {
            let e = (error as AxiosError);
                console.log('ERROR: ' + JSON.stringify(e.response?.data));
                return Promise.resolve([]);
        }
    }
    async searchByBrand(brand: string): Promise<Vehiculo[]> {
        try {
            const response = await ApiVehiculos.get<Vehiculo[]>(`/vehiculos/searchByBrand/${brand}`);
            return Promise.resolve(response.data);
        } catch (error) {
            let e = (error as AxiosError);
                console.log('ERROR: ' + JSON.stringify(e.response?.data));
                return Promise.resolve([]);
        }
    }
    async getAll(): Promise<Vehiculo[]> {
        try {
            const response = await ApiVehiculos.get<Vehiculo[]>(`/vehiculos/getAll`);
            return Promise.resolve(response.data)
        } catch (error) {
            let e = (error as AxiosError);
            console.log('ERROR: ' + JSON.stringify(e.response?.data));
            return Promise.resolve([]);
        }
    }

    async updateLoc(id: string, lat: string, lng: string , ubicacion: string): Promise<ResponseApiVehiculos> {

        try {

            // Hacemos una solicitud HTTP POST para registrar el usuario en la API
            const response = await ApiVehiculos.put<ResponseApiVehiculos>('/vehiculos/updateLoc', {
                id: id,
                lat: lat,
                lng: lng,
                ubicacion: ubicacion
            });
            return Promise.resolve(response.data);

        } catch (error) {
            // Si hay un error en la solicitud, lo manejamos y devolvemos un objeto de error de la API
            let e = (error as AxiosError);
            console.log('ERROR: ' + JSON.stringify(e.response?.data));
            const apiError: ResponseApiVehiculos = JSON.parse(JSON.stringify(e.response?.data));
            return Promise.resolve(apiError)
        }


    }
    
}