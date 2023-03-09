import { MigrationInterface, QueryRunner } from 'typeorm';

export class addCompanyIndex1677766513495 implements MigrationInterface {
  name = 'addCompanyIndex1677766513495';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_a76c5cd486f7779bd9c319afd2" ON "company" ("name") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_3e3848c6ff135ac78c333683f9" ON "company" ("soulId") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_aac23a4cca723471779007fe2f" ON "company" ("address") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_aac23a4cca723471779007fe2f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3e3848c6ff135ac78c333683f9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a76c5cd486f7779bd9c319afd2"`,
    );
  }
}
