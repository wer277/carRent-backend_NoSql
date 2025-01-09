import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RentalCompanyController } from './rental-company.controller';
import { RentalCompanyService } from './rental-company.service';
import { RentalCompanyRepository } from './rental-company.repository';
import { RentalCompany, RentalCompanySchema } from './schemas/rental-company.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: RentalCompany.name, schema: RentalCompanySchema }]),
    ],
    controllers: [RentalCompanyController],
    providers: [RentalCompanyService, RentalCompanyRepository],
})
export class RentalCompanyModule { }
