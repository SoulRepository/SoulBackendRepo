import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CompanyLink } from './company-link.entity';
import { Category } from 'categories/category.entity';
import { BaseEntityDate } from 'common/database/base.entity';
import { Image } from 'images/image.entity';

@Entity()
export class Company extends BaseEntityDate {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  soulId: string;

  @OneToMany(() => CompanyLink, (link) => link.company, {
    cascade: true,
    eager: true,
  })
  links: CompanyLink[];

  @ManyToOne(() => Image, {
    nullable: true,
  })
  backgroundImage?: Image;

  @ManyToOne(() => Image, {
    nullable: true,
  })
  logoImage?: Image;

  @ManyToOne(() => Image, {
    nullable: true,
  })
  featuredImage?: Image;

  @ManyToMany(() => Category, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  categories: Category[];

  @Column()
  address: string;
}
