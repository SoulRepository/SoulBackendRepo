import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { BaseEntityDate } from 'common/database/base.entity';
import { UserRole } from 'entities/enums/user.enum';

@Entity()
export class User extends BaseEntityDate {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.admin,
  })
  role: UserRole;

  @Column()
  @Exclude()
  @ApiHideProperty()
  passwordHash: string;

  @Column({
    default: true,
  })
  isActive: boolean;
}
