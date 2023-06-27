import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SucessResponseInterceptor } from 'src/helpers/sucess-response.interceptor';
import { ApiController } from './app.controller';

@Module({
  controllers: [ApiController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: SucessResponseInterceptor,
    },
  ],
})
export class ApiModule {}
