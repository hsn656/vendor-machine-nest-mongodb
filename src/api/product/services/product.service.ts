import { Injectable } from '@nestjs/common';
import { ProductsRepository } from 'src/database/repository/product.repository';
import { User } from 'src/database/schemas/user.schema';
import { CreateProductDto } from '../dtos/product.dto';

@Injectable()
export class ProductService {
  constructor(private productsRepository: ProductsRepository) {}

  async create(user: User, createProductDto: CreateProductDto) {
    const product = await this.productsRepository.create({
      ...createProductDto,
      sellerId: user,
    });

    return product;
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
