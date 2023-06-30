import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { configuration } from 'src/config';
import { ProductsRepository } from 'src/database/repository/product.repository';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  const fakeProductsRepository: Partial<ProductsRepository> = {};

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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
