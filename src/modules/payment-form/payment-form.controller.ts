import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentFormService } from './payment-form.service';
import { PaymentForm } from './payment-form.entity';
import { PaymentFormDto } from './payment-form.dto';

@ApiTags('Payment Form')
@Controller('payment-form')
export class PaymentFormController {
  constructor(private readonly paymentService: PaymentFormService) {}
  @ApiTags('Personal Data Form')
  @ApiOperation({ summary: 'Отправление персональных данных' })
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    description: 'SUCCESS',
    type: () => PaymentForm,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: `\t\n\t\nsome error message`,
  })
  @Post('/card-payment')
  async create(@Body() createUserDto: PaymentFormDto) {
    return this.paymentService.createUser(createUserDto);
  }
}
