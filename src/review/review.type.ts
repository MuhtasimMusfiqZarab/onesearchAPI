import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ReviewType {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  createdBy: string;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  updatedBy: string;

  @Field()
  userId: string;

  @Field({ nullable: true })
  reviewText: string;

  @Field(() => Float)
  rating: number;
}

@ObjectType()
export class ReviewsType {
  @Field(() => [ReviewType], { nullable: true })
  reviews: ReviewType[];

  @Field(() => Int, { nullable: true })
  totalCount: number;

  @Field(() => ReviewType, { nullable: true })
  currentUser: ReviewType | null;
}
