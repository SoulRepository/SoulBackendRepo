import { MigrationInterface, QueryRunner } from 'typeorm';
import { Category } from 'entities';

export const categoriesData = [
  { name: 'Cryptocurrency', shortName: 'CC' },
  { name: 'Decentralized finance', shortName: 'DF' },
  { name: 'Non-fungible tokens', shortName: 'NFT' },
  { name: 'Artificial intelligence', shortName: 'AI' },
  { name: 'Machine learning', shortName: 'ML' },
  { name: 'Internet of Things', shortName: 'IoT' },
  { name: 'Cybersecurity', shortName: 'CS' },
  { name: 'Software as a Service', shortName: 'SaaS' },
  { name: 'Infrastructure as a Service', shortName: 'IaaS' },
  { name: 'Platform as a Service', shortName: 'PaaS' },
  { name: 'Augmented reality', shortName: 'AR' },
  { name: 'Virtual reality', shortName: 'VR' },
  { name: 'Gaming', shortName: 'GM' },
  { name: 'Web3', shortName: 'W3' },
  { name: 'Web3 Gaming', shortName: 'W3G' },
  { name: 'Finance', shortName: 'FN' },
  { name: 'Social media', shortName: 'SM' },
  { name: 'E-commerce', shortName: 'EC' },
  { name: 'Healthcare technology', shortName: 'HT' },
  { name: 'Education technology', shortName: 'ET' },
  { name: 'Renewable energy', shortName: 'RE' },
  { name: 'Transportation technology', shortName: 'TT' },
  { name: 'Real estate technology', shortName: 'RT' },
  { name: 'Media and entertainment', shortName: 'ME' },
];
export class shortCategories1679044019567 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.connection
      .createQueryBuilder()
      .insert()
      .into(Category)
      .values(categoriesData)
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
