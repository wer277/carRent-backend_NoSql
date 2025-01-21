import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation, ReservationDocument } from './reservation.schema';
import { Vehicle, VehicleDocument } from '../../vehicle/schemas/vehicle.schema';

@Injectable()
export class ReservationService {
    constructor(
        @InjectModel(Reservation.name) private readonly reservationModel: Model<ReservationDocument>,
        @InjectModel(Vehicle.name) private readonly vehicleModel: Model<VehicleDocument>,
    ) { }

    async createReservation(
        clientId: string,
        vehicleId: string,
        startDate: Date,
        endDate: Date,
        rentalPrice: number,
    ): Promise<Reservation> {
        const vehicle = await this.vehicleModel.findById(vehicleId);
        if (!vehicle) {
            throw new NotFoundException('Vehicle not found');
        }
        if (vehicle.status === 'Zarezerwowany') {
            throw new BadRequestException('Vehicle is already reserved');
        }

        // Aktualizacja statusu pojazdu
        vehicle.status = 'Zarezerwowany';
        vehicle.reservedBy = clientId;
        await vehicle.save();

        const reservation = new this.reservationModel({
            clientId,
            vehicleId,
            startDate,
            endDate,
            rentalPrice,
            reservationStatus: 'Zarezerwowany',
        });

        return reservation.save();
    }

    async cancelReservation(reservationId: string, clientId: string) {
        const reservation = await this.reservationModel.findById(reservationId);
        if (!reservation) {
            throw new NotFoundException('Reservation not found');
        }
        if (reservation.clientId.toString() !== clientId) {
            throw new ForbiddenException('This reservation is not yours');
        }

        reservation.reservationStatus = 'Anulowany';
        await reservation.save();

        const vehicle = await this.vehicleModel.findById(reservation.vehicleId);
        if (vehicle) {
            vehicle.status = 'Dostępny';
            vehicle.reservedBy = null;
            await vehicle.save();
        }

        return { message: 'Rezerwacja anulowana pomyślnie', success: true };
    }

    async getReservationsByClient(clientId: string): Promise<Reservation[]> {
        return this.reservationModel.find({ clientId }).populate('vehicleId').exec();
    }
}
