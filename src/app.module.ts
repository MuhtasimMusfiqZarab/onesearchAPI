//npm modules
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { join } from 'path';

//custom modules
import { YoutubeModule } from './youtube/youtube.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { LinkedinModule } from './linkedin/linkedin.module';
import { GoogleModule } from './google/google.module';
import { ProfileModule } from './profile/profile.module';
import { PaymentModule } from './payment/payment.module';
import { RequestModule } from './request/request.module';
import { ReviewModule } from './review/review.module';

//all the modules
const modules = [
  YoutubeModule,
  AuthModule,
  UsersModule,
  LinkedinModule,
  GoogleModule,
  ProfileModule,
  PaymentModule,
  RequestModule,
  ReviewModule,
];

@Module({
  imports: [
    ...modules,
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.SQLITE_DATABASE || 'onesearch.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
