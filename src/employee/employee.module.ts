import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeService } from './employee.service';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { RentalCompany, RentalCompanySchema } from '../rental-company/schemas/rental-company.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }
            , { name: RentalCompany.name, schema: RentalCompanySchema },
        ]),
    ],
    providers: [EmployeeService],
    exports: [EmployeeService],
})
export class EmployeeModule { }
