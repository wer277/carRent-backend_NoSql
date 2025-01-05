import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module'; 
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/carRentManager'),
    AuthModule,
    ConfigModule.forRoot({
        isGlobal: true,
      }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
