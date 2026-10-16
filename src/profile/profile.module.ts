import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';
import Profile from './profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  providers: [ProfileResolver, ProfileService],
})
export class ProfileModule {}
