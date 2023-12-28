import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export abstract class BaseMultiFilterSortingDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  limit?: number;

  abstract filter?: Array<any>;
  abstract sorting?: Array<any>;

  protected constructor(page?: number, limit?: number) {
    this.page = page && page > 0 ? page : 1;
    this.limit = limit;
  }

  private readonly _messages: Array<string> = [];

  get messages(): Array<string> {
    return this._messages;
  }

  get isValid() {
    if (this.filter) {
      this.filter.forEach((item) => {
        const result = item.validate();
        if (!result.status) {
          this._messages.push(...result.messages);
        }
      });
    }

    if (this.sorting) {
      this.sorting.forEach((item) => {
        const result = item.validate();
        if (!result.status) {
          this._messages.push(...result.messages);
        }
      });
    }

    return this._messages.length <= 0;
  }

  getLimit(maxLimit: number) {
    return this.limit && this.limit < maxLimit ? this.limit : maxLimit;
  }
}
