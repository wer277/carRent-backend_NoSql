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

    @Get('rental_admin_list') // Nowa nazwa endpointu
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
}
