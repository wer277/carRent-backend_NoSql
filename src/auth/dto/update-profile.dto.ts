import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    surname?: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    street?: string;

    @IsOptional()
    @IsString()
    houseNumber?: string;

    @IsOptional()
    @IsString()
    postalCode?: string;

    @IsOptional()
    carPreferences?: Record<string, any>;
}
