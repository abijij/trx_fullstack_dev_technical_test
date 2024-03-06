import { VehiculoLocalRepositoruImpl } from "../../../Data/repositories/VehiculoLocalRepository";

const{ remove } = new VehiculoLocalRepositoruImpl();
export const RemoveVehiculoLocalUseCase = async() => {
    return await remove();
}