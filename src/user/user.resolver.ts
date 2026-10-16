/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserType } from './user.type';
import {
  RegistrationInput,
  GetUsersInput,
  AddReviewInput,
  GetUserReviewInput,
} from './user.input';
import { UserService } from './user.service';
import { GqlAuthGuard } from '../shared/guards/gql-auth.guard';
import { AdminGuard, AuthGuard } from '../shared/guards/user.guard';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { GetAllUsersType, GetAllUserReviewsType } from './user.type';

@Resolver(() => UserType)
export default class UserResolver {
  constructor(private readonly userService: UserService) {}

  //create the user
  @Mutation(() => UserType)
  async createUser(
    @Args('input', { type: () => RegistrationInput }) input: RegistrationInput,
  ): Promise<UserType> {
    return this.userService.createUser(input);
  }

  //get the current user from session
  @Query(() => UserType)
  @UseGuards(GqlAuthGuard)
  currentUser(@CurrentUser() user: any) {
    return this.userService.findOne(user.userId);
  }

  @Query(() => UserType)
  @UseGuards(AdminGuard)
  async getUser(
    @Args('id', { type: () => String }) id: string,
  ): Promise<UserType> {
    return this.userService.findOne(id);
  }

  //get all the users data
  @Query(() => GetAllUsersType)
  @UseGuards(AdminGuard)
  async getAllUsers(
    @Args('data') data: GetUsersInput,
  ): Promise<GetAllUsersType> {
    return await this.userService.getAllUsers(data);
  }

  @Mutation(() => UserType)
  async addUserReview(
    @Args('input', { type: () => AddReviewInput }) input: AddReviewInput,
  ): Promise<UserType> {
    return this.userService.addUserReview(input);
  }

  @Query(() => GetAllUserReviewsType)
  @UseGuards(AuthGuard)
  async getAllUserReviews(
    @Args('data') data: GetUserReviewInput,
  ): Promise<GetAllUserReviewsType> {
    return await this.userService.getAllUserReviews(data);
  }

  //add user youtube table
  @Mutation(() => UserType)
  async addUserYoutube(
    @Args('input', { type: () => AddReviewInput }) input: AddReviewInput,
  ): Promise<UserType> {
    return this.userService.addUserReview(input);
  }
}
