import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { APP_CONFIG_KEY, AppConfigType } from '../../config/app.config';
import { TELEGRAM_CONFIG_KEY, TelegramConfigType } from '../../config/telegram.config';
import { TelegramConsumer } from './telegram.consumer';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [APP_CONFIG_KEY, TELEGRAM_CONFIG_KEY],
      useFactory: (appConfig: AppConfigType, tgConfig: TelegramConfigType) => ({
        redis: {
          host: appConfig.redisHost,
          port: appConfig.redisPort,
        },
        defaultJobOptions: {
          attempts: tgConfig.jobAttempts,
          backoff: tgConfig.jobBackoff,
          removeOnComplete: true,
          removeOnFail: tgConfig.jobFailAge > 0 ? { age: tgConfig.jobFailAge } : false,
        },
      }),
    }),
    BullModule.registerQueue({ name: 'telegram' }),
  ],
  providers: [TelegramService, TelegramConsumer],
  exports: [TelegramService],
})
export class TelegramModule {}
