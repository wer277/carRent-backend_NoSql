import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateAdminDto {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    surname?: string;

    @IsOptional()
    @IsString()
    password?: string;
}
