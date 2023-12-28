import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { WinstonLoggerService } from '../logger/winston-logger.service';
import { TelegramService } from './telegram.service';
import { Job } from 'bull';
import { TelegramSendMessageInterface } from './interfaces/telegram-send-message.interface';
import { messages } from '../../messages';

@Processor('telegram')
export class TelegramConsumer {
  constructor(
    private readonly logger: WinstonLoggerService,
    private readonly tgService: TelegramService,
  ) {}

  @OnQueueActive()
  onActive(job: Job<TelegramSendMessageInterface>) {
    this.logger.log(
      messages.successMessage.telegram.jobInProgress(job.id, job.data.chatId),
      TelegramConsumer.name,
    );
  }

  @OnQueueFailed()
  onFail(job: Job<TelegramSendMessageInterface>, err: Error) {
    this.logger.log(
      messages.errorMessage.telegram.jobFailed(job.id, job.data.chatId, err.message),
      TelegramConsumer.name,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job<TelegramSendMessageInterface>) {
    this.logger.log(
      messages.successMessage.telegram.jobCompleted(job.id, job.data.chatId),
      TelegramConsumer.name,
    );
  }

  @Process()
  async process(job: Job<TelegramSendMessageInterface>) {
    await this.tgService.sendToChatId(job.data.chatId, job.data.message);
  }
}
