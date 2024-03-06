import { VehiculosRepositoryImpl } from "../../../Data/repositories/VehiculosRepository";
import { Vehiculo } from "../../entities/Vehiculos";

const {create} = new VehiculosRepositoryImpl();

export const CreateVehiculoUseCase = async(vehiculo: Vehiculo) => {
    return await create(vehiculo);
}
