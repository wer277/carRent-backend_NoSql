import { Controller, Post, Patch, Body, Req, UseGuards, Get } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from '../auth/dto/create-client.dto';
import { UpdateClientProfileDto } from './dto/update-client-profile.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('clients')
export class ClientController {
    constructor(private readonly clientService: ClientService) { }

    @Patch('complete-profile')
    @UseGuards(AuthGuard('jwt'))
    @Roles('client')
    async completeProfile(@Req() req, @Body() updateData: any) {
        const userId = req.user.userId;
        return this.clientService.updateProfile(userId, updateData);
    }

    @Post('register')
    async registerClient(@Body() createClientDto: CreateClientDto) {
        return this.clientService.registerClient(createClientDto);
    }

    @Patch('update-profile')
    @UseGuards(AuthGuard('jwt'))
    async updateClientProfile(@Req() req, @Body() updateClientProfileDto: UpdateClientProfileDto) {
        const userId = req.user.userId;
        return this.clientService.updateClientProfile(userId, updateClientProfileDto);
    }


    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    async getClientProfile(@Req() req) {
        const userId = req.user.userId;
        return this.clientService.getClientProfile(userId);
    }
}