import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import {
  AddReviewInput,
  EditReviewInput,
  GetReviewInput,
} from './review.input';
import { ReviewType, ReviewsType } from './review.type';
import { AuthGuard } from '../shared/guards/user.guard';
import { GqlAuthGuard } from '../shared/guards/gql-auth.guard';
import { CurrentUser } from '../shared/decorators/current-user.decorator';

@Resolver()
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Mutation(() => ReviewType)
  @UseGuards(AuthGuard)
  async addReview(
    @Args('input', { type: () => AddReviewInput }) input: AddReviewInput,
  ): Promise<ReviewType> {
    return this.reviewService.addReview(input);
  }

  @Mutation(() => ReviewType)
  @UseGuards(AuthGuard)
  async editReview(
    @Args('input', { type: () => EditReviewInput }) input: EditReviewInput,
  ): Promise<ReviewType> {
    return this.reviewService.editReview(input);
  }

  @Query(() => ReviewType, { nullable: true })
  @UseGuards(AuthGuard)
  async getReview(
    @Args('id', { type: () => String }) id: string,
  ): Promise<ReviewType | null> {
    return this.reviewService.getReviewById(id);
  }

  @Query(() => ReviewsType, { nullable: true })
  async getAllReviews(
    @CurrentUser() user: { userId?: string },
    @Args('data') data: GetReviewInput,
  ): Promise<ReviewsType | null> {
    return this.reviewService.getAllReviews(data, user);
  }
}
