import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reservation, ReservationSchema } from './reservation.schema';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Vehicle, VehicleSchema } from '../../vehicle/schemas/vehicle.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Reservation.name, schema: ReservationSchema },
            { name: Vehicle.name, schema: VehicleSchema }, 
        ]),
    ],
    controllers: [ReservationController],
    providers: [ReservationService],
})
export class ReservationModule { }
