import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly jwtService: JwtService,
    ) { }

    // Logowanie użytkownika
    async login(loginUserDto: LoginDto) {
        const { email, password } = loginUserDto;

        const user = await this.userModel.findOne({ email });

        if (!user) {
            throw new BadRequestException('Invalid email or password');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new BadRequestException('Invalid email or password');
        }

        const payload = {
            email: user.email,
            sub: user._id.toString(),
            role: user.role,
            rentalCompanyIds: user.rentalCompanyIds || [],
        };

        const accessToken = this.jwtService.sign(payload);

        return {
            access_token: accessToken,
            role: user.role,
            isProfileComplete: user.role === 'client' ? user.isProfileComplete : true,
        };
    }

    // Walidacja użytkownika
    async validateUser(email: string, password: string): Promise<UserDocument | null> {
        const user = await this.userModel.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        return null;
    }

    async getAllRentalAdmins(): Promise<User[]> {
        return this.userModel.find({ role: 'rental_admin' }, '-password').exec(); // Wyklucz hasło z wyników
    }
}
