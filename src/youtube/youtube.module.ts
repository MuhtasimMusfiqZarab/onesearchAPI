import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YoutubeService } from './youtube.service';
import { YoutubeResolver } from './youtube.resolver';
import Youtube from './youtube.entity';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../user/user.module';

@Module({
  imports: [AuthModule, UsersModule, TypeOrmModule.forFeature([Youtube])],
  providers: [YoutubeService, YoutubeResolver],
})
export class YoutubeModule {}
