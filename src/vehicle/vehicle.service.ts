import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle, VehicleDocument } from './schemas/vehicle.schema';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehicleService {
    constructor(@InjectModel(Vehicle.name) private readonly vehicleModel: Model<VehicleDocument>) { }

    // Tworzenie pojazdu
    async createVehicle(createVehicleDto: CreateVehicleDto, userRentalCompanyIds: string[]): Promise<Vehicle> {
        const { rentalCompanyId } = createVehicleDto;

        // Sprawdź, czy użytkownik ma dostęp do danej wypożyczalni
        if (!userRentalCompanyIds.includes(rentalCompanyId)) {
            throw new ForbiddenException('You do not have access to this rental company');
        }

        const newVehicle = new this.vehicleModel(createVehicleDto);
        return newVehicle.save();
    }

    // Aktualizacja pojazdu
    async updateVehicle(
        vehicleId: string,
        updateVehicleDto: UpdateVehicleDto,
        userRentalCompanyIds: string[],
    ): Promise<Vehicle> {
        const vehicle = await this.vehicleModel.findById(vehicleId);
        if (!vehicle) {
            throw new NotFoundException('Vehicle not found');
        }

        // Sprawdź, czy pojazd należy do wypożyczalni użytkownika
        if (!userRentalCompanyIds.includes(vehicle.rentalCompanyId.toString())) {
            throw new ForbiddenException('You do not have access to this vehicle');
        }

        Object.assign(vehicle, updateVehicleDto);
        vehicle.updatedAt = new Date(); // Aktualizacja znacznika czasu
        return vehicle.save();
    }

    // Pobieranie wszystkich pojazdów dla wypożyczalni
    async getAllVehicles(userRentalCompanyIds: string[]): Promise<Vehicle[]> {
        return this.vehicleModel.find({ rentalCompanyId: { $in: userRentalCompanyIds } }).exec();
    }
}
