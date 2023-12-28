import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class PagePipe implements PipeTransform {
  transform(page: number) {
    return page > 0 ? page : 1;
  }
}
