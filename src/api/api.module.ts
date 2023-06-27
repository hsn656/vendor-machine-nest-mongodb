import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/database/schemas/user.schema';
import { ErrorsFilter } from 'src/errors/errors.filter';
import { SucessResponseInterceptor } from 'src/helpers/sucess-response.interceptor';
import { ApiController } from './app.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
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
