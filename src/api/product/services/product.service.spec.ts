import { ConfigModule } from '@nestjs/config';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { configuration } from 'src/config';
import { MongooseConfigService } from 'src/database/config';
import { Product, ProductSchema } from 'src/database/schemas/product.schema';
import { User, UserSchema } from 'src/database/schemas/user.schema';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  const fakeUserModel: Partial<Model<User>> = {};
  const fakeProductModel: Partial<Model<Product>> = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getModelToken(User.name),
          useValue: fakeUserModel,
        },
        {
          provide: getModelToken(Product.name),
          useValue: fakeProductModel,
        },
      ],
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
        MongooseModule.forRootAsync({
          useClass: MongooseConfigService,
        }),
        MongooseModule.forFeature([
          { name: User.name, schema: UserSchema },
          { name: Product.name, schema: ProductSchema },
        ]),
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
