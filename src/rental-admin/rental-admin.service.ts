import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { CreateAdminDto } from './dto/create-admin.dto';
import * as bcrypt from 'bcrypt';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class RentalAdminService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) { }

    async createRentalAdmin(createRentalAdminDto: CreateAdminDto, createdBy: User): Promise<User> {
        // Sprawdzenie, czy użytkownik tworzący ma rolę `platform_admin`
        if (createdBy.role !== 'platform_admin') {
            throw new ForbiddenException('Only platform admins can create rental admins');
        }

        const { email, password, name, surname } = createRentalAdminDto;

        // Sprawdzenie, czy email już istnieje
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        // Hashowanie hasła
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tworzenie nowego rental_admina
        const rentalAdmin = new this.userModel({
            email,
            password: hashedPassword,
            name,
            surname,
            role: 'rental_admin',
        });

        return rentalAdmin.save();
    }

    async updateRentalAdmin(id: string, updateAdminDto: UpdateAdminDto, user: User): Promise<User> {
        const admin = await this.userModel.findById(id);

        if (!admin || admin.role !== 'rental_admin') {
            throw new NotFoundException('Rental admin not found');
        }

        if (user.role !== 'platform_admin') {
            throw new ForbiddenException('Only platform admins can edit rental admins');
        }

        if (updateAdminDto.email) {
            const emailExists = await this.userModel.findOne({ email: updateAdminDto.email });
            if (emailExists && emailExists.id !== id) {
                throw new BadRequestException('Email already in use');
            }
        }

        // Sprawdzenie i aktualizacja hasła, jeśli zostało dostarczone
        if (updateAdminDto.password) {
            const hashedPassword = await bcrypt.hash(updateAdminDto.password, 10);
            admin.password = hashedPassword;
        }

        // Aktualizacja pozostałych pól (bez password, które już obsłużono)
        const { email, name, surname } = updateAdminDto;
        if (email !== undefined) admin.email = email;
        if (name !== undefined) admin.name = name;
        if (surname !== undefined) admin.surname = surname;

        return admin.save();
    }

    async deleteRentalAdmin(id: string, user: User): Promise<void> {
        // Znajdź użytkownika do usunięcia
        const admin = await this.userModel.findById(id);

        if (!admin || admin.role !== 'rental_admin') {
            throw new NotFoundException('Rental admin not found');
        }

        // Walidacja, czy użytkownik ma prawo do usunięcia
        if (user.role !== 'platform_admin') {
            throw new ForbiddenException('Only platform admins can delete rental admins');
        }

        // Usunięcie użytkownika
        await this.userModel.deleteOne({ _id: id }); // Używamy deleteOne()
    }

    async findAllRentalAdmins() {
        const rentalAdmins = await this.userModel.find({ role: 'rental_admin' }).exec();
        if (!rentalAdmins || rentalAdmins.length === 0) {
            throw new NotFoundException('No rental admins found');
        }
        return rentalAdmins;
    }

    // Pobieranie danych zalogowanego rental_admin
    async getCurrentRentalAdmin(userId: string): Promise<User> {
        const admin = await this.userModel.findOne({ _id: userId, role: 'rental_admin' });
        if (!admin) {
            throw new NotFoundException('Rental admin not found');
        }
        return admin;
    }

    // Edycja danych rental_admin
    async updateAdmin(userId: string, updateAdminDto: UpdateAdminDto): Promise<User> {
        const admin = await this.userModel.findOne({ _id: userId, role: 'rental_admin' });
        if (!admin) {
            throw new NotFoundException('Rental admin not found');
        }

        if (updateAdminDto.email) {
            const emailExists = await this.userModel.findOne({
                email: updateAdminDto.email,
                _id: { $ne: userId },
            });
            if (emailExists) {
                throw new BadRequestException('Email already in use');
            }
        }

        // Aktualizacja danych
        admin.name = updateAdminDto.name || admin.name;
        admin.surname = updateAdminDto.surname || admin.surname;
        admin.email = updateAdminDto.email || admin.email;

        return admin.save();
    }
}

