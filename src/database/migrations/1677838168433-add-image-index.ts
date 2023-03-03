import { MigrationInterface, QueryRunner } from "typeorm";

export class addImageIndex1677838168433 implements MigrationInterface {
    name = 'addImageIndex1677838168433'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_7c77ec1a4c00eda85540cbe57a" ON "image" ("key") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_7c77ec1a4c00eda85540cbe57a"`);
    }

}
