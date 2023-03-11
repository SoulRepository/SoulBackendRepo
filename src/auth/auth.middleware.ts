import { NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpRequest, HttpResponse } from 'common/interfaces';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(
    req: HttpRequest,
    res: HttpResponse,
    next: NextFunction,
  ): Promise<void> {
    const token = this.getBearerTokenFromHeader(req.headers.authorization);
    if (token) {
      req.user = await this.authService.getUserFromJwt(token);
    }
    return next();
  }

  private getBearerTokenFromHeader(value?: string): string {
    const prefix = 'Bearer ';
    if (value?.startsWith(prefix)) {
      return value.substring(prefix.length);
    }
    return undefined;
  }
}
