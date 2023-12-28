import { MigrationInterface, QueryRunner } from 'typeorm';

export class recoveryPassword1703636522802 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "recovery_password_code" (
            id SERIAL PRIMARY KEY,
            "userId" INTEGER NOT NULL,
            "code" TEXT NOT NULL,
            "deletedAt" TIMESTAMP,
            "expiresAt" TIMESTAMP NOT NULL,
            FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE
            )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "recovery_password_code"`);
  }
}
