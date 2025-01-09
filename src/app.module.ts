import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module'; 
import { ConfigModule } from '@nestjs/config';
import { RentalCompanyModule } from './rental-company/rental-company.module';
import { ClientModule } from './client/client.module';
import { EmployeeModule } from './employee/employee.module';
import { VehicleModule } from './vehicle/vehicle.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/carRentManager'),
    AuthModule,
    RentalCompanyModule,
    ClientModule,
    EmployeeModule,
    VehicleModule,
    ConfigModule.forRoot({
        isGlobal: true,
      }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
