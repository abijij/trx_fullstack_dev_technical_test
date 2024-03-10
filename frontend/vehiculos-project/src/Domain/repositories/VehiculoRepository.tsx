import { ResponseApiVehiculos } from '../../Data/sources/remote/Models/ResponseApiDelivery';
import { Vehiculo } from '../entities/Vehiculos';

export interface VehiculoRepository{

    create(vehiculo: Vehiculo): Promise<ResponseApiVehiculos>;

    findById(idVehiculo: string): Promise<Vehiculo[]>;

    update(vehiculo:Vehiculo): Promise<ResponseApiVehiculos>;

    remove(vehiculo: Vehiculo): Promise<ResponseApiVehiculos>;

    searchByModel(model: string): Promise<Vehiculo[]>;

    searchByYear(year: number): Promise<Vehiculo[]>;

    searchByBrand(brand: string): Promise<Vehiculo[]>;

    getAll(): Promise <Vehiculo[]>;

    updateLoc(id: string, lat: string, lng: string, ubicacion: string): Promise<ResponseApiVehiculos>;
}   