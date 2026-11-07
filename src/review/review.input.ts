import { Field, InputType, Float } from '@nestjs/graphql';
import { IsNotEmpty, Max } from 'class-validator';

@InputType('AddReviewRecordInput')
export class AddReviewInput {
  @Field()
  userId: string;

  @Field({ nullable: true })
  reviewText: string;

  @Field(() => Float)
  rating: number;
}

@InputType()
export class GetReviewInput {
  @Field({ nullable: true })
  userId: string;

  @IsNotEmpty()
  @Field()
  offset: number;

  @IsNotEmpty()
  @Max(30)
  @Field()
  limit: number;
}
