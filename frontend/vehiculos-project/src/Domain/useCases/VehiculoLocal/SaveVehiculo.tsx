import { VehiculoLocalRepositoruImpl } from "../../../Data/repositories/VehiculoLocalRepository";
import { Vehiculo } from "../../entities/Vehiculos";

const { save} = new VehiculoLocalRepositoruImpl();
export const SaveVehiculosLocalUseCase = async (vehiculos: Vehiculo[]): Promise<Vehiculo[]> => {
    await save(vehiculos);
    return vehiculos;
  };