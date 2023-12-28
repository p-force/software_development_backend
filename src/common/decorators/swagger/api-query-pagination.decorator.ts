import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { SwaggerEnumType } from '@nestjs/swagger/dist/types/swagger-enum.type';
import { SortingOrder } from '../../enum/sorting-order.enum';

export const ApiQueryPagination = <
  TFilter extends SwaggerEnumType,
  TSorting extends SwaggerEnumType,
>(
  filter: TFilter,
  sorting: TSorting,
) => {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Номер страницы (страницы начинаются с 1)',
      type: Number,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: `Максимальное количество элементов на странице`,
      type: Number,
    }),
    ApiQuery({
      name: 'field',
      required: false,
      description: 'Поле фильтрации',
      enum: filter,
    }),
    ApiQuery({
      name: 'search',
      required: false,
      description: 'Строка фильтрации',
      type: String,
    }),
    ApiQuery({
      name: 'sorting',
      required: false,
      description: 'Поле для сортировки',
      enum: sorting,
    }),
    ApiQuery({
      name: 'order',
      required: false,
      description: 'Направление сортировки',
      enum: SortingOrder,
    }),
  );
};
