import { Body, Controller, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TellUsFormService } from './tell-us-form.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { TellUsForm } from './tell-us-form.entity';
import { TellUsFormDto } from './tell-us-form.dto';

ApiTags('Tell Us About Project Form');
@Controller('tell-us-form')
export class TellUsFormController {
  constructor(private readonly tellUsService: TellUsFormService) {}
  @ApiTags('Personal Data Form')
  @ApiOperation({ summary: 'Отправление персональных данных' })
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully submitted',
    type: () => TellUsForm,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: `some error message`,
  })
  @Post('/order')
  async create(@Body() createUserDto: TellUsFormDto) {
    return this.tellUsService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'Upload file',
  })
  @ApiOkResponse({
    schema: {
      properties: {
        url: {
          type: 'string',
          example:
            'https://rgo.ru/upload/content_block/images/9ca8302358b777e143cd6e314058266b.jpg',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @Post('upload')
  putNewFile(@UploadedFile('uploadFile') file): { url: string } {
    return this.tellUsService.putNewFile(file);
  }
}
