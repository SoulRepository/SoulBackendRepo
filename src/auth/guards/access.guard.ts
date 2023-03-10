import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { HttpRequest } from 'common/interfaces';
import { IS_ONLY_FOR_ADMIN } from '../decorators';
import { UserRole } from 'entities';

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

    const request = context.switchToHttp().getRequest<HttpRequest>();
    if (!request) {
      return false;
    }

    if (!request.user) {
      return false;
    }

    const user = request.user;

    return !(onlyForAdmin && user.role !== UserRole.admin);
  }
}
