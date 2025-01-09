import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateClientDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    role: string = 'client';
}
