import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1747655039273 implements MigrationInterface {
    name = 'Init1747655039273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "confirmed"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."subscriptions_status_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."subscriptions_status_enum" AS ENUM('created', 'confirmed', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "status" "public"."subscriptions_status_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "confirmed" boolean NOT NULL DEFAULT false`);
    }

}
