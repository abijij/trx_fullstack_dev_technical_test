import { VehiculoLocalRepositoruImpl } from "../../../Data/repositories/VehiculoLocalRepository";

const {getVehiculo} = new VehiculoLocalRepositoruImpl();

export const GetVehiculoLocalUseCase = async () => {
    return await getVehiculo();
}