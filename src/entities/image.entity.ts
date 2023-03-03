import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntityDate } from 'common/database/base.entity';

@Entity()
export class Image extends BaseEntityDate {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  @Index({ unique: true })
  key: string;

  @Column('jsonb', { nullable: true })
  metadata?: object;
}
