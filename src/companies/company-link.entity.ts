import { LinkType } from './enums/link-type.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from './company.entity';
import { BaseEntityDate } from 'common/database/base.entity';

@Entity()
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
  })
  company: Company;
}
