import { Injectable } from '@nestjs/common';
import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    mongoose.set('debug', true);
    return {
      uri: this.configService.get<string>('db.uri'),
    };
  }
}
