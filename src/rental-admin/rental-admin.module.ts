import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RentalAdminService } from './rental-admin.service';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { RentalAdminController } from './rental_admin.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    providers: [RentalAdminService],
    controllers: [RentalAdminController],
    exports: [RentalAdminService],
})
export class RentalAdminModule { }
