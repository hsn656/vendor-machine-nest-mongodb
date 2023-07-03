import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { configuration } from 'src/config';
import { ProductsRepository } from 'src/database/repository/product.repository';
import { ProductDocument } from 'src/database/schemas/product.schema';
import { User, UserDocument } from 'src/database/schemas/user.schema';
import { CreateProductDto } from '../dtos/product.dto';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  const fakeProductsRepository: Partial<ProductsRepository> = {};
  const fakeUser: Partial<UserDocument> = {
    _id: new Types.ObjectId(),
  };
  const fakeProduct: Partial<ProductDocument> = {
    name: 'test product',
    amount: 10,
    price: 10,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductsRepository,
          useValue: fakeProductsRepository,
        },
      ],
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create method', () => {
    it('should success', async () => {
      fakeProductsRepository.create = jest
        .fn()
        .mockResolvedValueOnce(fakeProduct);
      const result = await service.create(
        fakeUser as User,
        fakeProduct as CreateProductDto,
      );
      expect(fakeProductsRepository.create).toBeCalled();
      expect(result).toStrictEqual(fakeUser);
    });
  });
});
