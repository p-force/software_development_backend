import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  ArrayMaxSize,
  IsMimeType,
  ValidationOptions,
  IsPhoneNumber,
} from 'class-validator';

export class TellUsFormDto {
  @ApiProperty({ description: 'Имя и Фамилия', example: 'Ivan Ivanov' })
  @IsNotEmpty({ message: 'The "Name and Surname" field must not be empty' })
  @MaxLength(100, { message: "The 'Name and Surname' field must not exceed 100 characters." })
  readonly fullName: string;

  @ApiProperty({ description: 'Email пользователя', example: 'user@mail.ru' })
  @IsNotEmpty({ message: 'Email must not be empty.' })
  @IsString({ message: 'Email must be a string.' })
  @IsEmail({}, { message: 'Invalid email.' })
  readonly email: string;

  @ApiProperty({ description: 'Бюджет' })
  @IsNotEmpty({ message: "Select 'Budget'" })
  readonly budget: string;

  @ApiProperty({ description: 'Номер телефона', example: '+7 0123456789' })
  @IsNotEmpty({ message: "The 'Phone Number' field must not be empty." })
  @IsPhoneNumber(undefined, { message: 'The phone number must be valid.' })
  @MaxLength(50, { message: "The 'Phone Number' field must not exceed 50 characters." })
  readonly phone: string;

  @ApiProperty({ description: 'Сообщение' })
  @IsOptional({ message: "The 'Message' field must be empty." })
  @IsString({ message: "The 'Message' field must be a string." })
  @MaxLength(500, { message: "The 'Message' field must not exceed 500 characters." })
  message: string;

  @ApiProperty({
    description: 'Текстовый файл',
    format: 'text/plain',
    type: 'string',
  })
  @ArrayMaxSize(1, { message: 'There should not be more than two elements.' })
  @IsMimeType('text/plain' as ValidationOptions)
  readonly uploadFile: string;
}
