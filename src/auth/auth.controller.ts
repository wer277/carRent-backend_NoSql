import {Controller, Post, Body, Patch, Param, UseGuards, Req, Get, ForbiddenException} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { LoginDto } from './dto/login.dto';
import { User } from './schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // Rejestracja nowego klienta (publiczna)
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    // Logowanie użytkownika
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    // Tworzenie użytkowników z rolą `rental_admin` przez administratora platformy
    @Post('create-rental-admin')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('platform_admin') // Dostęp tylko dla platform_admin
    async createRentalAdmin(
        @Body() createUserDto: CreateUserDto,
        @Req() req,
    ): Promise<User> {
        return this.authService.createRentalAdmin(createUserDto, req.user);
    }

    // Tworzenie użytkowników z rolą `employee` przez administratora wypożyczalni
    @Post('create-employee')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('rental_admin') // Dostęp tylko dla rental_admin
    async createEmployee(
        @Body() createUserDto: CreateUserDto,
        @Req() req,
    ): Promise<User> {
        return this.authService.createEmployee(createUserDto, req.user);
    }

    // Dashboard dla różnych ról
    @Get('dashboard')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('client', 'employee', 'rental_admin', 'platform_admin')
    async getDashboard(@Req() req) {
        const role = req.user.role;
        if (role === 'client') {
            return { message: 'Welcome to the client dashboard' };
        } else if (role === 'employee') {
            return { message: 'Welcome to the employee dashboard' };
        } else if (role === 'rental_admin') {
            return { message: 'Welcome to the rental admin dashboard' };
        } else if (role === 'platform_admin') {
            return { message: 'Welcome to the platform admin dashboard' };
        }
        throw new ForbiddenException('Unauthorized access');
    }

    // Aktualizacja danych użytkownika
    @Patch('update-profile')
    @UseGuards(AuthGuard('jwt'), RolesGuard) // Dodanie RolesGuard
    @Roles('client', 'employee') // Tylko klient i pracownik mogą aktualizować profil
    async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
        return this.authService.updateProfile(req.user.userId, updateProfileDto);
    }
}
