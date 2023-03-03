import { MigrationInterface, QueryRunner } from 'typeorm';

export class companyJoinTable1677684071662 implements MigrationInterface {
  name = 'companyJoinTable1677684071662';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "company_categories" ("companyId" integer NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_8aa01c11e29e1fd4465f496af99" PRIMARY KEY ("companyId", "categoryId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_57b50afbea3e46eea2765825cb" ON "company_categories" ("companyId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_408c204e4415dfa9e96800b34b" ON "company_categories" ("categoryId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "company_categories" ADD CONSTRAINT "FK_57b50afbea3e46eea2765825cb5" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_categories" ADD CONSTRAINT "FK_408c204e4415dfa9e96800b34b4" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company_categories" DROP CONSTRAINT "FK_408c204e4415dfa9e96800b34b4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_categories" DROP CONSTRAINT "FK_57b50afbea3e46eea2765825cb5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_408c204e4415dfa9e96800b34b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_57b50afbea3e46eea2765825cb"`,
    );
    await queryRunner.query(`DROP TABLE "company_categories"`);
  }
}
