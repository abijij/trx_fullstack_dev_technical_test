import { VehiculosRepositoryImpl } from "../../../Data/repositories/VehiculosRepository";

const { searchByYear } = new VehiculosRepositoryImpl

export const  GetVehiculoByYearUseCase = async (year: number) => {
    return await searchByYear(year);
}