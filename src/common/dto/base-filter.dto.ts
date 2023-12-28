import { isString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IValidator } from '../interfaces/validator.interface';
import { BaseDto } from './base.dto';
import { errorMessage } from '../messages/error/error.messages';

export class BaseFilterDto<SearchType, FieldType> extends BaseDto {
  @ApiProperty({
    description: 'Строка поиска при фильтрации',
    required: false,
  })
  search: SearchType;

  @ApiProperty({
    description: 'Поле фильтрации',
    required: false,
  })
  field: FieldType;

  constructor(field: FieldType, search: SearchType) {
    super();
    this.search = search;
    this.field = field;
  }

  validate(): IValidator {
    this.validateField(this.search, {
      validator: isString,
      validatorErrorMessage: errorMessage.validate.valueIsNotString('search'),
    });
    return {
      status: !this._messages.length,
      messages: this._messages,
    };
  }
}
