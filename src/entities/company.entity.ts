import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CompanyLink } from './company-link.entity';
import { Category } from './category.entity';
import { BaseEntityDate } from 'common/database/base.entity';
import { Image } from './image.entity';

@Entity()
export class Company extends BaseEntityDate {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Index({ unique: true })
  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  description?: string;

  @Index({ unique: true })
  @Column()
  soulId: string;

  @OneToMany(() => CompanyLink, (link) => link.company, {
    cascade: true,
    eager: true,
  })
  links: CompanyLink[];

  @ManyToOne(() => Image, {
    nullable: true,
    eager: true,
    cascade: true,
  })
  backgroundImage?: Image;

  @ManyToOne(() => Image, {
    nullable: true,
    eager: true,
    cascade: true,
  })
  logoImage?: Image;

  @ManyToOne(() => Image, {
    nullable: true,
    eager: true,
    cascade: true,
  })
  featuredImage?: Image;

  @ManyToMany(() => Category, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinTable({
    name: 'company_categories',
  })
  categories: Category[];

  @Index({ unique: true })
  @Column()
  address: string;
}
