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

    // Walidacja użytkownika
    async validateUser(email: string, password: string): Promise<UserDocument | null> {
        const user = await this.userModel.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        return null;
    }
}
