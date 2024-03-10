import { VehiculosRepositoryImpl } from "../../../Data/repositories/VehiculosRepository";

const{searchByModel} = new VehiculosRepositoryImpl

export const GetVehiculoByModelUseCase = async (model: string) => {

    return await searchByModel (model);
}