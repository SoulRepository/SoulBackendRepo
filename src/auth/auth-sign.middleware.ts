import { NextFunction } from 'express';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpRequest, HttpResponse } from 'common/interfaces';
import {
  SIGN_ADDRESS_HEADER,
  SIGN_HEADER,
  SIGN_MESSAGE_HEADER,
} from './constants/sign.constants';
import { ethers } from 'ethers';

@Injectable()
export class AuthSignMiddleware implements NestMiddleware {
  async use(
    req: HttpRequest,
    res: HttpResponse,
    next: NextFunction,
  ): Promise<void> {
    const sign = req.header(SIGN_HEADER);
    const message = req.header(SIGN_MESSAGE_HEADER);
    const address = req.header(SIGN_ADDRESS_HEADER);
    if (sign && address) {
      const possibleAddress = ethers.verifyMessage(message, sign);
      if (possibleAddress !== address) {
        throw new UnauthorizedException('Incorrect sign');
      }
      req.address = possibleAddress;
    }
    return next();
  }
}
