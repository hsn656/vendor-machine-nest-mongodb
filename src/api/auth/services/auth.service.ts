import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { roles } from 'src/database/schemas/user.schema';
import { errorMessages } from 'src/errors/custom';
import { loginDTO, PayloadDto, registerDTO } from '../dtos/auth.dto';
import { UsersRepository } from 'src/database/repository/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userRepository: UsersRepository,
  ) {}

  async register(user: registerDTO) {
    const alreadyExistingUser = await this.userRepository.findOne(
      {
        username: user.username,
      },
      {
        username: 1,
      },
    );
    if (alreadyExistingUser)
      throw new ConflictException(errorMessages.auth.userAlreadyExist);

    user.password = await hash(user.password, 10);
    const newUser = await this.userRepository.create({
      ...user,
      deposit: 0,
      role: roles.buyer,
    });
    return newUser;
  }

  async login(userCredentials: loginDTO) {
    const user = await this.userRepository.findOne(
      {
        username: userCredentials.username,
      },
      {
        username: 1,
        password: 1,
      },
    );

    if (!user)
      throw new UnauthorizedException(errorMessages.auth.wronCredentials);
    const isValidPassword = await compare(
      userCredentials.password,
      user.password,
    );
    if (!isValidPassword)
      throw new UnauthorizedException(errorMessages.auth.wronCredentials);
    return this.generateToken({
      id: user.id,
      username: user.username,
    });
  }

  async generateToken(payload: PayloadDto) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('jwt.secret'),
    });

    return { accessToken };
  }
}
