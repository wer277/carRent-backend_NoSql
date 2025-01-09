import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { RentalCompanyService } from './rental-company.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UpdateRentalCompanyDto } from './dto/rental-company.dto';

@Controller('rental-company')
export class RentalCompanyController {
    constructor(private readonly rentalCompanyService: RentalCompanyService) { }

    @Post('create')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('rental_admin') // Tylko Rental Admin może dodawać wypożyczalnie
    async createRentalCompany(
        @Body() createRentalCompanyDto: UpdateRentalCompanyDto,
        @Req() req,
    ) {
        const createdBy = req.user.userId; // ID Rental Admina z tokena JWT
        return this.rentalCompanyService.createRentalCompany(createRentalCompanyDto, createdBy);
    }
}
