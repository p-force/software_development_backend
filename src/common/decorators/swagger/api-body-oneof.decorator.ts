import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, getSchemaPath, ApiBody } from '@nestjs/swagger';

export const ApiBodyOneOf = <TModel extends Type<any>>(models?: TModel[]) => {
  return applyDecorators(
    ApiBody({
      schema: {
        oneOf: [
          ...models.map((model) => ({
            $ref: getSchemaPath(model),
          })),
        ],
      },
    }),
    ApiExtraModels(...models),
  );
};
