import { Injectable, BadRequestException, ForbiddenException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ) { }

    // Rejestracja nowego klienta
    async register(createUserDto: CreateUserDto): Promise<User> {
        const { email, password } = createUserDto;

        const user = await this.userModel.findOne({ email });
        if (user) {
            throw new BadRequestException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = new this.userModel({
            email,
            password: hashedPassword,
            role: 'client', // Domyślna rola klienta
        });

        return createdUser.save();
    }

    // Logowanie użytkownika
    async login(loginUserDto: LoginDto) {
        const { email, password } = loginUserDto;

        const user = await this.validateUser(email, password);
        if (!user) {
            throw new BadRequestException('Invalid email or password');
        }

        const payload = { email: user.email, sub: user._id, role: user.role };
        const accessToken = this.jwtService.sign(payload);

        // Sprawdź, czy profil użytkownika jest kompletny
        const isProfileComplete = user.isProfileComplete;

        return {
            access_token: accessToken,
            isProfileComplete, // Informacja o stanie profilu
        };
    }

    // Tworzenie administratorów wypożyczalni przez administratora platformy
    async createRentalAdmin(createUserDto: CreateUserDto, currentUser: User): Promise<User> {
        if (currentUser.role !== 'platform_admin') {
            throw new ForbiddenException('Only platform admins can create rental admins');
        }

        return this.createUser(createUserDto, 'rental_admin');
    }

    // Tworzenie pracowników przez administratora wypożyczalni
    async createEmployee(createUserDto: CreateUserDto, currentUser: User): Promise<User> {
        if (currentUser.role !== 'rental_admin') {
            throw new ForbiddenException('Only rental admins can create employees');
        }

        return this.createUser(createUserDto, 'employee');
    }

    // Metoda pomocnicza do tworzenia użytkowników
    private async createUser(
        createUserDto: CreateUserDto,
        role: string,
    ): Promise<User> {
        const { email, password, name, surname } = createUserDto;

        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new this.userModel({
            email,
            password: hashedPassword,
            name,
            surname,
            role,
        });

        return newUser.save();
    }

    // Walidacja użytkownika
    async validateUser(email: string, password: string): Promise<UserDocument | null> {
        const user = await this.userModel.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        return null;
    }

    // Aktualizacja danych użytkownika
    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new BadRequestException('User not found');
        }

        // Aktualizacja danych użytkownika
        user.name = updateProfileDto.name || user.name;
        user.surname = updateProfileDto.surname || user.surname;
        user.phoneNumber = updateProfileDto.phoneNumber || user.phoneNumber;
        user.city = updateProfileDto.city || user.city;
        user.street = updateProfileDto.street || user.street;
        user.houseNumber = updateProfileDto.houseNumber || user.houseNumber;
        user.postalCode = updateProfileDto.postalCode || user.postalCode;
        user.carPreferences = updateProfileDto.carPreferences || user.carPreferences;

        // Oznacz profil jako kompletny
        user.isProfileComplete = true;

        return user.save();
    }
}
