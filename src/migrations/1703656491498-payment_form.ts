import { MigrationInterface, QueryRunner } from 'typeorm';

export class paymentForm1703656491498 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "payment_form" (id SERIAL PRIMARY KEY,"email" VARCHAR NOT NULL,"amount" VARCHAR NOT NULL,"coupon" VARCHAR,"options" VARCHAR NOT NULL,"paymentNotes" text)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "payment_form"`);
  }
}
