import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LinkedinService } from './linkedin.service';
import { LinkedinResolver } from './linkedin.resolver';
import Linkedin from './linkedin.entity';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../user/user.module';

@Module({
  imports: [AuthModule, UsersModule, TypeOrmModule.forFeature([Linkedin])],
  providers: [LinkedinService, LinkedinResolver],
})
export class LinkedinModule {}
