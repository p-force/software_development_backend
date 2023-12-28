import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { BaseResponseDto } from '../../dto/base-response.dto';

export const ApiBaseResponseOneOf = <TModel extends Type<any>>(
  model?: TModel[],
  isArray = false,
) => {
  if (isArray) {
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
                    oneOf: model.map((m) => ({
                      $ref: getSchemaPath(m),
                    })),
                  },
                },
              },
            },
          ],
        },
      }),
      ApiExtraModels(BaseResponseDto, ...model),
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
                oneOf: model.map((m) => ({
                  $ref: getSchemaPath(m),
                })),
              },
            },
          },
        ],
      },
    }),
    ApiExtraModels(BaseResponseDto, ...model),
  );
};
