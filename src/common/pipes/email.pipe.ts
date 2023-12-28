import { PipeTransform, Injectable } from '@nestjs/common';
import { isEmail } from 'class-validator';
import { makeError } from '../utils/make-error';
import { messages } from '../messages';
import { errorsEnum } from '../enum/errors.enum';

@Injectable()
export class EmailPipe implements PipeTransform {
  transform(value: any) {
    if (isEmail(value)) {
      return value;
    }
    throw makeError(errorsEnum.BAD_REQUEST, {
      errorMessage: messages.errorMessage.validate.valueIsNotEmail('email'),
    });
  }
}
