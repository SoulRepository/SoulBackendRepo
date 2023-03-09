import { MigrationInterface, QueryRunner } from 'typeorm';

export class addInstagramType1677684723064 implements MigrationInterface {
  name = 'addInstagramType1677684723064';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company" ALTER COLUMN "description" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."company_link_type_enum" RENAME TO "company_link_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."company_link_type_enum" AS ENUM('twitter', 'facebook', 'linkedin', 'discord', 'site', 'instagram')`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_link" ALTER COLUMN "type" TYPE "public"."company_link_type_enum" USING "type"::"text"::"public"."company_link_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."company_link_type_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."company_link_type_enum_old" AS ENUM('twitter', 'facebook', 'linkedin', 'discord', 'site')`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_link" ALTER COLUMN "type" TYPE "public"."company_link_type_enum_old" USING "type"::"text"::"public"."company_link_type_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."company_link_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."company_link_type_enum_old" RENAME TO "company_link_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ALTER COLUMN "description" SET NOT NULL`,
    );
  }
}
