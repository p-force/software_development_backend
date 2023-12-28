import { Module } from '@nestjs/common';
import { MyAccountService } from './my-account.service';
import { MyAccountController } from './my-account.controller';
import { Users } from '../auth/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentForm } from '../payment-form/payment-form.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, PaymentForm])],
  providers: [MyAccountService],
  controllers: [MyAccountController],
})
export class MyAccountModule {}
