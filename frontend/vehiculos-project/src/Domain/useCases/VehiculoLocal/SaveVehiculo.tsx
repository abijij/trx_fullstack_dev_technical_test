import { VehiculoLocalRepositoruImpl } from "../../../Data/repositories/VehiculoLocalRepository";
import { Vehiculo } from "../../entities/Vehiculos";

const { save} = new VehiculoLocalRepositoruImpl();
export const SaveVehiculoLocalUseCase = async(vehiculo: Vehiculo)=>{
    return await save(vehiculo);
}