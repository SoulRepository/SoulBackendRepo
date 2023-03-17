import { MigrationInterface, QueryRunner } from 'typeorm';

export class shortField1679043639390 implements MigrationInterface {
  name = 'shortField1679043639390';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company_link" DROP CONSTRAINT "FK_01f3cc33fb6b26cf7cf33d60cf4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD "shortName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_link" ADD CONSTRAINT "FK_01f3cc33fb6b26cf7cf33d60cf4" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company_link" DROP CONSTRAINT "FK_01f3cc33fb6b26cf7cf33d60cf4"`,
    );
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "shortName"`);
    await queryRunner.query(
      `ALTER TABLE "company_link" ADD CONSTRAINT "FK_01f3cc33fb6b26cf7cf33d60cf4" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
