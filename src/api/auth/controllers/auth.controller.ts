import { Body, Controller, Post } from '@nestjs/common';
import { registerDTO } from '../dtos/auth.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() user: registerDTO) {
    return this.authService.register(user);
  }
}
