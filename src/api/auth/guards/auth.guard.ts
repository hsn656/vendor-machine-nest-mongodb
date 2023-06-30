import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { UsersRepository } from 'src/database/repository/user.repository';
import { errorMessages } from 'src/errors/custom';
import { PayloadDto } from '../dtos/auth.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private usersRepository: UsersRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const bearerToken = request.headers.authorization.split(' ')[1];
      const payload: PayloadDto = await this.jwtService.verifyAsync(
        bearerToken,
        {
          secret: this.configService.get('jwt.secret'),
        },
      );
      request.user = await this.usersRepository.findById(payload.id);
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError)
        throw new UnauthorizedException(errorMessages.auth.expiredToken);
      throw new UnauthorizedException(errorMessages.auth.invlidToken);
    }
  }
}
