import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentForm } from './payment-form.entity';
import { PaymentFormController } from './payment-form.controller';
import { PaymentFormService } from './payment-form.service';
import { MailerModule } from 'src/common/modules/mailer/mailer.module';
import { Users } from '../auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentForm, Users]), MailerModule],
  controllers: [PaymentFormController],
  providers: [PaymentFormService],
})
export class PaymentFormModule {}
