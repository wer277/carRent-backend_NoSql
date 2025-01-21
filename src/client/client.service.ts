import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { CreateClientDto } from '../auth/dto/create-client.dto';
import { UpdateClientProfileDto } from './dto/update-client-profile.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClientService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) { }

    // Rejestracja klienta
    async registerClient(createClientDto: CreateClientDto): Promise<User> {
        const { email, password } = createClientDto;

        const client = await this.userModel.findOne({ email });

        if (client) {
            throw new BadRequestException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newClient = new this.userModel({
            email,
            password: hashedPassword,
            role: 'client',
            isProfileComplete: false,
        });

        return newClient.save();
    }

    // Aktualizacja profilu klienta
    async updateClientProfile(userId: string, updateClientProfileDto: UpdateClientProfileDto): Promise<User> {
        const client = await this.userModel.findById(userId);

        if (!client) {
            throw new BadRequestException('Client not found');
        }

        if (client.role !== 'client') {
            throw new ForbiddenException('You are not allowed to update this profile');
        }

        Object.assign(client, updateClientProfileDto);
        client.isProfileComplete = true;

        return client.save();
    }

    // Pobranie profilu klienta
    async getClientProfile(userId: string): Promise<User> {
        const client = await this.userModel.findById(userId).select('-password');

        if (!client) {
            throw new BadRequestException('Client not found');
        }

        return client;
    }

    async updateProfile(userId: string, updateData: any): Promise<User> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        // Aktualizujemy pola profilu na podstawie updateData
        user.name = updateData.name;
        user.surname = updateData.surname;
        user.phoneNumber = updateData.phoneNumber;
        user.city = updateData.city;
        user.street = updateData.street;
        user.houseNumber = updateData.houseNumber;
        user.postalCode = updateData.postalCode;
        // Ustawiamy flagę profilu kompletnego
        user.isProfileComplete = true;
        return user.save();
    }
}
