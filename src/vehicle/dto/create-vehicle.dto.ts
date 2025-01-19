import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateVehicleDto {
    @IsString()
    @IsNotEmpty()
    brand: string;

    @IsString()
    @IsNotEmpty()
    model: string;

    @IsNumber()
    @IsNotEmpty()
    productionYear: number;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsNumber()
    @IsNotEmpty()
    dailyPrice: number;

    @IsString()
    @IsNotEmpty()
    rentalCompanyId: string ;
}
