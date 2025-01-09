import { Injectable, NotFoundException } from '@nestjs/common';
import { RentalCompanyRepository } from './rental-company.repository';
import { UpdateRentalCompanyDto } from './dto/rental-company.dto';
import { RentalCompany } from './schemas/rental-company.schema';

@Injectable()
export class RentalCompanyService {
    constructor(private readonly rentalCompanyRepository: RentalCompanyRepository) { }

    async createRentalCompany(createRentalCompanyDto: UpdateRentalCompanyDto, createdBy: string): Promise<RentalCompany> {
        const data = {
            ...createRentalCompanyDto,
            createdBy,
        };

        return this.rentalCompanyRepository.create(data);
    }

    async getRentalCompany(id: string): Promise<RentalCompany> {
        const rentalCompany = await this.rentalCompanyRepository.findById(id);
        if (!rentalCompany) {
            throw new NotFoundException('Rental company not found');
        }
        return rentalCompany;
    }
}
