import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import UserResolver from './user.resolver';
import User from './user.entity';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([User])],
  providers: [UserService, UserResolver],
  //this service can be used by other modules (ex Auth Module)
  exports: [UserService],
})
export class UsersModule {}
