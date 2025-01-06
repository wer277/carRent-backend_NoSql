import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateClientDto } from './dto/create-client.dto';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { LoginDto } from './dto/login.dto';
import { User } from './schemas/user.schema';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    
    // Logowanie użytkownika
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    // Tworzenie użytkowników z rolą `rental_admin` przez administratora platformy
    @Post('create-rental-admin')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('platform_admin') // Dostęp tylko dla platform_admin
    async createRentalAdmin(@Body() createAdminDto: CreateAdminDto, @Req() req): Promise<User> {
        return this.authService.createRentalAdmin(createAdminDto, req.user);
    }

    // Tworzenie użytkowników z rolą `employee` przez administratora wypożyczalni
    @Post('create-employee')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('rental_admin') // Dostęp tylko dla rental_admin
    async createEmployee(@Body() createEmployeeDto: CreateEmployeeDto, @Req() req): Promise<User> {
        return this.authService.createEmployee(createEmployeeDto, req.user);
    }
}
