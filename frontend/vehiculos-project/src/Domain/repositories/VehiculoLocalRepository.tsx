import { Vehiculo } from "../entities/Vehiculos";

export interface VehiculoLocalRepository{

    save(vehiculo: Vehiculo): Promise<void>;

    getVehiculo(): Promise<Vehiculo>;

    remove(): Promise<void>;
}