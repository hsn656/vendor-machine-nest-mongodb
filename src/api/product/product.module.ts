import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsRepository } from 'src/database/repository/product.repository';
import { Product, ProductSchema } from 'src/database/schemas/product.schema';
import { User, UserSchema } from 'src/database/schemas/user.schema';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductsRepository],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
})
export class ProductModule {}
