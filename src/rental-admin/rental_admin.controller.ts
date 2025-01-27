import { Controller, Put, Param, Body, UseGuards, Req, NotFoundException, ForbiddenException, Delete, Get } from '@nestjs/common';
import { RentalAdminService } from './rental-admin.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('rental-admins')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RentalAdminController {
    constructor(private readonly rentalAdminService: RentalAdminService) { }

    @Get('rental_admin_list') 
    @Roles('platform_admin') // Dostęp tylko dla platform_admin
    async getRentalAdminList() {
        return this.rentalAdminService.findAllRentalAdmins();
    }

    @Put(':id')
    @Roles('platform_admin') // Dostęp tylko dla platform_admin
    async updateRentalAdmin(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto, @Req() req) {
        return this.rentalAdminService.updateRentalAdmin(id, updateAdminDto, req.user);
    }

    @Delete(':id')
    @Roles('platform_admin') // Dostęp tylko dla platform_admin
    async deleteRentalAdmin(@Param('id') id: string, @Req() req) {
        return this.rentalAdminService.deleteRentalAdmin(id, req.user);
    }

    // Pobranie danych zalogowanego rental_admin
    @Get('profile')
    @Roles('rental_admin')
    async getCurrentRentalAdmin(@Req() req) {
        const userId = req.user.userId;
        const admin = await this.rentalAdminService.getCurrentRentalAdmin(userId);
        if (!admin) {
            throw new NotFoundException('Rental admin not found');
        }
        return admin;
    }

    // Edycja danych zalogowanego rental_admin
    @Put('profile')
    @Roles('rental_admin')
    async updateRentalAdminProfile(
        @Req() req,
        @Body() updateAdminDto: UpdateAdminDto,
    ) {
        const userId = req.user.userId;
        return this.rentalAdminService.updateAdmin(userId, updateAdminDto);
    }
}
