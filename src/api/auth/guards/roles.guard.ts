import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { errorMessages } from 'src/errors/custom';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (roles.length === 0) return true;
    const request = context.switchToHttp().getRequest();
    console.log({ user: request.user });
    if (!roles.includes(request?.user?.role))
      throw new UnauthorizedException(errorMessages.auth.notAllowed);

    return true;
  }
}
