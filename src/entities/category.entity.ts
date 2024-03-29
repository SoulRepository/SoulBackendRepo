import { BaseEntityDate } from 'common/database/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category extends BaseEntityDate {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  shortName?: string;

  @Column({
    nullable: true,
  })
  description?: string;
}
