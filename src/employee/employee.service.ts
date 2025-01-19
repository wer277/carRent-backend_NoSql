// employee.service.ts (dodane funkcje)
import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
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
        const rentalCompany = await this.rentalCompanyModel.findById(rentalCompanyId);
        if (!rentalCompany) {
            throw new BadRequestException('Rental company does not exist');
        }
        if (rentalCompany.createdBy.toString() !== rentalAdminId) {
            throw new ForbiddenException('You are not authorized to create employees for this rental company');
        }
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newEmployee = new this.userModel({
            email,
            password: hashedPassword,
            name,
            surname,
            role: 'employee',
            rentalCompanyIds: [rentalCompanyId],
        });
        return newEmployee.save();
    }

    async updateEmployee(id: string, updateEmployeeDto: UpdateEmployeeDto, rentalAdminId: string): Promise<User> {
        const employee = await this.userModel.findById(id);
        if (!employee) {
            throw new NotFoundException('Employee not found');
        }
        if (employee.role !== 'employee') {
            throw new BadRequestException('User is not an employee');
        }
        const currentRentalCompanyId = employee.rentalCompanyIds[0];
        const rentalCompany = await this.rentalCompanyModel.findById(currentRentalCompanyId);
        if (!rentalCompany || rentalCompany.createdBy.toString() !== rentalAdminId) {
            throw new ForbiddenException('You are not authorized to update this employee');
        }
        if (updateEmployeeDto.rentalCompanyId) {
            const newRentalCompany = await this.rentalCompanyModel.findById(updateEmployeeDto.rentalCompanyId);
            if (!newRentalCompany) {
                throw new BadRequestException('New rental company does not exist');
            }
            if (newRentalCompany.createdBy.toString() !== rentalAdminId) {
                throw new ForbiddenException('You are not authorized to assign employee to this rental company');
            }
            employee.rentalCompanyIds = [updateEmployeeDto.rentalCompanyId];
        }
        if (updateEmployeeDto.email) employee.email = updateEmployeeDto.email;
        if (updateEmployeeDto.name) employee.name = updateEmployeeDto.name;
        if (updateEmployeeDto.surname) employee.surname = updateEmployeeDto.surname;
        if (updateEmployeeDto.password) {
            employee.password = await bcrypt.hash(updateEmployeeDto.password, 10);
        }
        return employee.save();
    }

    async deleteEmployee(id: string, rentalAdminId: string): Promise<User> {
        const employee = await this.userModel.findById(id);
        if (!employee) {
            throw new NotFoundException('Employee not found');
        }
        if (employee.role !== 'employee') {
            throw new BadRequestException('User is not an employee');
        }
        const rentalCompanyId = employee.rentalCompanyIds[0];
        const rentalCompany = await this.rentalCompanyModel.findById(rentalCompanyId);
        if (!rentalCompany || rentalCompany.createdBy.toString() !== rentalAdminId) {
            throw new ForbiddenException('You are not authorized to delete this employee');
        }
        await this.userModel.findByIdAndDelete(id);
        return employee;
    }

    async getEmployeesByRentalCompany(rentalCompanyId: string, rentalAdminId: string): Promise<User[]> {
        const rentalCompany = await this.rentalCompanyModel.findById(rentalCompanyId);
        if (!rentalCompany) {
            throw new BadRequestException('Rental company does not exist');
        }
        if (rentalCompany.createdBy.toString() !== rentalAdminId) {
            throw new ForbiddenException('You are not authorized to view employees of this rental company');
        }
        return this.userModel.find({ role: 'employee', rentalCompanyIds: rentalCompanyId }).exec();
    }
}
