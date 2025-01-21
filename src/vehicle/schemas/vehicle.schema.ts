import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VehicleDocument = Vehicle & Document;

@Schema({ timestamps: true })
export class Vehicle {
    @Prop({ required: true })
    brand: string;

    @Prop({ required: true })
    model: string;

    @Prop({ required: true })
    productionYear: number;

    @Prop({ required: true })
    location: string;

    @Prop({ required: true })
    dailyPrice: number;

    @Prop({ required: true, enum: ['Zarezerwowany', 'Dostępny', 'W naprawie', 'Anulowany'], default: 'Dostępny' })
    status: string;

    @Prop({ required: true })
    rentalCompanyId: string;

    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;

    @Prop({ default: null })
    reservedBy: string | null;
}


export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
