import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { APP_CONFIG_KEY, AppConfigType } from '../../config/app.config';
import { SMS_CONFIG_KEY, SMSConfigType } from '../../config/sms.config';
import { HttpModule } from '@nestjs/axios';
import { SMSService } from './sms.service';
import { SMSConsumer } from './sms.consumer';

@Module({
  imports: [
    HttpModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [APP_CONFIG_KEY, SMS_CONFIG_KEY],
      useFactory: (appConfig: AppConfigType, smsConfig: SMSConfigType) => ({
        redis: {
          host: appConfig.redisHost,
          port: appConfig.redisPort,
        },
        defaultJobOptions: {
          attempts: smsConfig.jobAttempts,
          backoff: smsConfig.jobBackoff,
          removeOnComplete: true,
          removeOnFail: smsConfig.jobFailAge > 0 ? { age: smsConfig.jobFailAge } : false,
        },
      }),
    }),
    BullModule.registerQueue({ name: 'sms' }),
  ],
  providers: [SMSService, SMSConsumer],
  exports: [SMSService],
})
export class SMSModule {}
