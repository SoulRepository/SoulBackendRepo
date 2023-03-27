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
import { CompaniesService } from 'companies/companies.service';

@Injectable()
export class AuthSignMiddleware implements NestMiddleware {
  constructor(private readonly companiesService: CompaniesService) {}
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

    if (!(sign && address && message)) {
      return next();
    }

    const nonce = await this.companiesService.retrieveCompanyNonce({ address });
    const messageToVerify = `${message} ${nonce.nonce}`;

    const possibleAddress = ethers.verifyMessage(messageToVerify, sign);
    if (possibleAddress.toLowerCase() !== address.toLowerCase()) {
      throw new UnauthorizedException('Incorrect sign');
    }

    req.address = possibleAddress;
    return next();
  }
}
