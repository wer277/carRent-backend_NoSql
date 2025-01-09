import { IsString, IsNotEmpty } from 'class-validator';

export class CreateVehicleDto {
    @IsString()
    @IsNotEmpty()
    brand: string;

    @IsString()
    @IsNotEmpty()
    model: string;

    @IsString()
    @IsNotEmpty()
    licensePlate: string;

    @IsString()
    @IsNotEmpty()
    rentalCompanyId: string;
}
