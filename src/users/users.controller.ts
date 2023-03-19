import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUpdateUserDto } from './dto/create-update-user.dto';
import { UsersService } from './users.service';
import { OnlyForAdmin } from 'auth/decorators';
import { User } from 'entities';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @OnlyForAdmin()
  createUser(@Body() data: CreateUpdateUserDto): Promise<User> {
    return this.usersService.createOne(data);
  }

  @Get()
  @OnlyForAdmin()
  listUsers(): Promise<User[]> {
    return this.usersService.findMany({});
  }

  @Patch('/:userId')
  @OnlyForAdmin()
  updateUser(
    @Param('userId') userId: number,
    @Body() data: CreateUpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateOne({ where: { id: userId } }, data);
  }
}
