import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateVehicleDto {
    @IsString()
    @IsOptional()
    brand?: string;

    @IsString()
    @IsOptional()
    model?: string;

    @IsNumber()
    @IsOptional()
    productionYear?: number;

    @IsString()
    @IsOptional()
    location?: string;

    @IsNumber()
    @IsOptional()
    dailyPrice?: number;

    @IsString()
    @IsOptional()
    status?: string;
}
