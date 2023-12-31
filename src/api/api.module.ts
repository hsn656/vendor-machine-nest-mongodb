import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorsFilter } from 'src/errors/errors.filter';
import { SucessResponseInterceptor } from 'src/helpers/sucess-response.interceptor';
import { ApiController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [AuthModule, ProductModule],
  controllers: [ApiController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: SucessResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorsFilter,
    },
  ],
})
export class ApiModule {}
