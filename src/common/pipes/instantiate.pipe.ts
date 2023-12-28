import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class InstantiatePipe implements PipeTransform {
  transform(value, metadata: ArgumentMetadata) {
    return new metadata.metatype(value);
  }
}
