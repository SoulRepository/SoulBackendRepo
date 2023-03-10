import { IsEnum, IsString, IsStrongPassword } from 'class-validator';
import { UserRole } from 'entities';

export class CreateUpdateUserDto {
  @IsString()
  name: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @IsStrongPassword()
  password: string;
}
