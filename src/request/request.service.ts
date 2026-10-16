/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Request from './request.entity';
import { ILike, Repository } from 'typeorm';

import { GetRequestInput } from './request.input';
import {
  RequestType,
  RequestsType,
  RequestCategoriesType,
  RequestCountriesType,
  RequestPlatformsType,
  RequestStatusType,
} from './request.type';

import { isValidString } from '../utils/validation';
import { defaultOrder } from '../utils/query';

import { UserService } from 'src/user/user.service';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
    private userService: UserService,
  ) {}

  async addRequest(input: any): Promise<RequestType> {
    try {
      const saved = await this.requestRepository.save(input);
      return saved;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getRequestById(id: string): Promise<RequestType | null> {
    const found = await this.requestRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`youtube channel with id ${id} not found!`);
    }
    return found;
  }

  /**
   * @Query getAllrequests
   * @param  data GetrequestsInput
   * @return YoutubeType
   */

  async getAllRequests(data: GetRequestInput): Promise<RequestsType | null> {
    const {
      category,
      location,
      platform,
      status,
      searchText,
      offset,
      limit,
    } = data;

    try {
      let query: any = {};

      if (category) query = { ...query, category };
      if (location) query = { ...query, location };
      if (platform) query = { ...query, platform };
      if (status) query = { ...query, status };

      if (isValidString(searchText)) {
        query = [{ ...query, country: ILike(`%${searchText}%`) }];
      }

      const [requests, totalCount] = await this.requestRepository.findAndCount({
        where: query,
        order: { ...defaultOrder },
        skip: offset,
        take: limit,
      });

      if (!requests) {
        throw new NotFoundException(`No Channel found@!`);
      }

      return { requests, totalCount };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllRequestsOfUser(
    data: GetRequestInput,
    user: any,
  ): Promise<RequestsType | null> {
    const {
      category,
      location,
      platform,
      status,
      searchText,
      offset,
      limit,
    } = data;

    try {
      let query: any = {};

      const id = user?.userId;

      if (category) query = { ...query, category };
      if (location) query = { ...query, location };
      if (platform) query = { ...query, platform };
      if (status) query = { ...query, status };
      if (id) query = { ...query, userId: id };
      if (isValidString(searchText)) {
        query = [{ ...query, country: ILike(`%${searchText}%`) }];
      }

      const [requests, totalCount] = await this.requestRepository.findAndCount({
        where: query,
        order: { ...defaultOrder },
        skip: offset,
        take: limit,
      });

      if (!requests) {
        throw new NotFoundException(`No Channel found@!`);
      }

      return { requests, totalCount };
    } catch (error) {
      throw new Error(error);
    }
  }

  // //get all categories
  async getRequestCategories(): Promise<RequestCategoriesType | null> {
    const categories = await this.requestRepository
      .createQueryBuilder()
      .select('category')
      .distinct(true)
      .getRawMany();

    const categoryNames = categories.map(category => category.category);

    return {
      categories: categoryNames.filter(x => x !== null),
      totalCount: categoryNames.length,
    };
  }

  //get all countries
  async getRequestCountries(): Promise<RequestCountriesType | null> {
    const locations: any = await this.requestRepository
      .createQueryBuilder()
      .select('location')
      .distinct(true)
      .getRawMany();

    let locationNames = [];

    locationNames = locations.map(location => {
      if (location.country !== null || location.country !== undefined) {
        return location.country;
      } else {
        return;
      }
    });

    return {
      countries: locationNames.filter(x => x !== null),
      totalCount: locationNames.length,
    };
  }

  //get all countries
  async getRequestPlatforms(): Promise<RequestPlatformsType | null> {
    const locations: any = await this.requestRepository
      .createQueryBuilder()
      .select('platform')
      .distinct(true)
      .getRawMany();

    let locationNames = [];

    // console.log('This is it', locations.length);

    locationNames = locations.map(location => {
      if (location.platform !== null || location.platform !== undefined) {
        return location.platform;
      } else {
        return;
      }
    });

    return {
      platforms: locationNames.filter(x => x !== null),
      totalCount: locationNames.length,
    };
  }
  //get all countries
  async getRequestStatuses(): Promise<RequestStatusType | null> {
    const locations: any = await this.requestRepository
      .createQueryBuilder()
      .select('platform')
      .distinct(true)
      .getRawMany();

    let locationNames = [];

    // console.log('This is it', locations.length);

    locationNames = locations.map(location => {
      if (location.status !== null || location.status !== undefined) {
        return location.status;
      } else {
        return;
      }
    });

    return {
      statuses: locationNames.filter(x => x !== null),
      totalCount: locationNames.length,
    };
  }
}
