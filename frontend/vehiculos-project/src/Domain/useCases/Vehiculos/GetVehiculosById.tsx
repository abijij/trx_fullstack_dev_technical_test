import { VehiculosRepositoryImpl } from "../../../Data/repositories/VehiculosRepository";

const { findById } = new VehiculosRepositoryImpl

export const GetVehiculoByIdUseCase = async (idVehiculo: string) => {
    return await findById( idVehiculo)
}