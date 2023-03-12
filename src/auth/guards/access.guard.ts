import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { HttpRequest } from 'common/interfaces';
import { IS_ONLY_FOR_ADMIN } from '../decorators';
import { IS_VERIFY_SIGN } from '../decorators/verify-sign.decorator';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType<string>() !== 'http') {
      return true;
    }

    const onlyForAdmin = this.reflector.get<boolean>(
      IS_ONLY_FOR_ADMIN,
      context.getHandler(),
    );

    const needVerifySign = this.reflector.get<boolean>(
      IS_VERIFY_SIGN,
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest<HttpRequest>();
    if (!request) {
      return false;
    }

    if (needVerifySign || onlyForAdmin) {
      if (needVerifySign && request.address) {
        return true;
      }

      return !!(onlyForAdmin && request.user);
    }
    return true;
  }
}
