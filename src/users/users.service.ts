import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { ConfigService } from '@common/config';
import { ConfigSchema } from '../config/config.schema';
import { User, UserRole } from 'entities';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUpdateUserDto } from './dto/create-update-user.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService<ConfigSchema>,
  ) {}

  async createOne(data: CreateUpdateUserDto): Promise<User> {
    const { password, ...rest } = data;
    const entity = this.userRepository.create({
      ...rest,
      passwordHash: await this.getPasswordHash(password),
    });
    return this.userRepository.save(entity);
  }

  findOne(where: FindOneOptions<User>): Promise<User> {
    return this.userRepository.findOne(where);
  }

  findMany(where: FindManyOptions<User>): Promise<User[]> {
    return this.userRepository.find(where);
  }

  async updateOne(
    where: FindOneOptions<User>,
    entityLike: CreateUpdateUserDto,
  ): Promise<User> {
    const { password, ...rest } = entityLike;
    const entity = await this.findOne(where);
    this.userRepository.merge(entity, {
      ...rest,
      ...(password
        ? { passwordHash: await this.getPasswordHash(password) }
        : {}),
    });
    return this.userRepository.save(entity);
  }

  public isCorrectPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private getPasswordHash(password: string): Promise<string> {
    return bcrypt.hash(
      password,
      this.configService.get('PASSWORD_SALT_ROUNDS'),
    );
  }

  async onModuleInit(): Promise<void> {
    const adminUserExist = await this.userRepository.count({
      where: { role: UserRole.admin },
    });
    if (adminUserExist) {
      return;
    }

    const password = this.configService.get<string>('DEFAULT_ADMIN_PASSWORD');

    await this.createOne({
      role: UserRole.admin,
      name: 'admin',
      password,
    });
    this.logger.debug(
      'Created new user name: %s, password: %s',
      'admin',
      password,
    );
  }
}
