import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { RentalCompany, RentalCompanyDocument } from '../rental-company/schemas/rental-company.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @InjectModel(RentalCompany.name) private readonly rentalCompanyModel: Model<RentalCompanyDocument>,
    ) { }

    async createEmployee(createEmployeeDto: CreateEmployeeDto, rentalAdminId: string): Promise<User> {
        const { email, password, name, surname, rentalCompanyId } = createEmployeeDto;

        // Sprawdź, czy rentalCompanyId jest przypisana do rental_admina
        const rentalCompany = await this.rentalCompanyModel.findById(rentalCompanyId);
        if (!rentalCompany) {
            throw new BadRequestException('Rental company does not exist');
        }

        if (rentalCompany.createdBy !== rentalAdminId) {
            throw new ForbiddenException('You are not authorized to create employees for this rental company');
        }

        // Sprawdź, czy email już istnieje
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        // Tworzenie nowego pracownika
        const hashedPassword = await bcrypt.hash(password, 10);
        const newEmployee = new this.userModel({
            email,
            password: hashedPassword,
            name,
            surname,
            role: 'employee',
            rentalCompanyIds: [rentalCompanyId], // Przypisanie pracownika do wypożyczalni
        });

        return newEmployee.save();
    }
}
