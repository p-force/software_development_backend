import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Users {
  @ApiProperty({ description: 'Уникальный идентификатор пользователя', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Имя пользователя', example: 'Ivan' })
  @Column({ length: 100, nullable: false })
  name: string;

  @ApiProperty({ description: 'Фамилия пользователя', example: 'Ivanov' })
  @Column({ length: 100, nullable: false })
  surname: string;

  @ApiProperty({ description: 'Email пользователя', example: 'user@mail.ru' })
  @Column({ nullable: false, unique: true })
  email: string;

  @ApiProperty({ description: 'Хэшированный пароль пользователя' })
  @Column({ nullable: false })
  password: string;

  @ApiProperty({ description: 'Мобильный номер пользователя', example: '+70123456789' })
  @Column({ nullable: false })
  phone: string;
}
