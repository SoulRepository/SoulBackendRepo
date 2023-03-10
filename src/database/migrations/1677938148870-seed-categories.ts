import { MigrationInterface, QueryRunner } from 'typeorm';
import { Category } from 'entities';

export const categoriesData = [
  'Blockchain technology',
  'Cryptocurrency',
  'Decentralized finance (DeFi)',
  'Non-fungible tokens (NFTs)',
  'Artificial intelligence (AI)',
  'Machine learning',
  'Internet of Things (IoT)',
  'Cybersecurity',
  'Cloud computing',
  'Augmented reality (AR)',
  'Virtual reality (VR)',
  'Gaming',
  'Web3',
  'Web3 Gaming',
  'Finance',
  'Social media',
  'E-commerce',
  'Healthcare technology',
  'Education technology',
  'Renewable energy',
  'Transportation technology',
  'Real estate technology',
  'Media and entertainment',
];

export class seedCategories1677938148870 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.connection
      .createQueryBuilder()
      .insert()
      .into(Category)
      .values(categoriesData.map((name) => ({ name })))
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
