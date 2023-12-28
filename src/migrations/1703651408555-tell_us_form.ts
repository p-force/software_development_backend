import { MigrationInterface, QueryRunner } from 'typeorm';

export class tellUsForm1703651408555 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "tell_us_form" (id SERIAL PRIMARY KEY,"fullName" VARCHAR NOT NULL,"email" VARCHAR NOT NULL,"budget" VARCHAR NOT NULL,"uploadFile" text NOT NULL,"message" TEXT,"phone" VARCHAR NOT NULL)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tell_us_form"`);
  }
}
