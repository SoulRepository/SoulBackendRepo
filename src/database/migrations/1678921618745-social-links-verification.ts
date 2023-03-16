import { MigrationInterface, QueryRunner } from 'typeorm';

export class socialLinksVerification1678921618745
  implements MigrationInterface
{
  name = 'socialLinksVerification1678921618745';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company_link" ADD "verified" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_link" ADD "accessToken" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_link" ADD "refreshToken" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_link" ADD "validUntil" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company_link" DROP COLUMN "validUntil"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_link" DROP COLUMN "refreshToken"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_link" DROP COLUMN "accessToken"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_link" DROP COLUMN "verified"`,
    );
  }
}
