import { IsEmail, IsNotEmpty, IsString, IsArray } from 'class-validator';

export class CreateEmployeeDto {
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

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    rentalCompanyIds: string[];
}
