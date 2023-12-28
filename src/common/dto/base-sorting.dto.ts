import { isEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IValidator } from '../interfaces/validator.interface';
import { BaseDto } from './base.dto';
import { errorMessage } from '../messages/error/error.messages';
import { SortingOrder } from '../enum/sorting-order.enum';

export class BaseSortingDto<T> extends BaseDto {
  @ApiProperty()
  order: SortingOrder;

  @ApiProperty()
  sort: T;

  constructor(order?: SortingOrder) {
    super();
    this.order = order ? order : SortingOrder.ASC;
  }

  validate(): IValidator {
    this.validateField(this.order, {
      validator: (value) => isEnum(value, SortingOrder),
      validatorErrorMessage: errorMessage.validate.valueIsNotEnum(
        'sort',
        Object.values(SortingOrder),
      ),
    });
    return {
      status: !this._messages.length,
      messages: this._messages,
    };
  }
}
