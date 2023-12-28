import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TellUsForm } from './tell-us-form.entity';
import { Repository } from 'typeorm';
import { MailerService } from 'src/common/modules/mailer/mailer.service';
import { MailerConfigType, MAILER_CONFIG_KEY } from 'src/common/config/mailer.config';
import { TellUsFormDto } from './tell-us-form.dto';
import { join } from 'path';
import { v4 as uuid } from 'uuid';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { AppConfigType, APP_CONFIG_KEY } from 'src/common/config/app.config';

@Injectable()
export class TellUsFormService {
  constructor(
    @InjectRepository(TellUsForm) private readonly subscribersRepository: Repository<TellUsForm>,
    @Inject(MAILER_CONFIG_KEY)
    private readonly mailConfig: MailerConfigType,
    private readonly mailerService: MailerService,
    @Inject(APP_CONFIG_KEY)
    private readonly appConfig: AppConfigType,
  ) {}
  async create(formDto: TellUsFormDto) {
    try {
      await this.subscribersRepository.save(formDto);

      await this.mailerService.sendMail({
        subject: 'New Tell Us About Project Form',
        emails: [this.mailConfig.managerEmail],
        htmlTemplate: 'tell-us',
        templateVars: {
          nameSurname: formDto.fullName,
          email: formDto.email,
          phone: formDto.phone,
          budget: formDto.budget,
          message: formDto.message,
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Successfully submitted',
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  putNewFile(file) {
    if (!file?.originalname || !file?.buffer)
      throw new BadRequestException({ file: 'Uncorrect file' });
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      throw new BadRequestException({ file: 'File is too large' });
    }
    const filename = uuid() + '.' + this.ext(file.originalname);

    const dirPath = join(process.cwd(), 'doc');
    if (!existsSync(dirPath)) mkdirSync(dirPath);
    try {
      createWriteStream(join(dirPath, filename)).write(file.buffer);
    } catch (error) {
      throw new BadRequestException({ file: 'Error saving file' });
    }
    return { url: this.appConfig.appUrl + `/files/${filename}` };
  }

  private ext(name: string): string {
    const m = name.match(/\.([^.]+)$/);
    return m && m[1];
  }
}
