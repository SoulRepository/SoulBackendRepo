import { MigrationInterface, QueryRunner } from 'typeorm';

export class companyNonce1679900124777 implements MigrationInterface {
  name = 'companyNonce1679900124777';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company" DROP COLUMN "nonceCreatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ADD "nonceCreatedAt" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company" DROP COLUMN "nonceCreatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ADD "nonceCreatedAt" TIMESTAMP`,
    );
  }
}
