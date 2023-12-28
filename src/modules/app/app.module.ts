import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DbModule } from '../../common/modules/db/db.module';
import { LoggerModule } from '../../common/modules/logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from '../../common/config';
import { AuthModule } from '../auth/auth.module';
import { GetInTouchFormModule } from '../get-in-touch-form/get-in-touch-form.module';
import { ContactFormModule } from '../contact-us-form/contact-form.module';
import { TellUsFormModule } from '../tell-us-about-proj-form/tell-us-form.module';
import { PaymentFormModule } from '../payment-form/payment-form.module';
import { MyAccountModule } from '../my-account/my-account.module';

@Module({
  imports: [
    AuthModule,
    GetInTouchFormModule,
    ContactFormModule,
    TellUsFormModule,
    PaymentFormModule,
    MyAccountModule,
    DbModule,
    LoggerModule,
    ConfigModule.forRoot(configModuleOptions),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
