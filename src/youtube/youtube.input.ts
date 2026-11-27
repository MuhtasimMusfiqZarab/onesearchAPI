import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, Max } from 'class-validator';

@InputType()
export class BulkYoutubeInput {
  @Field()
  channel_url: string;

  @Field({ nullable: true })
  socialblade_category: string;

  @Field(() => [String], { nullable: true })
  bio_email: string[];

  @Field({ nullable: true })
  subscribers: number;

  @Field({ nullable: true })
  location: string;

  @Field({ nullable: true })
  channel_name: string;

  @Field({ nullable: true })
  timestamp: Date;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  instagram: string;

  @Field({ nullable: true })
  twitter: string;

  @Field({ nullable: true })
  facebook: string;

  @Field({ nullable: true })
  tiktok: string;

  @Field({ nullable: true })
  pinterest: string;

  @Field({ nullable: true })
  others: string;

  @Field({ nullable: true })
  joined: string;

  @Field({ nullable: true })
  views: string;
}

@InputType()
export class GetChannelsInput {
  @Field({ nullable: true })
  socialblade_category: string;

  @Field({ nullable: true })
  subscribers: string;

  @Field({ nullable: true })
  location: string;

  @Field({ nullable: true })
  searchText: string;

  @IsNotEmpty()
  @Field()
  offset: number;

  @IsNotEmpty()
  @Max(10)
  @Field()
  limit: number;
}

@InputType()
export class UserYoutubeInput {
  @Field()
  youtubeId: string;
}
