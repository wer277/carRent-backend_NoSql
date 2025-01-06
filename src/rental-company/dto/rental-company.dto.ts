import { IsOptional, IsString } from "class-validator";

export class UpdateRentalCompanyDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    contactEmail?: string;

    @IsOptional()
    @IsString()
    contactPhone?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    rentalPolicy?: string;

    @IsOptional()
    @IsString()
    discountPolicy?: string;
}