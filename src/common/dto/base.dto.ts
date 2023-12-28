import { IValidator } from '../interfaces/validator.interface';

export interface IValidateFieldOptions<T> {
  requiredErrorMessage?: any;
  validator?: (T) => boolean;
  validatorErrorMessage?: any;
}

export abstract class BaseDto {
  abstract validate(): IValidator;
  protected _messages: any[];

  protected constructor() {
    this._messages = [];
  }

  protected validateField<T>(
    field: T,
    { requiredErrorMessage, validator, validatorErrorMessage }: IValidateFieldOptions<T>,
  ) {
    if (requiredErrorMessage && !field) {
      this._messages.push(requiredErrorMessage);
    }
    if (validator && field && !validator(field)) {
      this._messages.push(validatorErrorMessage ? validatorErrorMessage : 'Value is in invalid');
    }
  }
}
