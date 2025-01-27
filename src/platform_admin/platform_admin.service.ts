import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { UpdateAdminDto } from '../rental-admin/dto/update-admin.dto';

@Injectable()
export class PlatformAdminService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) { }

    async findCurrentAdmin(userId: string): Promise<User> {
        const admin = await this.userModel.findOne({ _id: userId, role: 'platform_admin' });
        if (!admin) {
            throw new NotFoundException('Platform admin not found');
        }
        return admin;
    }

    async updateCurrentAdmin(userId: string, updateDto: UpdateAdminDto): Promise<User> {
        const admin = await this.userModel.findOne({ _id: userId, role: 'platform_admin' });
        if (!admin) {
            throw new NotFoundException('Platform admin not found');
        }

        if (updateDto.email) {
            const emailExists = await this.userModel.findOne({ email: updateDto.email, _id: { $ne: userId } });
            if (emailExists) {
                throw new BadRequestException('Email already in use');
            }
        }

        // Sprawdzenie i aktualizacja hasła, jeśli zostało dostarczone
        if (updateDto.password) {
            const hashedPassword = await bcrypt.hash(updateDto.password, 10);
            admin.password = hashedPassword;
        }

        // Aktualizacja pozostałych pól
        const { email, name, surname } = updateDto;
        if (email !== undefined) admin.email = email;
        if (name !== undefined) admin.name = name;
        if (surname !== undefined) admin.surname = surname;

        return admin.save();
    }

    async getCurrentAdmin(userId: string): Promise<User | null> {
        return this.userModel.findOne({ _id: userId, role: 'platform_admin' });
    }
}
