import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlatformAdminService } from './platform_admin.service';
import { PlatformAdminController } from './platform_admin.controller';
import { User, UserSchema } from '../auth/schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    providers: [PlatformAdminService],
    controllers: [PlatformAdminController],
    exports: [PlatformAdminService],
})
export class PlatformAdminModule { }
