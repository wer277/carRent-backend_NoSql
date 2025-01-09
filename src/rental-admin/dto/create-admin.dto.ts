import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    surname: string;

    role: string = 'rental_admin';
}
