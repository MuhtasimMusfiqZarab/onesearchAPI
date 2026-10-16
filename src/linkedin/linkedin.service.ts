import { Injectable, NotFoundException } from '@nestjs/common';
import Linkedin from './linkedin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetLinkedinProfileInput } from './linkedin.input';
import {
  LinkedinBasicType,
  LinkedinCompaniesType,
  LinkedinLocationsType,
  LinkedinTitleType,
} from './linkedin.type';

import { isValidString } from '../utils/validation';
import { ILike, Repository } from 'typeorm';
import { defaultOrder } from '../utils/query';

@Injectable()
export class LinkedinService {
  constructor(
    @InjectRepository(Linkedin)
    private linkedinRepository: Repository<Linkedin>,
  ) {}

  async findOne(id: string): Promise<LinkedinBasicType> {
    const found = await this.linkedinRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    if (!found) {
      throw new NotFoundException(`User with id ${id} not found!`);
    }
    return found;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async addLinkedinLeads(input: any): Promise<any> {
    try {
      return await this.linkedinRepository.save(input);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllProfiles(data: GetLinkedinProfileInput): Promise<any> {
    const { title, location, searchText, offset, limit } = data;

    try {
      let query: any = {};

      if (title) query = { ...query, title };
      if (location) query = { ...query, location };

      if (isValidString(searchText)) {
        query = [{ ...query, fullName: ILike(`%${searchText}%`) }];
      }

      const [profiles, totalCount] = await this.linkedinRepository.findAndCount(
        {
          where: query,
          order: { ...defaultOrder },
          skip: offset,
          take: limit,
        },
      );

      if (!profiles) {
        throw new NotFoundException(`No Profile was found@!`);
      }

      return { profiles, totalCount };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getLinkedinProfileById(id: string): Promise<LinkedinBasicType | null> {
    const found = await this.linkedinRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Linkedin Profile with id ${id} not found!`);
    }
    return found;
  }

  //get countries
  async getLinkedinLocations(): Promise<LinkedinLocationsType | null> {
    const locations: any = await this.linkedinRepository
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

  async getLinkedinCompanies(): Promise<LinkedinCompaniesType | null> {
    const companies = await this.linkedinRepository
      .createQueryBuilder()
      .select('company')
      .distinct(true)
      .getRawMany();

    const jobTitles = companies.map(category => category.company);

    return {
      companies: jobTitles.filter(x => x !== null),
      totalCount: jobTitles.length,
    };
  }

  async getLinkedinTitles(): Promise<LinkedinTitleType | null> {
    const titles = await this.linkedinRepository
      .createQueryBuilder()
      .select('title')
      .distinct(true)
      .getRawMany();

    const jobTitles = titles.map(category => category.title);

    return {
      titles: jobTitles.filter(x => x !== null),
      totalCount: jobTitles.length,
    };
  }
}
