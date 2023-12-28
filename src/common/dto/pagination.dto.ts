import { ApiProperty } from '@nestjs/swagger';
import { IPaginationOptions } from '../interfaces/pagination-options.interface';

export class PaginationDto<T> {
  @ApiProperty({ description: 'Общее количество элементов' })
  totalItems: number;

  @ApiProperty({ description: 'Текущая страница' })
  currentPage: number;

  @ApiProperty({ description: 'Общее количество страниц' })
  totalPages: number;

  @ApiProperty({ description: 'Количество элементов на странице (лимит)' })
  limit: number;

  @ApiProperty({ type: 'array', items: { type: 'object' } })
  items: T[];

  constructor(items: T[], options: IPaginationOptions) {
    this.items = items;
    this.totalItems = options.count;
    this.limit = options.limit;
    this.currentPage = options.page;
    this.totalPages = Math.ceil(options.count / options.limit);
  }
}
