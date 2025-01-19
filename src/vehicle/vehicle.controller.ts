import { Controller, Post, Body, Patch, Param, Get, Delete, UseGuards, Req } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { BadRequestException } from '@nestjs/common';

@Controller('vehicles')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class VehicleController {
    constructor(private readonly vehicleService: VehicleService) { }

    @Post('create')
    @Roles('employee')
    async createVehicle(@Body() createVehicleDto: CreateVehicleDto, @Req() req) {
        const rentalCompanyIds = req.user.rentalCompanyIds;
        const rentalCompanyId = Array.isArray(rentalCompanyIds) && rentalCompanyIds.length > 0
            ? rentalCompanyIds[0]
            : null;

        if (!rentalCompanyId) {
            throw new BadRequestException('No rental company ID associated with user.');
        }

        return this.vehicleService.createVehicle({
            ...createVehicleDto,
            rentalCompanyId,
        });
    }


    @Patch('update/:id')
    @Roles('employee')
    async updateVehicle(@Param('id') vehicleId: string, @Body() updateVehicleDto: UpdateVehicleDto, @Req() req) {
        const userRentalCompanyIds = req.user.rentalCompanyIds;
        return this.vehicleService.updateVehicle(vehicleId, updateVehicleDto, userRentalCompanyIds);
    }

    @Get()
    @Roles('employee')
    async getAllVehicles(@Req() req) {
        const userRentalCompanyIds = req.user.rentalCompanyIds;
        return this.vehicleService.getAllVehicles(userRentalCompanyIds);
    }

    @Get(':id')
    @Roles('employee')
    async getVehicleById(@Param('id') id: string, @Req() req) {
        const userRentalCompanyIds = req.user.rentalCompanyIds;
        return this.vehicleService.getVehicleById(id, userRentalCompanyIds);
    }

    @Delete('delete/:id')
    @Roles('employee')
    async deleteVehicle(@Param('id') id: string, @Req() req) {
        const userRentalCompanyIds = req.user.rentalCompanyIds;
        return this.vehicleService.deleteVehicle(id, userRentalCompanyIds);
    }
}
