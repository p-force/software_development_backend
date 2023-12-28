import { OnQueueActive, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { SMSService } from './sms.service';
import { WinstonLoggerService } from '../logger/winston-logger.service';
import { Job } from 'bull';
import { SendSMSInterface } from './interfaces/send-sms.interface';
import { messages } from '../../messages';

@Processor('sms')
export class SMSConsumer {
  constructor(
    private readonly smsService: SMSService,
    private readonly logger: WinstonLoggerService,
  ) {}
  @OnQueueActive()
  onActive(job: Job<SendSMSInterface>) {
    this.logger.log(
      messages.successMessage.sms.jobInProgress(job.id, job.data.phone),
      SMSConsumer.name,
    );
  }

  @OnQueueFailed()
  onFail(job: Job<SendSMSInterface>, error: Error) {
    this.logger.log(
      messages.errorMessage.sms.jobFailed(job.id, job.data.phone, error.message),
      SMSConsumer.name,
    );
  }

  @Process()
  async process(job: Job<SendSMSInterface>) {
    await this.smsService.sendSMS(job.data);
  }
}
