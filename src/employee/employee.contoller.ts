// employee.controller.ts
import { Controller, Post, Body, UseGuards, Req, Patch, Param, Delete, Get, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employee')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) { }

    @Patch('update-employee/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('rental_admin')
    async updateEmployee(
        @Param('id') id: string,
        @Body() updateEmployeeDto: UpdateEmployeeDto,
        @Req() req,
    ) {
        const rentalAdminId = req.user.userId;
        return this.employeeService.updateEmployee(id, updateEmployeeDto, rentalAdminId);
    }

    @Delete('delete-employee/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('rental_admin')
    async deleteEmployee(@Param('id') id: string, @Req() req) {
        const rentalAdminId = req.user.userId;
        return this.employeeService.deleteEmployee(id, rentalAdminId);
    }

    @Get('employees/:rentalCompanyId')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('rental_admin')
    async getEmployeesByRentalCompany(@Param('rentalCompanyId') rentalCompanyId: string, @Req() req) {
        const rentalAdminId = req.user.userId;
        return this.employeeService.getEmployeesByRentalCompany(rentalCompanyId, rentalAdminId);
    }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    async getProfile(@Req() req) {
        const employeeId = req.user.userId;
        return this.employeeService.getEmployeeProfile(employeeId);
    }

    @Patch('update-profile')
    @UseGuards(AuthGuard('jwt'))
    async updateProfile(@Req() req, @Body() updateEmployeeDto: UpdateEmployeeDto) {
        const employeeId = req.user.userId;
        return this.employeeService.updateEmployeeProfile(employeeId, updateEmployeeDto);
    }
}
