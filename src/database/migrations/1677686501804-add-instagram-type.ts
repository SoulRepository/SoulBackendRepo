import { MigrationInterface, QueryRunner } from 'typeorm';

export class addInstagramType1677686501804 implements MigrationInterface {
  name = 'addInstagramType1677686501804';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "category" ADD "description" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "description"`);
  }
}
