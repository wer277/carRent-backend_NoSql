import { Controller, Post, Body, UseGuards, Req, Patch, Param, Get } from '@nestjs/common';
import { RentalCompanyService } from './rental-company.service';
import { RentalCompanyDto } from './dto/create-rental-company.dto';
import { UpdateRentalCompanyDto } from './dto/update-rental-company.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('rental-company')
@UseGuards(AuthGuard('jwt'), RolesGuard) // Zabezpieczenie JWT i ról
export class RentalCompanyController {
    constructor(private readonly rentalCompanyService: RentalCompanyService) { }

    // Tworzenie wypożyczalni przez rental admina
    @Post('create')
    @Roles('rental_admin') // Tylko rental admin może tworzyć wypożyczalnie
    async createRentalCompany(@Body() createRentalCompanyDto: RentalCompanyDto, @Req() req) {
        const rentalAdminId = req.user.userId; // ID rental admina z tokena JWT
        return this.rentalCompanyService.createRentalCompany(createRentalCompanyDto, rentalAdminId);
    }

    // Aktualizacja wypożyczalni
    @Patch(':id')
    @Roles('rental_admin') // Tylko rental admin może aktualizować wypożyczalnie
    async updateRentalCompany(@Param('id') id: string, @Body() updateRentalCompanyDto: UpdateRentalCompanyDto, @Req() req) {
        const rentalAdminId = req.user.userId; // ID rental admina z tokena JWT
        return this.rentalCompanyService.updateRentalCompany(id, updateRentalCompanyDto, rentalAdminId);
    }

    // Pobieranie listy wypożyczalni zarządzanych przez rental admina
    @Get('my-companies')
    @Roles('rental_admin') // Tylko rental admin może przeglądać swoje wypożyczalnie
    async getRentalCompaniesByAdmin(@Req() req) {
        const rentalAdminId = req.user.userId; // ID rental admina z tokena JWT
        return this.rentalCompanyService.getRentalCompaniesByAdmin(rentalAdminId);
    }
}
