import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RentalCompany, RentalCompanyDocument } from './schemas/rental-company.schema';
import { RentalCompanyDto } from './dto/create-rental-company.dto';
import { UpdateRentalCompanyDto } from './dto/update-rental-company.dto';

@Injectable()
export class RentalCompanyService {
    constructor(
        @InjectModel(RentalCompany.name) private readonly rentalCompanyModel: Model<RentalCompanyDocument>,
    ) { }

    // Tworzenie wypożyczalni
    async createRentalCompany(createRentalCompanyDto: RentalCompanyDto, rentalAdminId: string): Promise<RentalCompany> {
        const newRentalCompany = new this.rentalCompanyModel({
            ...createRentalCompanyDto,
            createdBy: rentalAdminId,
        });

        return newRentalCompany.save();
    }

    // Aktualizacja wypożyczalni
    async updateRentalCompany(id: string, updateRentalCompanyDto: UpdateRentalCompanyDto, rentalAdminId: string): Promise<RentalCompany> {
        const rentalCompany = await this.rentalCompanyModel.findById(id);

        if (!rentalCompany) {
            throw new NotFoundException('Rental company not found');
        }

        if (rentalCompany.createdBy.toString() !== rentalAdminId) {
            throw new ForbiddenException('You are not authorized to update this rental company');
        }

        Object.assign(rentalCompany, updateRentalCompanyDto);

        return rentalCompany.save();
    }

    // Pobranie listy wypożyczalni zarządzanych przez rental admina
    async getRentalCompaniesByAdmin(rentalAdminId: string): Promise<RentalCompany[]> {
        return this.rentalCompanyModel.find({ createdBy: rentalAdminId }).exec();
    }

    async deleteRentalCompany(id: string, rentalAdminId: string): Promise<void> {
        const rentalCompany = await this.rentalCompanyModel.findById(id);

        if (!rentalCompany) {
            throw new NotFoundException('Rental company not found');
        }

        // Sprawdzenie, czy rental admin ma uprawnienia do usunięcia
        if (rentalCompany.createdBy !== rentalAdminId) {
            throw new ForbiddenException('You are not authorized to delete this rental company');
        }

        await this.rentalCompanyModel.deleteOne({ _id: id });
    }

}
