import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, IsPhoneNumber } from 'class-validator';

export class GetInTouchFormDto {
  @ApiProperty({ description: 'Имя и Фамилия', example: 'Ivan Ivanov' })
  @IsNotEmpty({ message: 'The "Name and Surname" field must not be empty' })
  @MaxLength(100, { message: "The 'Name and Surname' field must not exceed 100 characters." })
  readonly fullName: string;

  @ApiProperty({ description: 'Номер телефона', example: '+7 0123456789' })
  @IsNotEmpty({ message: "The 'Phone Number' field must not be empty." })
  @IsPhoneNumber('RU', { message: 'The phone number must be valid.' })
  @MaxLength(50, { message: "The 'Phone Number' field must not exceed 50 characters." })
  readonly phone: string;
}
