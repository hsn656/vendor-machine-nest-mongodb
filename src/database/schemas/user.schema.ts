import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export const roles = {
  admin: 'admin',
  buyer: 'buyer',
  seller: 'seller',
};

const roleNames = Object.keys(roles);

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  deposit: number;

  @Prop({ required: true, enum: roleNames })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(function (schema) {
  schema.set('toJSON', {
    transform: function (doc, ret) {
      delete ret.password;
      return ret;
    },
  });
});
