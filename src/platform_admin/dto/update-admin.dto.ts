// src/platform-admin/dto/update-platform-admin.dto.ts
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdatePlatformAdminDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    surname?: string;

    @IsString()
    @IsOptional()
    password?: string;
}
