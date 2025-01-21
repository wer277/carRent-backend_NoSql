import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RentalCompanyDocument = RentalCompany & Document;

@Schema()
export class RentalCompany {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    contactEmail: string;

    @Prop()
    contactPhone: string;

    @Prop()
    address: string;

    @Prop()
    rentalPolicy: string;

    @Prop()
    discountPolicy: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    createdBy: string; // ID rental admina, który stworzył wypożyczalnię
}

export const RentalCompanySchema = SchemaFactory.createForClass(RentalCompany);