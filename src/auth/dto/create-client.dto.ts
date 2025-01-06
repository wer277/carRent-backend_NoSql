import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsIn,IsEnum } from 'class-validator';

export class CreateClientDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    surname?: string;

    @IsOptional()
    @IsEnum(['client', 'rental_admin'], {
        message: 'Invalid role. Valid roles are: client, rental_admin',
    })
    role?: string;
}
