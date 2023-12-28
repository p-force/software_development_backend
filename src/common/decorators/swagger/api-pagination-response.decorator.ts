import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginationDto } from '../../dto/pagination.dto';
import { BaseResponseDto } from '../../dto/base-response.dto';

export const ApiPaginationResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponseDto) },
          {
            properties: {
              result: {
                allOf: [
                  { $ref: getSchemaPath(PaginationDto) },
                  {
                    properties: {
                      items: {
                        type: 'array',
                        items: {
                          $ref: getSchemaPath(model),
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    }),
    ApiExtraModels(BaseResponseDto, PaginationDto, model),
  );
};
