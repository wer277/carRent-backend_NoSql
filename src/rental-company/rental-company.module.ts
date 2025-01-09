import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RentalCompanyService } from './rental-company.service';
import { RentalCompanyController } from './rental-company.controller';
import { RentalCompany, RentalCompanySchema } from './schemas/rental-company.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: RentalCompany.name, schema: RentalCompanySchema },
            { name: User.name, schema: UserSchema },
        ]),
    ],
    controllers: [RentalCompanyController],
    providers: [RentalCompanyService],
})
export class RentalCompanyModule { }
