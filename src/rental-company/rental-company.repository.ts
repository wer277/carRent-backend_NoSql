import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RentalCompany, RentalCompanyDocument } from './schemas/rental-company.schema';

@Injectable()
export class RentalCompanyRepository {
    constructor(
        @InjectModel(RentalCompany.name) private readonly rentalCompanyModel: Model<RentalCompanyDocument>,
    ) { }

    async create(data: Partial<RentalCompany>): Promise<RentalCompany> {
        const rentalCompany = new this.rentalCompanyModel(data);
        return rentalCompany.save();
    }

    async findById(id: string): Promise<RentalCompany | null> {
        return this.rentalCompanyModel.findById(id).exec(); 
    }

    async update(id: string, updateData: Partial<RentalCompany>): Promise<RentalCompany> {
        return this.rentalCompanyModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }
}