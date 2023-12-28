import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Telegraf } from 'telegraf';

import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { TelegramSendMessageInterface } from './interfaces/telegram-send-message.interface';
import { TELEGRAM_CONFIG_KEY, TelegramConfigType } from '../../config/telegram.config';
import { messages } from '../../messages';
import { SetTelegramChatIdInterface } from '../mailer/interfaces/set-telegram-chat-id.interface';
import { WinstonLoggerService } from '../logger/winston-logger.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  constructor(
    @Inject(TELEGRAM_CONFIG_KEY) private readonly tgConfig: TelegramConfigType,
    @InjectQueue('telegram') private readonly tgQueue: Queue,
    private readonly logger: WinstonLoggerService,
  ) {
    if (this.tgConfig.token === '') return;
    this.bot = new Telegraf(this.tgConfig.token);
  }
  public bot: Telegraf;

  /**
   * Установить chatId пользователю с токеном
   * @param chatId
   * @param token
   * @param user
   * @param callback
   * @private
   */
  private async setChatIdToUser(
    chatId: number,
    token: string,
    user: string,
    callback: SetTelegramChatIdInterface,
  ): Promise<boolean> {
    try {
      await callback(token, chatId, user);
      return true;
    } catch (err) {
      this.logger.error(err.message, TelegramService.name);
      return false;
    }
  }

  async onModuleInit() {
    this.logger.log(messages.successMessage.telegram.botInitStart, TelegramService.name);

    if (!this.bot) {
      this.logger.error(messages.errorMessage.telegram.noBotTokenProvided, TelegramService.name);
      return;
    }

    this.bot.start(async (ctx) => {
      /** Убрать из сообщения "/start" и последующий пробел, если он есть */
      const request = ctx.message.text.replace(/\/start\s?/, '');

      ctx.reply(request);
    });

    await this.bot.launch();
    this.logger.log(messages.successMessage.telegram.botInitSuccess, TelegramService.name);
  }

  /**
   * Добавить в очередь отправку сообщения в телеграм
   * @param message
   */
  async addMessageToQueue(message: TelegramSendMessageInterface) {
    /**
     * Если бот не инициализирован - ничего не делать
     */
    if (!this.bot) return;
    const { id, data } = await this.tgQueue.add(message);
    this.logger.log(messages.successMessage.telegram.jobAdd(id, data.chatId), TelegramService.name);
  }

  /**
   * Отправить сообщение message в чат chatId
   * @param chatId
   * @param message
   */
  async sendToChatId(chatId: number, message: string) {
    /**
     * Если бот не инициализирован - ничего не делать
     */
    if (!this.bot) return;
    return this.bot.telegram.sendMessage(chatId, message);
  }
}
