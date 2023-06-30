import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { AbstractRepository } from './abstract.repository';

@Injectable()
export class ProductsRepository extends AbstractRepository<ProductDocument> {
  constructor(@InjectModel(Product.name) productModel: Model<ProductDocument>) {
    super(productModel);
  }
}
