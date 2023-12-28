import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsEmail, IsOptional, IsNotEmpty, Matches, MaxLength } from 'class-validator';

export class PaymentFormDto {
  @ApiProperty({ description: 'Email пользователя', example: 'user@mail.ru' })
  @IsNotEmpty({ message: 'Email must not be empty.' })
  @IsString({ message: 'Email must be a string.' })
  @IsEmail({}, { message: 'Invalid email.' })
  readonly email: string;

  @ApiProperty({ description: 'Сумма' })
  @IsString({ message: 'amount must be a string.' })
  @IsNotEmpty({ message: 'amount must not be empty.' })
  readonly amount: string;

  @ApiProperty({ description: 'Купон', example: 'FR000000' })
  @IsString({ message: "The 'Coupon' field must be a string." })
  @IsOptional({ message: "The 'Coupon' field must be empty." })
  @Matches(/^FR\d{6}$/, { message: "Coupon doesn't exist" })
  readonly coupon: string;

  @ApiProperty({ description: 'Сообщение' })
  @IsOptional({ message: "The 'paymentNotes' field must be empty." })
  @IsString({ message: "The 'paymentNotes' field must be a string." })
  @MaxLength(500, { message: "The 'paymentNotes' field must not exceed 500 characters." })
  readonly paymentNotes: string;

  @ApiProperty({ description: 'Форма оплаты' })
  @IsOptional({ message: "The 'options' field must be empty." })
  @IsString({ message: "The 'options' field must be a string." })
  readonly options: string;
}
