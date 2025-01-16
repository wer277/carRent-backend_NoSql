import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { LoginDto } from './dto/login.dto';
import { RentalAdminService } from '../rental-admin/rental-admin.service';
import { CreateAdminDto } from '../rental-admin/dto/create-admin.dto';
import { CreateEmployeeDto } from '../employee/dto/create-employee.dto';
import { EmployeeService } from '../employee/employee.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly rentalAdminService: RentalAdminService,
        private readonly employeeService: EmployeeService,
    ) { }

    // Logowanie
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    // Tworzenie administratora wypożyczalni
    @Post('create-rental-admin')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('platform_admin') // Dostęp tylko dla platform_admin
    async createRentalAdmin(@Body() createRentalAdminDto: CreateAdminDto, @Req() req) {
        return this.rentalAdminService.createRentalAdmin(createRentalAdminDto, req.user);
    }

    @Post('create-employee')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('rental_admin') // Tylko rental admin może tworzyć pracowników
    async createEmployee(@Body() createEmployeeDto: CreateEmployeeDto, @Req() req) {
        console.log('Decoded user:', req.user); // Log użytkownika
        const rentalAdminId = req.user.userId; // ID rental admina z tokena JWT

        return this.employeeService.createEmployee(createEmployeeDto, rentalAdminId);
    }

    @Get('rental-admins')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('platform_admin') // Tylko platform admin może wyświetlać listę rental_adminów
    async getAllRentalAdmins() {
        return this.authService.getAllRentalAdmins();
    }
}

