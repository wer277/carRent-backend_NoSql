import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle, VehicleDocument } from './schemas/vehicle.schema';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehicleService {
    constructor(@InjectModel(Vehicle.name) private readonly vehicleModel: Model<VehicleDocument>) { }

    // Tworzenie pojazdu
    async createVehicle(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
        const newVehicle = new this.vehicleModel(createVehicleDto);
        return newVehicle.save();
    }

    // Aktualizacja pojazdu
    async updateVehicle(vehicleId: string, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
        const updatedVehicle = await this.vehicleModel.findByIdAndUpdate(vehicleId, updateVehicleDto, { new: true });

        if (!updatedVehicle) {
            throw new NotFoundException('Vehicle not found');
        }

        return updatedVehicle;
    }

    // Pobieranie wszystkich pojazdów dla wypożyczalni
    async getAllVehicles(rentalCompanyId: string): Promise<Vehicle[]> {
        return this.vehicleModel.find({ rentalCompanyId }).exec();
    }
}
