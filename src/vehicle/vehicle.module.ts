import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { Vehicle, VehicleSchema } from './schemas/vehicle.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
    ],
    controllers: [VehicleController],
    providers: [VehicleService],
})
export class VehicleModule { }
