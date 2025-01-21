import { Controller, Post, Body, Get, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('reservations')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) { }

    @Post('create')
    @Roles('client')
    async createReservation(
        @Request() req,
        @Body() body: { vehicleId: string; startDate: Date; endDate: Date; rentalPrice: number },
    ) {
        const clientId = req.user.userId;
        const { vehicleId, startDate, endDate, rentalPrice } = body;
        return this.reservationService.createReservation(
            clientId,
            vehicleId,
            new Date(startDate),
            new Date(endDate),
            rentalPrice,
        );
    }

    @Get('my')
    @Roles('client')
    async getMyReservations(@Request() req) {
        const clientId = req.user.userId;
        return this.reservationService.getReservationsByClient(clientId);
    }

    @Post('cancel/:id')
    @Roles('client')
    async cancelReservation(@Param('id') reservationId: string, @Request() req) {
        const clientId = req.user.userId;
        return this.reservationService.cancelReservation(reservationId, clientId);
    }


}
