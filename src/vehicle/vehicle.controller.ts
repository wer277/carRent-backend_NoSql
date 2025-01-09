import { Controller, Post, Body, Patch, Param, Get, Query, UseGuards } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('vehicles')
@UseGuards(AuthGuard('jwt'), RolesGuard) // Dodaj Guard JWT i RolesGuard
export class VehicleController {
    constructor(private readonly vehicleService: VehicleService) { }

    @Post()
    @Roles('employee') // Dostęp tylko dla pracowników
    async createVehicle(@Body() createVehicleDto: CreateVehicleDto) {
        return this.vehicleService.createVehicle(createVehicleDto);
    }

    @Patch(':id')
    @Roles('employee') // Dostęp tylko dla pracowników
    async updateVehicle(@Param('id') vehicleId: string, @Body() updateVehicleDto: UpdateVehicleDto) {
        return this.vehicleService.updateVehicle(vehicleId, updateVehicleDto);
    }

    @Get()
    @Roles('employee') // Dostęp tylko dla pracowników
    async getAllVehicles(@Query('rentalCompanyId') rentalCompanyId: string) {
        return this.vehicleService.getAllVehicles(rentalCompanyId);
    }
}
