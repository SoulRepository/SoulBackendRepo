import { MigrationInterface, QueryRunner } from 'typeorm';

export class companyNonce1679899100853 implements MigrationInterface {
  name = 'companyNonce1679899100853';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company" ADD "nonce" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ADD "nonceCreatedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_9678a1fa8b1fa376cc347fa971" ON "company" ("nonce") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9678a1fa8b1fa376cc347fa971"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" DROP COLUMN "nonceCreatedAt"`,
    );
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "nonce"`);
  }
}
