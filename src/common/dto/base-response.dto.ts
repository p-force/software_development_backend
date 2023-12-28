import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ResponseStatus } from '../enum/response-status.enum';

export class BaseResponseDto<ResultType> {
  /** Статус генерируется автоматически.
   *
   * Если передать сообщение об ошибке, то статус: ERROR,
   * в противном случае: OK
   */
  @ApiProperty({
    enum: ResponseStatus,
    description: 'Статус ответа',
  })
  private status: ResponseStatus;

  /** Сообщения об ошибках */
  @ApiPropertyOptional({
    description: `Сообщения об ошибках если status = ${ResponseStatus.error}`,
  })
  private messages?: any[];
  /** Результат запроса */
  @ApiPropertyOptional({
    description: `Результат если status = ${ResponseStatus.ok}`,
  })
  result: ResultType;

  constructor(result?: ResultType) {
    this.status = ResponseStatus.ok;
    if (result != undefined) {
      this.result = result;
    }
  }

  addMessage(message: string | string[] | Record<string, unknown> | Record<string, unknown>[]) {
    if (!this.messages) {
      this.messages = [];
    }
    if (Array.isArray(message)) {
      this.messages.push(...message);
    } else {
      this.messages.push(message);
    }
    this.status = ResponseStatus.error;
  }

  get isOk(): boolean {
    return this.status === ResponseStatus.ok;
  }
}
