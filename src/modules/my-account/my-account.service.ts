import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import { PaymentForm } from '../payment-form/payment-form.entity';

@Injectable()
export class MyAccountService {
  constructor(
    @InjectRepository(Users) private readonly authRepository: Repository<Users>,
    @InjectRepository(PaymentForm)
    private paymentRepository: Repository<PaymentForm>,
  ) {}
  async getOrders(email: string) {
    try {
      const [orders, count] = await this.paymentRepository.findAndCount({
        where: { email: email },
      });

      const response = orders.map((el) => el.amount);
      return { orders: count, amount: response };
    } catch (error) {
      throw error;
    }
  }

  async getPersonalDetails(email: string) {
    const [user] = await this.authRepository.findAndCount({
      where: { email: email },
      select: ['name', 'surname', 'email', 'phone'],
    });
    return user;
  }

  async changePersonalDetails(user, attributes) {
    try {
      await this.authRepository.update({ email: user.email }, attributes);
      return HttpStatus.OK;
    } catch (err) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getOrdersHistory(email: string) {
    try {
      const [orders] = await this.paymentRepository.findAndCount({
        where: { email: email },
        select: ['id', 'amount'],
      });

      const response = orders.map((el) => ({ id: el.id, amount: el.amount }));
      return response;
    } catch (error) {
      throw error;
    }
  }
}
