import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TellUsForm } from './tell-us-form.entity';
import { TellUsFormController } from './tell-us-form.controller';
import { TellUsFormService } from './tell-us-form.service';
import { MailerModule } from 'src/common/modules/mailer/mailer.module';

@Module({
  imports: [TypeOrmModule.forFeature([TellUsForm]), MailerModule],
  controllers: [TellUsFormController],
  providers: [TellUsFormService],
})
export class TellUsFormModule {}
