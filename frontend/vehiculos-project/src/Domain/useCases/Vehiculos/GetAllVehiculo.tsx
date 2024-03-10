import { VehiculosRepositoryImpl } from "../../../Data/repositories/VehiculosRepository";

const { getAll } = new VehiculosRepositoryImpl();

export const GetAllVehiculosUseCase = async () => {
    return await getAll();
}
