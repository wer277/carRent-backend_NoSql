import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { CreateAdminDto } from './dto/create-admin.dto';
import * as bcrypt from 'bcrypt';

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
}

