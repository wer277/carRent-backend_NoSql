import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document & { _id: Types.ObjectId };

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string; 

  @Prop({ required: true })
  password: string;

  @Prop()
  name?: string;

  @Prop()
  surname?: string;

  @Prop()
  phoneNumber?: string;

  @Prop()
  city?: string;

  @Prop()
  street?: string;

  @Prop()
  houseNumber?: string;

  @Prop()
  postalCode?: string;

  @Prop({ required: true, enum: ['client', 'employee', 'rental_admin', 'platform_admin'], default: 'client' })
  role: string;

  @Prop({ type: Object, default: {} })
  carPreferences: Record<string, any>;

  @Prop({ default: false })
  isProfileComplete: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);