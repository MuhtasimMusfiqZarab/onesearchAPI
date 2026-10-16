import { Injectable, NotFoundException } from '@nestjs/common';
import Google from './google.entity';
import { InjectRepository } from '@nestjs/typeorm';

import { isValidString } from '../utils/validation';
import { ILike, Repository } from 'typeorm';
import { defaultOrder } from '../utils/query';

import {
  GoogleBasicType,
  GoogleProfilesType,
  GoogleCategoriesType,
  GoogleCountriesType,
} from './google.type';

import { BulkGoogleInput, GetGoogleInput } from './google.input';

@Injectable()
export class GoogleService {
  constructor(
    @InjectRepository(Google)
    private googleRepository: Repository<Google>,
  ) {}

  //add google leads
  async addGoogleLeads(input: BulkGoogleInput[]): Promise<GoogleBasicType[]> {
    try {
      return await this.googleRepository.save(input);
    } catch (error) {
      throw new Error(error);
    }
  }

  //get all google profiles
  async getAllGoogleProfiles(
    data: GetGoogleInput,
  ): Promise<GoogleProfilesType> {
    const { category, country, searchText, offset, limit } = data;

    try {
      let query: any = {};

      if (category) query = { ...query, category };
      if (country) query = { ...query, country };

      if (isValidString(searchText)) {
        query = [{ ...query, company: ILike(`%${searchText}%`) }];
      }

      const [profiles, totalCount] = await this.googleRepository.findAndCount({
        where: query,
        // order: { ...defaultOrder },
        skip: offset,
        take: limit,
      });

      if (!profiles) {
        throw new NotFoundException(`No Profile was found@!`);
      }

      return { profiles, totalCount };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getGoogleProfileById(id: string): Promise<GoogleBasicType | null> {
    const found = await this.googleRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Google Profile with id ${id} not found!`);
    }
    return found;
  }

  //get categories
  async getGoogleCategories(): Promise<GoogleCategoriesType | null> {
    const categories: any = await this.googleRepository
      .createQueryBuilder()
      .select('category')
      .distinct(true)
      .getRawMany();

    let categoryNames = [];

    // console.log('This is it', locations.length);

    categoryNames = categories.map(item => {
      if (item.category !== null || item.category !== undefined) {
        return item.category;
      } else {
        return;
      }
    });

    return {
      categories: categoryNames.filter(x => x !== null),
      totalCount: categoryNames.length,
    };
  }

  //get countries
  async getGoogleCountries(): Promise<GoogleCountriesType | null> {
    const countries: any = await this.googleRepository
      .createQueryBuilder()
      .select('country')
      .distinct(true)
      .getRawMany();

    let countryNames = [];

    // console.log('This is it', locations.length);

    countryNames = countries.map(item => {
      if (item.country !== null || item.country !== undefined) {
        return item.country;
      } else {
        return;
      }
    });

    return {
      countries: countryNames.filter(x => x !== null),
      totalCount: countryNames.length,
    };
  }
}
