import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VehicleDocument = Vehicle & Document;

@Schema()
export class Vehicle {
    @Prop({ required: true })
    brand: string;

    @Prop({ required: true })
    model: string;

    @Prop({ required: true })
    licensePlate: string;

    @Prop({ required: true })
    rentalCompanyId: string; // Id wypożyczalni, do której należy pojazd

    @Prop({ default: 'available' }) // Status pojazdu: dostępny, wynajęty, w serwisie
    status: string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: null })
    updatedAt: Date;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
