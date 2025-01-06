import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly jwtService: JwtService,
    ) { }

    // Logowanie użytkownika
    async login(loginUserDto: LoginDto) {
        const { email, password } = loginUserDto;

        const user = await this.validateUser(email, password);
        if (!user) {
            throw new BadRequestException('Invalid email or password');
        }

        const payload = { email: user.email, sub: user._id, role: user.role };
        const accessToken = this.jwtService.sign(payload);

        const isProfileComplete = user.role === 'client' ? user.isProfileComplete : null;

        return {
            access_token: accessToken,
            isProfileComplete,
        };
    }

    // Tworzenie administratora wypożyczalni przez administratora platformy
    async createRentalAdmin(createRentalAdminDto: CreateAdminDto, currentUser: User): Promise<User> {
        if (currentUser.role !== 'platform_admin') {
            throw new ForbiddenException('Only platform admins can create rental admins');
        }

        const { email, password, name, surname } = createRentalAdminDto;

        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const rentalAdmin = new this.userModel({
            email,
            password: hashedPassword,
            name,
            surname,
            role: 'rental_admin',
        });

        return rentalAdmin.save();
    }

    // Tworzenie pracownika przez administratora wypożyczalni
    async createEmployee(createEmployeeDto: CreateEmployeeDto, currentUser: User): Promise<User> {
        if (currentUser.role !== 'rental_admin') {
            throw new ForbiddenException('Only rental admins can create employees');
        }

        const { email, password, name, surname } = createEmployeeDto;

        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const employee = new this.userModel({
            email,
            password: hashedPassword,
            name,
            surname,
            role: 'employee',
        });

        return employee.save();
    }

    // Walidacja użytkownika
    async validateUser(email: string, password: string): Promise<UserDocument | null> {
        const user = await this.userModel.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        return null;
    }
}
