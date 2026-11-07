import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Review from './review.entity';
import { ReviewResolver } from './review.resolver';
import { ReviewService } from './review.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../user/user.module';

@Module({
  imports: [AuthModule, UsersModule, TypeOrmModule.forFeature([Review])],
  providers: [ReviewResolver, ReviewService],
})
export class ReviewModule {}
