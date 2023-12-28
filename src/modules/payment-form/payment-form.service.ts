import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PaymentForm } from './payment-form.entity';
import { Repository } from 'typeorm';
import { Users } from '../auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MAILER_CONFIG_KEY, MailerConfigType } from 'src/common/config/mailer.config';
import { MailerService } from 'src/common/modules/mailer/mailer.service';
import { APP_CONFIG_KEY, AppConfigType } from 'src/common/config/app.config';
import { PaymentFormDto } from './payment-form.dto';
import bcrypt from 'bcryptjs';

@Injectable()
export class PaymentFormService {
  constructor(
    @InjectRepository(PaymentForm)
    private paymentRepository: Repository<PaymentForm>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @Inject(APP_CONFIG_KEY)
    private readonly appConfig: AppConfigType,
    @Inject(MAILER_CONFIG_KEY)
    private readonly mailConfig: MailerConfigType,
    private readonly mailerService: MailerService,
  ) {}
  gen_password() {
    const len = 8;
    const result = Math.random()
      .toString(36)
      .slice(2, 2 + len);
    if (!result.match(/[a-zA-Z]/gm)) return this.gen_password();
    if (!result.match(/[0-9]/gm)) return this.gen_password();
    return result;
  }

  async createUser(createUserDto: PaymentFormDto) {
    try {
      let user = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (!user) {
        const password = this.gen_password();
        const hash = await bcrypt.hash(password, 10);
        user = await this.userRepository.save({
          email: createUserDto.email,
          password: hash,
        });

        await this.mailerService.sendMail({
          subject: 'Thank you for your order',
          emails: [createUserDto.email],
          htmlTemplate: 'register-order',
          templateVars: {
            login: createUserDto.email,
            password: password,
            link: '',
          },
        });
      } else {
        await this.mailerService.sendMail({
          subject: 'Thank you for your order',
          emails: [createUserDto.email],
          htmlTemplate: 'exist-reg',
        });
      }

      await this.paymentRepository.save(createUserDto);

      await this.mailerService.sendMail({
        subject: 'Refund',
        emails: [createUserDto.email],
        htmlTemplate: 'refund',
      });
      await this.mailerService.sendMail({
        subject: 'New reg form',
        emails: [this.mailConfig.managerEmail],
        htmlTemplate: 'new-reg',
        templateVars: {
          email: createUserDto.email,
          amount: createUserDto.amount,
          paymentNotes: createUserDto.paymentNotes,
          paymentMethod: createUserDto.options,
          coupon: createUserDto.coupon,
        },
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: 'SUCCESS',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST, { cause: new Error(error) });
    }
  }
}
