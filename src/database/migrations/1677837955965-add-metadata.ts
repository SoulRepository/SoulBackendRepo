import { MigrationInterface, QueryRunner } from 'typeorm';

export class addMetadata1677837955965 implements MigrationInterface {
  name = 'addMetadata1677837955965';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "image" ADD "metadata" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "metadata"`);
  }
}
