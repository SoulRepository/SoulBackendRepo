import { LinkType } from 'entities/enums/link-type.enum';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from './company.entity';
import { BaseEntityDate } from 'common/database/base.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
@Index(['company', 'type'], { unique: true })
export class CompanyLink extends BaseEntityDate {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({
    type: 'enum',
    enum: LinkType,
  })
  type: LinkType;

  @Column()
  url: string;

  @ManyToOne(() => Company, (company) => company.links, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  company: Company;

  @Column({ default: false })
  verified: boolean;

  @Exclude()
  @ApiHideProperty()
  @Column({ nullable: true })
  accessToken?: string;

  @Exclude()
  @ApiHideProperty()
  @Column({ nullable: true })
  refreshToken?: string;

  @Exclude()
  @ApiHideProperty()
  @Column({ nullable: true, type: 'timestamp' })
  validUntil?: Date;
}
