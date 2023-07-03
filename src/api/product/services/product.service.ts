import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { ProductsRepository } from 'src/database/repository/product.repository';
import { Product } from 'src/database/schemas/product.schema';
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
    return this.productsRepository.find(
      {},
      {
        __v: 0,
      },
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
