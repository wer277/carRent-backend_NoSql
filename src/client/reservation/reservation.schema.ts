import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation {
    @Prop({ required: true })
    startDate: Date;

    @Prop({ required: true })
    endDate: Date;

    @Prop({ required: true })
    rentalPrice: number;

    @Prop({ default: 'active' })
    reservationStatus: string; 

    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    clientId: Types.ObjectId;

    @Prop({ required: true, type: Types.ObjectId, ref: 'Vehicle' })
    vehicleId: Types.ObjectId;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
