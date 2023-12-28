import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class ChangeAttributesDto {
  @ApiProperty({ description: 'Имя и Фамилия', example: 'Ivan Ivanov' })
  @IsNotEmpty({ message: 'The "Name and Surname" field must not be empty' })
  @MaxLength(100, { message: "The 'Name and Surname' field must not exceed 100 characters." })
  readonly name: string;

  @ApiProperty({ description: 'Имя и Фамилия', example: 'Ivan Ivanov' })
  @IsNotEmpty({ message: 'The "Name and Surname" field must not be empty' })
  @MaxLength(100, { message: "The 'Name and Surname' field must not exceed 100 characters." })
  readonly surname: string;
}
