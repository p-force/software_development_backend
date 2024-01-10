import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MaxLength,
  IsPhoneNumber,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class AuthFormDto {
  @ApiProperty({ description: 'Имя и Фамилия', example: 'Ivan Ivanov' })
  @IsNotEmpty({ message: 'The "Name and Surname" field must not be empty' })
  @MaxLength(100, { message: "The 'Name and Surname' field must not exceed 100 characters." })
  readonly name: string;

  @ApiProperty({ description: 'Имя и Фамилия', example: 'Ivan Ivanov' })
  @IsNotEmpty({ message: 'The "Name and Surname" field must not be empty' })
  @MaxLength(100, { message: "The 'Name and Surname' field must not exceed 100 characters." })
  readonly surname: string;

  @ApiProperty({ description: 'Email пользователя', example: 'user@mail.ru' })
  @IsString({ message: 'Email must be a string.' })
  @IsEmail({}, { message: 'Invalid email.' })
  readonly email: string;

  @ApiProperty({ description: 'Номер телефона', example: '+7 0123456789' })
  @IsNotEmpty({ message: "The 'Phone Number' field must not be empty." })
  @IsPhoneNumber(undefined, { message: 'The phone number must be valid.' })
  @MaxLength(50, { message: "The 'Phone Number' field must not exceed 50 characters." })
  readonly phone: string;

  @ApiProperty({ description: 'Пароль пользователя', example: '#VeryCoolPassword1234' })
  @IsString({ message: 'The password must be a string.' })
  @IsStrongPassword({}, { message: 'The password is too simple.' })
  @MinLength(8, { message: 'The "Password" field must not be shorter than 8 characters.' })
  readonly password: string;
}
