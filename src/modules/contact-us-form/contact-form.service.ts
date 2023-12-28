import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactForm } from './contactForm.entity';
import { Repository } from 'typeorm';
import { MailerConfigType, MAILER_CONFIG_KEY } from 'src/common/config/mailer.config';
import { MailerService } from 'src/common/modules/mailer/mailer.service';
import { ContactFormDto } from './dto/contactForm.dto';
import { ContactStatusMessages } from './dto/contactForm.constant';

@Injectable()
export class ContactFormService {
  constructor(
    @InjectRepository(ContactForm) private readonly subscribersRepository: Repository<ContactForm>,
    @Inject(MAILER_CONFIG_KEY)
    private readonly mailConfig: MailerConfigType,
    private readonly mailerService: MailerService,
  ) {}
  async create(createContactDto: ContactFormDto) {
    try {
      await this.subscribersRepository.save(createContactDto);

      await this.mailerService.sendMail({
        subject: 'New contact form',
        emails: [this.mailConfig.managerEmail],
        htmlTemplate: 'contact-us',
        templateVars: {
          nameSurname: createContactDto.fullName,
          email: createContactDto.email,
          phone: createContactDto.phone,
          companyName: createContactDto.companyName,
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: ContactStatusMessages.CREATE_REQUEST_SUCCESS,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
