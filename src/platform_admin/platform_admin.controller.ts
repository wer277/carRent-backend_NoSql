import { Controller, Get, Put, Body, Req, UseGuards, NotFoundException } from '@nestjs/common';
import { PlatformAdminService } from './platform_admin.service';
import { UpdateAdminDto } from '../rental-admin/dto/update-admin.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/schemas/user.schema';
import { Roles } from '../auth/roles.decorator';

@Controller('platform_admins')
@UseGuards(AuthGuard('jwt')) 
export class PlatformAdminController {
    constructor(private readonly platformAdminService: PlatformAdminService) { }

    @Get('current')
    //@Roles('platform_admin')
    async getCurrentPlatformAdmin(@Req() req): Promise<User> {
        const userId = req.user.userId;
        const platformAdmin = await this.platformAdminService.getCurrentAdmin(userId);
        if (!platformAdmin) {
            throw new NotFoundException('Platform admin not found');
        }
        return platformAdmin;
    }


    @Put('update')
    async updateCurrentAdmin(@Req() req, @Body() updateDto: UpdateAdminDto) {
        const userId = req.user.userId;
        return this.platformAdminService.updateCurrentAdmin(userId, updateDto);
    }
}
