import { Controller, Post, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from '../auth/dto/create-client.dto';
import { UpdateClientProfileDto } from './dto/update-client-profile.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('clients')
export class ClientController {
    constructor(private readonly clientService: ClientService) { }

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
}