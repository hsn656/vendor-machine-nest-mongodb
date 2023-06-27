import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'bcrypt';
import { User } from 'src/database/schemas/user.schema';
import { errorMessages } from 'src/errors/custom';
import { PayloadDto, registerDTO } from '../dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(User.name) private usersModel: Model<User>,
  ) {}

  async register(user: registerDTO) {
    const alreadyExistingUser = await this.usersModel.findOne({
      username: user.username,
    });
    if (alreadyExistingUser)
      throw new ConflictException(errorMessages.auth.userAlreadyExist);

    user.password = await hash(user.password, 10);
    const newUser = await this.usersModel.create({
      ...user,
      deposit: 0,
      role: 'buyer',
    });
    return newUser;
  }

  async generateToken(payload: PayloadDto) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('jwt.secret'),
    });

    return { accessToken };
  }
}
