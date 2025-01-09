import { Controller, Post, Body, Patch, Param, Get, UseGuards, Req } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('vehicles')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class VehicleController {
    constructor(private readonly vehicleService: VehicleService) { }

    @Post('create-vehicle')
    @Roles('employee') // Tylko pracownik może tworzyć pojazdy
    async createVehicle(@Body() createVehicleDto: CreateVehicleDto, @Req() req) {
        console.log(req.user)
        const userRentalCompanyIds = req.user.rentalCompanyIds;
        return this.vehicleService.createVehicle(createVehicleDto, userRentalCompanyIds);
    }

    @Patch(':id')
    @Roles('employee') // Tylko pracownik może aktualizować pojazdy
    async updateVehicle(@Param('id') vehicleId: string, @Body() updateVehicleDto: UpdateVehicleDto, @Req() req) {
        const userRentalCompanyIds = req.user.rentalCompanyIds;
        return this.vehicleService.updateVehicle(vehicleId, updateVehicleDto, userRentalCompanyIds);
    }

    @Get('all-vehicles')
    @Roles('employee') // Tylko pracownik może przeglądać pojazdy
    async getAllVehicles(@Req() req) {
        const userRentalCompanyIds = req.user.rentalCompanyIds;
        return this.vehicleService.getAllVehicles(userRentalCompanyIds);
    }
}
