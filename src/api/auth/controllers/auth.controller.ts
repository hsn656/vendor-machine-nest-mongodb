import { Body, Controller, Post } from '@nestjs/common';
import { loginDTO, registerDTO } from '../dtos/auth.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() user: registerDTO) {
    return this.authService.register(user);
  }

  @Post('login')
  login(@Body() user: loginDTO) {
    return this.authService.login(user);
  }
}
