import { Injectable, PipeTransform } from '@nestjs/common';
import { makeError } from '../utils/make-error';
import { phoneTransform } from '../utils/phone.transform';
import { messages } from '../messages';
import { errorsEnum } from '../enum/errors.enum';

@Injectable()
export class PhonePipe implements PipeTransform {
  transform(value: string) {
    const phone = phoneTransform(value);
    if (phone.length === 11) {
      return phone;
    }

    throw makeError(errorsEnum.BAD_REQUEST, {
      errorMessage: messages.errorMessage.validate.valueIsNotPhone('phone'),
    });
  }
}
