import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import Payment from './payment.entity';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../user/user.module';

@Module({
  imports: [AuthModule, UsersModule, TypeOrmModule.forFeature([Payment])],
  providers: [PaymentResolver, PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
