import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetInTouchFormService } from './get-in-touch-form.service';
import { GetInTouchFormStatusMessages } from './dto/get-in-touch-form.constatnts';
import { GetInTouchFormDto } from './dto/get-in-touch-form.dto';

@ApiTags('Get In Touch Form')
@Controller('get-in-touch')
export class GetInTouchFormController {
  constructor(private readonly getInTouchService: GetInTouchFormService) {}

  @ApiOperation({ summary: 'Отправление "Contact Form"' })
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    description: GetInTouchFormStatusMessages.CREATE_REQUEST_SUCCESS,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: `${GetInTouchFormStatusMessages.ERROR}\t\n\t\nsome error message`,
  })
  @Post('/order')
  async createform(@Body() getInTouchDto: GetInTouchFormDto) {
    return this.getInTouchService.create(getInTouchDto);
  }
}
