import { NextFunction } from 'express';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpRequest, HttpResponse } from 'common/interfaces';
import { ethers } from 'ethers';
import { plainToClass } from 'class-transformer';
import { AuthHeadersDto } from '../dto';

@Injectable()
export class AuthSignMiddleware implements NestMiddleware {
  async use(
    req: HttpRequest,
    res: HttpResponse,
    next: NextFunction,
  ): Promise<void> {
    const values = plainToClass(AuthHeadersDto, req.headers, {
      strategy: 'excludeAll',
    });
    const sign = values['x-web3-sign'];
    const message = values['x-web3-message'];
    const address = values['x-web3-address'];
    if (sign && address && message) {
      const possibleAddress = ethers.verifyMessage(message, sign);
      if (possibleAddress.toLowerCase() !== address.toLowerCase()) {
        throw new UnauthorizedException('Incorrect sign');
      }
      req.address = possibleAddress;
    }
    return next();
  }
}
