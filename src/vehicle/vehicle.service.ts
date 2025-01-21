import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
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
    async updateVehicle(
        vehicleId: string,
        updateVehicleDto: UpdateVehicleDto,
        userRentalCompanyIds: string[],
    ): Promise<Vehicle> {
        const vehicle = await this.vehicleModel.findById(vehicleId);
        if (!vehicle) {
            throw new NotFoundException('Vehicle not found');
        }

        if (!userRentalCompanyIds.includes(vehicle.rentalCompanyId.toString())) {
            throw new ForbiddenException('You do not have access to this vehicle');
        }

        Object.assign(vehicle, updateVehicleDto);
        vehicle.set('updatedAt', new Date());  // Ustawienie pola `updatedAt` poprawnym sposobem
        return vehicle.save();
    }


    // Pobieranie wszystkich pojazdów dla wypożyczalni
    async getAllVehicles(userRentalCompanyIds: string[]): Promise<Vehicle[]> {
        return this.vehicleModel.find({ rentalCompanyId: { $in: userRentalCompanyIds } }).exec();
    }

    // Pobranie pojazdu po ID
    async getVehicleById(vehicleId: string, userRentalCompanyIds: string[]): Promise<Vehicle> {
        const vehicle = await this.vehicleModel.findById(vehicleId);
        if (!vehicle) {
            throw new NotFoundException('Vehicle not found');
        }

        if (!userRentalCompanyIds.includes(vehicle.rentalCompanyId.toString())) {
            throw new ForbiddenException('You do not have access to this vehicle');
        }

        return vehicle;
    }

    // Usuwanie pojazdu
    async deleteVehicle(vehicleId: string, userRentalCompanyIds: string[]): Promise<void> {
        const vehicle = await this.vehicleModel.findById(vehicleId);
        if (!vehicle) {
            throw new NotFoundException('Vehicle not found');
        }

        if (!userRentalCompanyIds.includes(vehicle.rentalCompanyId.toString())) {
            throw new ForbiddenException('You do not have access to this vehicle');
        }

        await this.vehicleModel.findByIdAndDelete(vehicleId);
    }

    async getAllVehiclesForClients() {
        return this.vehicleModel.find().exec();
    }
}
