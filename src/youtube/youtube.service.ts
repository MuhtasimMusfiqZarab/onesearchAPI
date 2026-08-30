/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { YoutubeRepository } from './youtube.repository';
import { ILike } from 'typeorm';

import { GetChannelsInput } from './youtube.input';
import {
  CategoriesType,
  LocationsType,
  ChannelsType,
  YoutubeBasicType,
} from './youtube.type';

import { isValidString } from '../utils/validation';
import { defaultOrder } from '../utils/query';
import {
  YOUTUBE_SEED_CATEGORIES,
  YOUTUBE_SEED_CHANNEL_NAMES,
  YOUTUBE_SEED_LOCATIONS,
} from './seed/youtube.seed';

@Injectable()
export class YoutubeService {
  constructor(
    @InjectRepository(YoutubeRepository)
    private youtubeRepository: YoutubeRepository,
  ) {}

  async findOne(id: string): Promise<YoutubeBasicType> {
    const found = await this.youtubeRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    if (!found) {
      throw new NotFoundException(`User with id ${id} not found!`);
    }
    return found;
  }

  async addYoutubeLeads(input: any): Promise<any> {
    try {
      return await this.youtubeRepository.save(input);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getChannelById(id: string): Promise<YoutubeBasicType | null> {
    const found = await this.youtubeRepository.findOne({ id });
    if (!found) {
      throw new NotFoundException(`youtube channel with id ${id} not found!`);
    }
    return found;
  }

  /**
   * @Query getAllChannels
   * @param  data GetChannelsInput
   * @return YoutubeType
   */

  private buildSeedChannels(): any[] {
    return Array.from({ length: 1000 }, (_, index) => {
      const category =
        YOUTUBE_SEED_CATEGORIES[index % YOUTUBE_SEED_CATEGORIES.length];
      const location =
        YOUTUBE_SEED_LOCATIONS[index % YOUTUBE_SEED_LOCATIONS.length];
      const subscribers = (index + 1) * 12000 + (index % 7) * 5000;
      const baseName =
        YOUTUBE_SEED_CHANNEL_NAMES[index % YOUTUBE_SEED_CHANNEL_NAMES.length];
      const displayName = `${baseName} ${Math.floor(
        index / YOUTUBE_SEED_CHANNEL_NAMES.length,
      ) + 1}`.trim();
      const socialHandle = displayName.toLowerCase().replace(/\s+/g, '');

      return {
        socialblade_category: category,
        channel_url: `https://www.youtube.com/channel/${index + 1}`,
        bio_email: [`creator${index + 1}@seed.example`],
        subscribers,
        location,
        channel_name: displayName,
        timestamp: new Date(Date.now() - index * 86400000),
        description: `Seeded demo channel for ${displayName} created automatically when the database was empty.`,
        instagram: `@${socialHandle}`,
        twitter: `@${socialHandle}`,
        facebook: socialHandle,
        tiktok: `@${socialHandle}`,
        pinterest: socialHandle,
        others: 'seed-generated',
        joined: '2021',
        views: `${(subscribers * 18).toLocaleString()}`,
      };
    });
  }

  async getAllChannels(data: GetChannelsInput): Promise<ChannelsType | null> {
    const {
      socialblade_category,
      location,
      searchText,
      subscribers,
      offset,
      limit,
    } = data;

    try {
      let query: any = {};

      if (socialblade_category) query = { ...query, socialblade_category };
      if (location) query = { ...query, location };

      if (isValidString(searchText)) {
        query = [{ ...query, channel_name: ILike(`%${searchText}%`) }];
      }

      const [channels, totalCount] = await this.youtubeRepository.findAndCount({
        where: query,
        order: { ...defaultOrder },
        skip: offset,
        take: limit,
      });

      if (totalCount === 0 && channels.length === 0) {
        const seedChannels = this.buildSeedChannels();
        await this.youtubeRepository.save(seedChannels);

        const [
          seededChannels,
          seededTotalCount,
        ] = await this.youtubeRepository.findAndCount({
          where: query,
          order: { ...defaultOrder },
          skip: offset,
          take: limit,
        });

        return { channels: seededChannels, totalCount: seededTotalCount };
      }

      if (!channels) {
        throw new NotFoundException(`No Channel found@!`);
      }

      return { channels, totalCount };
    } catch (error) {
      throw new Error(error);
    }
  }

  //get all categories
  async getChannelCategories(): Promise<CategoriesType | null> {
    const categories = await this.youtubeRepository
      .createQueryBuilder()
      .select('socialblade_category')
      .distinct(true)
      .getRawMany();

    const categoryNames = categories.map(
      category => category.socialblade_category,
    );

    return {
      categories: categoryNames.filter(x => x !== null),
      totalCount: categoryNames.length,
    };
  }

  //get all categories
  async getChannelCountries(): Promise<LocationsType | null> {
    const locations: any = await this.youtubeRepository
      .createQueryBuilder()
      .select('location')
      .distinct(true)
      .getRawMany();

    let locationNames = [];

    // console.log('This is it', locations.length);

    locationNames = locations.map(location => {
      if (location.location !== null || location.location !== undefined) {
        return location.location;
      } else {
        return;
      }
    });

    return {
      locations: locationNames.filter(x => x !== null),
      totalCount: locationNames.length,
    };
  }
}
