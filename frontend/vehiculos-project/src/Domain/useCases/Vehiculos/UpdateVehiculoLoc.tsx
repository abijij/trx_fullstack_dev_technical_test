import { VehiculosRepositoryImpl } from "../../../Data/repositories/VehiculosRepository";

const { updateLoc } = new VehiculosRepositoryImpl();

export const UpdateVehiculoLocUseCase = async(id: string, lat: string, lng: string, ubicacion: string) =>{
    return await updateLoc(id, lat, lng, ubicacion);
}