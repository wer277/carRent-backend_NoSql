import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeeService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) { }

    async createEmployee(createEmployeeDto: CreateEmployeeDto, createdBy: User): Promise<User> {
        // Sprawdzenie, czy użytkownik tworzący ma rolę `rental_admin`
        if (createdBy.role !== 'rental_admin') {
            throw new ForbiddenException('Only rental admins can create employees');
        }

        const { email, password, name, surname } = createEmployeeDto;

        // Sprawdzenie, czy email już istnieje
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        // Hashowanie hasła
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tworzenie nowego pracownika
        const employee = new this.userModel({
            email,
            password: hashedPassword,
            name,
            surname,
            role: 'employee',
        });

        return employee.save();
    }
}
