import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/database/schemas/product.schema';
import { User } from 'src/database/schemas/user.schema';
import { CreateProductDto } from '../dtos/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productsModel: Model<Product>,
  ) {}

  async create(user: User, createProductDto: CreateProductDto) {
    const product = await this.productsModel.create({
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
