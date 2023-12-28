import { Inject, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SMS_CONFIG_KEY, SMSConfigType } from '../../config/sms.config';
import { WinstonLoggerService } from '../logger/winston-logger.service';
import { SendSMSInterface } from './interfaces/send-sms.interface';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { makeError } from '../../utils/make-error';
import { messages } from '../../messages';
import { errorsEnum } from '../../enum/errors.enum';

@Injectable()
export class SMSService {
  constructor(
    @Inject(SMS_CONFIG_KEY) private readonly smsConfig: SMSConfigType,
    @InjectQueue('sms') private readonly queue: Queue,
    private readonly httpService: HttpService,
    private readonly logger: WinstonLoggerService,
  ) {
    if (smsConfig.token?.length > 0) this.initFlag = true;
  }

  /** Флаг инициализации */
  private readonly initFlag: boolean;

  /**
   * Отправляет sms сообщение
   * @param sms
   */
  async sendSMS(sms: SendSMSInterface) {
    if (!this.initFlag) {
      this.logger.error(messages.errorMessage.sms.noSMSTokenProvided, SMSService.name);
    }
    this.logger.log(messages.successMessage.sms.smsTrySend(sms.phone), SMSService.name);
    const result = await lastValueFrom(
      this.httpService.post(
        `https://api3.greensms.ru/sms/send`,
        {
          txt: sms.message,
          to: sms.phone,
          from: this.smsConfig.sender,
        },
        {
          headers: {
            Authorization: `Bearer ${this.smsConfig.token}`,
          },
        },
      ),
    );

    if (!result?.data) {
      this.logger.error(messages.errorMessage.sms.noSMSServiceResponse, SMSService.name);
      throw makeError(errorsEnum.NO_RESPONSE_FROM_HTTP_REQUEST, {
        message: messages.errorMessage.sms.noSMSServiceResponse,
      });
    }
    if (result.data?.error) {
      this.logger.error(result.data.error, SMSService.name);
      throw new Error(result.data.error + result.data.code);
    }

    this.logger.log(messages.successMessage.sms.smsSendSuccess(sms.phone), SMSService.name);
  }

  /**
   * Добавить в очередь задачу по отправке SMS сообщения
   * @param sms
   */
  async addJob(sms: SendSMSInterface) {
    if (!this.initFlag) {
      this.logger.error(messages.errorMessage.sms.noSMSTokenProvided, SMSService.name);
    }

    const { id, data } = await this.queue.add(sms);
    this.logger.log(messages.successMessage.sms.smsJobAdd(id, data.phone), SMSService.name);
  }
}
