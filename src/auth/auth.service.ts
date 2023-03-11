import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User, UserRole } from 'entities';
import { TokenPayload, TokenResponse } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateAdminUser(name: string, password: string): Promise<User> {
    const user = await this.usersService.findOne({
      where: {
        name,
        role: UserRole.admin,
      },
    });

    if (!user) {
      throw new NotFoundException(`User ${name} not found`);
    }

    const isCorrectPassword = await this.usersService.isCorrectPassword(
      password,
      user.passwordHash,
    );
    if (!isCorrectPassword) {
      throw new UnauthorizedException(`Incorrect password`);
    }

    return user;
  }

  async getUserFromJwt(token: string): Promise<User> {
    const payload = this.getTokenPayload(token);

    if (!payload) {
      throw new UnauthorizedException(`Token incorrect`);
    }
    const user = await this.usersService.findOne({ where: { id: payload.id } });
    if (!user) {
      throw new UnauthorizedException(`Token incorrect`);
    }

    return user;
  }

  private getTokenPayload(token: string): TokenPayload {
    try {
      const payload = this.jwtService.verify<TokenPayload>(token);
      if (!payload) {
        throw new UnauthorizedException(`Token incorrect`);
      }

      return payload;
    } catch (e) {
      throw new UnauthorizedException(`Token incorrect`);
    }
  }

  async login(user: User): Promise<TokenResponse> {
    const payload: TokenPayload = {
      id: user.id,
      name: user.name,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
