import { IsString, IsOptional } from 'class-validator';

export class UpdateVehicleDto {
    @IsString()
    @IsOptional()
    brand?: string;

    @IsString()
    @IsOptional()
    model?: string;

    @IsString()
    @IsOptional()
    licensePlate?: string;

    @IsString()
    @IsOptional()
    status?: string;
}
