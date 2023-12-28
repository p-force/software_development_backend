import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetInTouchForm } from './get-in-touch-form.entity';
import { GetInTouchFormController } from './get-in-touch-form.controller';
import { GetInTouchFormService } from './get-in-touch-form.service';
import { MailerModule } from 'src/common/modules/mailer/mailer.module';

@Module({
  imports: [TypeOrmModule.forFeature([GetInTouchForm]), MailerModule],
  controllers: [GetInTouchFormController],
  providers: [GetInTouchFormService],
})
export class GetInTouchFormModule {}
