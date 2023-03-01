import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntityDate } from 'common/database/base.entity';

@Entity()
export class Image extends BaseEntityDate {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  key: string;
}
