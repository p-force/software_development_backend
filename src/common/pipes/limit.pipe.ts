import { PipeTransform, Injectable, Inject } from '@nestjs/common';
import { AppConfigType, APP_CONFIG_KEY } from '../config/app.config';

@Injectable()
export class LimitPipe implements PipeTransform {
  constructor(@Inject(APP_CONFIG_KEY) private appConfig: AppConfigType) {}
  transform(limit: number) {
    const maxLimit = this.appConfig.maxLimit;
    if (!limit) {
      return maxLimit;
    }
    return maxLimit < limit ? maxLimit : limit;
  }
}
