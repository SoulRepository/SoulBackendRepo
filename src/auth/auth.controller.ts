import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HttpRequest } from 'common/interfaces';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { TokenResponse } from './interfaces';
import { LoginDto } from './dto';

@ApiTags('AdminAuth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Request() req: HttpRequest): Promise<TokenResponse> {
    return this.authService.login(req.user);
  }
}
