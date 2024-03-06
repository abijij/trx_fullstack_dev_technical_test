import { VehiculosRepositoryImpl } from "../../../Data/repositories/VehiculosRepository";

const { searchByBrand } = new VehiculosRepositoryImpl

export const GetVehiculosByBrandUseCase = async (brand: string) => {
    return await searchByBrand(brand);
}