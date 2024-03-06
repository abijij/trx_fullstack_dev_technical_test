import { Vehiculo } from "../../Domain/entities/Vehiculos";
import { VehiculoLocalRepository } from "../../Domain/repositories/VehiculoLocalRepository";

import { LocalStorage } from "../sources/local/LocalStorage";

export class VehiculoLocalRepositoruImpl implements VehiculoLocalRepository{
    async save(vehiculo: Vehiculo): Promise<void> {
       const { save } = LocalStorage();
       await save('user', JSON.stringify(vehiculo));
    }
   async getVehiculo(): Promise<Vehiculo> {
        const{getItem} = LocalStorage();
        const data = await getItem('vehiculo');
        const vehiculo: Vehiculo = JSON.parse(data as any);
        return vehiculo;
    }
    async remove(): Promise<void> {
        const {remove} = LocalStorage();
        await remove('vehiculo');
    }


}