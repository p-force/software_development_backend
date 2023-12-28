import { MigrationInterface, QueryRunner } from 'typeorm';

export class contactForm1703648387894 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "contact_form" (id SERIAL PRIMARY KEY,"fullName" VARCHAR NOT NULL,"phone" VARCHAR NOT NULL,"email" VARCHAR NOT NULL,"companyName" VARCHAR NOT NULL)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "contact_form"`);
  }
}
