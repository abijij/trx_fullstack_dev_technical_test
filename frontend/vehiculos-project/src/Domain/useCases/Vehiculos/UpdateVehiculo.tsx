import { VehiculosRepositoryImpl } from "../../../Data/repositories/VehiculosRepository";
import { Vehiculo } from "../../entities/Vehiculos";

const { update } = new VehiculosRepositoryImpl;

export const  UpdateVeiculoUseCase = async(vehiculo: Vehiculo) => {
    return await update(vehiculo);
}