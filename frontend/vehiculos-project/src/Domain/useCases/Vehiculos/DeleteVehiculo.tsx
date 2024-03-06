import { VehiculosRepositoryImpl } from "../../../Data/repositories/VehiculosRepository";
import { Vehiculo } from "../../entities/Vehiculos";

const { remove } =  new VehiculosRepositoryImpl();

export const DeleteVehiculoUseCase = async(vehiculo: Vehiculo) => {
    return await remove(vehiculo);
}