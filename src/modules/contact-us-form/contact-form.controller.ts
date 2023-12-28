import { Body, Controller, Post, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags, ApiBadRequestResponse } from '@nestjs/swagger';
import { ContactFormService } from './contact-form.service';
import { ContactStatusMessages } from './dto/contactForm.constant';
import { ContactFormDto } from './dto/contactForm.dto';

@ApiTags('Contact Form')
@Controller('contact')
export class ContactFormController {
  constructor(private readonly contactService: ContactFormService) {}

  @ApiOperation({ summary: 'Отправление "Contact Form"' })
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    description: ContactStatusMessages.CREATE_REQUEST_SUCCESS,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: `${ContactStatusMessages.ERROR}\t\n\t\nsome error message`,
  })
  @Post('/contact-us')
  async createForm(@Body() contactServiceDto: ContactFormDto) {
    return this.contactService.create(contactServiceDto);
  }
}
