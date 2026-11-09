import { Args, Query, Resolver, Int, Mutation } from '@nestjs/graphql';
import { NotFoundException } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import {
  CategoriesType,
  ChannelsType,
  YoutubeBasicType,
  LocationsType,
} from './youtube.type';

import { AuthGuard, AdminGuard } from 'src/shared/guards/user.guard';
import { UseGuards } from '@nestjs/common';

import {
  BulkYoutubeInput,
  GetChannelsInput,
  UserYoutubeInput,
} from './youtube.input';
import { YoutubeType, UserYoutubeType } from './youtube.type';

import { UserService } from 'src/user/user.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

@Resolver(() => YoutubeBasicType)
export class YoutubeResolver {
  constructor(
    private readonly youtubeService: YoutubeService,
    private readonly userService: UserService,
  ) {}

  //add new lead
  @Mutation(() => [YoutubeType])
  @UseGuards(AdminGuard)
  async addYoutubeLeads(
    @Args('input', { type: () => [BulkYoutubeInput], nullable: false })
    input: BulkYoutubeInput[],
  ): Promise<YoutubeType[]> {
    return this.youtubeService.addYoutubeLeads(input);
  }

  //get specific user
  @UseGuards(AuthGuard)
  @Query(() => YoutubeBasicType, { nullable: true })
  async channel(
    @Args('id', { type: () => String }) id: string,
  ): Promise<YoutubeBasicType | null> {
    const channel = await this.youtubeService.getChannelById(id);
    if (!channel) {
      throw new NotFoundException(id);
    }
    return channel;
  }
  //get all channels
  @UseGuards(AuthGuard)
  @Query(() => ChannelsType, { nullable: true })
  async getAllChannels(
    @Args('data') data: GetChannelsInput,
    @CurrentUser() user: { userId: string },
  ): Promise<ChannelsType | null> {
    return await this.youtubeService.getAllChannels(data, user.userId);
  }

  @UseGuards(AuthGuard)
  @Query(() => CategoriesType, { nullable: true })
  async getAllCategories(): Promise<CategoriesType | null> {
    return await this.youtubeService.getChannelCategories();
  }

  @UseGuards(AuthGuard)
  @Query(() => LocationsType, { nullable: true })
  async getChannelCountries(): Promise<LocationsType | null> {
    return await this.youtubeService.getChannelCountries();
  }

  //unlock youtube
  @Mutation(() => UserYoutubeType)
  @UseGuards(AuthGuard)
  async unlockYoutubeLead(
    @Args('input', { type: () => UserYoutubeInput, nullable: false })
    input: UserYoutubeInput,
    @CurrentUser() user: { userId: string },
  ): Promise<any> {
    const { youtubeId } = input;
    await this.youtubeService.findOne(youtubeId);
    await this.userService.unlockYoutubeLead(user.userId, youtubeId);

    return { userId: user.userId, youtubeId };
  }
}
