import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class TellUsForm {
  @ApiProperty({ description: 'Уникальный идентификатор пользователя', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Имя и фамилия пользователя', example: 'Ivan Ivanov' })
  @Column({ length: 100, nullable: false })
  fullName: string;

  @ApiProperty({ description: 'Email пользователя', example: 'user@mail.ru' })
  @Column({ nullable: false, unique: true })
  email: string;

  @ApiProperty({ description: 'Мобильный номер пользователя', example: '+7 0123456789' })
  @Column({ nullable: false })
  phone: string;

  @ApiProperty({ description: 'Выбор бюджета' })
  @Column({ nullable: false })
  budget: string;

  @ApiProperty({ description: 'Загрузка файла', example: 'file.doc' })
  @Column({ nullable: true })
  uploadFile: string;

  @ApiProperty({ description: 'Сообщение' })
  @Column({ nullable: true, length: 500 })
  message: string;
}
