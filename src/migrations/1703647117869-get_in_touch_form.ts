import { MigrationInterface, QueryRunner } from 'typeorm';

export class getInTouchForm1703647117869 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "get_in_touch_form" (id SERIAL PRIMARY KEY,"fullName" VARCHAR NOT NULL,"phone" VARCHAR NOT NULL)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "get_in_touch_form"`);
  }
}
