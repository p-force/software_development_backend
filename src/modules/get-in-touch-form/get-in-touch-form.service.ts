import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { GetInTouchFormDto } from './dto/get-in-touch-form.dto';
import { GetInTouchFormStatusMessages } from './dto/get-in-touch-form.constatnts';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetInTouchForm } from './get-in-touch-form.entity';
import { MAILER_CONFIG_KEY, MailerConfigType } from 'src/common/config/mailer.config';
import { MailerService } from 'src/common/modules/mailer/mailer.service';

@Injectable()
export class GetInTouchFormService {
  constructor(
    @InjectRepository(GetInTouchForm)
    private readonly getInTouchRepository: Repository<GetInTouchForm>,
    @Inject(MAILER_CONFIG_KEY)
    private readonly mailConfig: MailerConfigType,
    private readonly mailerService: MailerService,
  ) {}
  async create(getInTouchDto: GetInTouchFormDto) {
    try {
      await this.getInTouchRepository.save(getInTouchDto);

      await this.mailerService.sendMail({
        subject: 'New Get In Touch form',
        emails: [this.mailConfig.managerEmail],
        htmlTemplate: 'get-in-touch',
        templateVars: {
          fullName: getInTouchDto.fullName,
          phone: getInTouchDto.phone,
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: GetInTouchFormStatusMessages.CREATE_REQUEST_SUCCESS,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST, { cause: new Error(error) });
    }
  }
}
