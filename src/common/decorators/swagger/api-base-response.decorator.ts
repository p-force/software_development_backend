import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { BaseResponseDto } from '../../dto/base-response.dto';

export interface IApiBaseResponseOptions {
  isArray: boolean;
}
export const ApiBaseResponse = <TModel extends Type>(
  model?: TModel,
  opts?: IApiBaseResponseOptions,
) => {
  if (opts && opts.isArray) {
    if (model) {
      return applyDecorators(
        ApiOkResponse({
          schema: {
            allOf: [
              { $ref: getSchemaPath(BaseResponseDto) },
              {
                properties: {
                  result: {
                    type: 'array',
                    items: {
                      $ref: getSchemaPath(model),
                    },
                  },
                },
              },
            ],
          },
        }),
        ApiExtraModels(BaseResponseDto, model),
      );
    }
    return applyDecorators(
      ApiOkResponse({
        schema: {
          allOf: [
            { $ref: getSchemaPath(BaseResponseDto) },
            {
              properties: {
                result: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                },
              },
            },
          ],
        },
      }),
      ApiExtraModels(BaseResponseDto),
    );
  }
  if (model) {
    return applyDecorators(
      ApiOkResponse({
        schema: {
          allOf: [
            { $ref: getSchemaPath(BaseResponseDto) },
            {
              properties: {
                result: {
                  $ref: getSchemaPath(model),
                },
              },
            },
          ],
        },
      }),
      ApiExtraModels(BaseResponseDto, model),
    );
  }
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponseDto) },
          {
            properties: {
              result: {
                type: 'string',
              },
            },
          },
        ],
      },
    }),
    ApiExtraModels(BaseResponseDto),
  );
};
