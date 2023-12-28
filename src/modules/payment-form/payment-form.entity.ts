import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class PaymentForm {
  @ApiProperty({ description: 'Уникальный идентификатор пользователя', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Email пользователя', example: 'user@mail.ru' })
  @Column({ nullable: false, unique: true })
  email: string;

  @ApiProperty({ description: 'Сумма' })
  @Column({ nullable: false })
  amount: string;

  @ApiProperty({ description: 'Купон', example: 'FR000000' })
  @Column({ nullable: true })
  coupon: string;

  @ApiProperty({ description: 'Форма оплаты' })
  @Column({ nullable: false })
  options: string;

  @ApiProperty({ description: 'Сообщение' })
  @Column({ nullable: true, length: 500 })
  paymentNotes: string;
}
