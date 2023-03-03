import { MigrationInterface, QueryRunner } from "typeorm";

export class updateIndex1677773563969 implements MigrationInterface {
    name = 'updateIndex1677773563969'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ac06936f23d7fe79bb2ec6aa19" ON "company_link" ("companyId", "type") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_ac06936f23d7fe79bb2ec6aa19"`);
    }

}
