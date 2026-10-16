import { Injectable, NotFoundException } from '@nestjs/common';
import User from './user.entity';
import {
  RegistrationInput,
  GetUsersInput,
  AddReviewInput,
  GetUserReviewInput,
} from './user.input';
import { UserAccessRole } from './user.enum';
import { GetAllUsersType, GetAllUserReviewsType } from './user.type';
import { isValidString } from '../utils/validation';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { UserType } from './user.type';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(id: string): Promise<UserType> {
    const found = await this.userRepository.findOne({
      where: { id },
      relations: ['requests', 'youtube', 'linkedin'],
    });
    if (!found) {
      throw new NotFoundException(`User with id ${id} not found!`);
    }
    return found;
  }

  async buyCredits(id: string): Promise<any> {
    const result = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({
        availableCredits: () => 'COALESCE("availableCredits", 0) + 1000',
      })
      .where('id = :id', { id })
      .execute();

    if (!result.affected) {
      throw new NotFoundException(`User with id ${id} not found!`);
    }

    return this.userRepository.findOne({ where: { id } });
  }

  async createUser(input: RegistrationInput): Promise<UserType> {
    const {
      firstName,
      lastName,
      email,
      avatarLink,
      token,
      authProvider,
    } = input;

    try {
      let queryArgs: any = [{ email }, { token }];
      queryArgs = [{ email }, { token }];

      const user = await User.findOne({ where: queryArgs });

      if (user) {
        return user;
      } else {
        const createdBy = 'DEFAULT_USER';

        let accessRole: UserAccessRole = UserAccessRole.Demo;

        if (email === process.env.DEFAULT_ADMIN_EMAIL) {
          accessRole = UserAccessRole.Admin;
        }

        const newUser = User.create({
          firstName,
          lastName,
          email,
          avatarLink,
          token,
          authProvider,
          accessRole,
          createdBy,
          updatedBy: createdBy,
        });
        return await newUser.save();
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllUsers(data: GetUsersInput): Promise<GetAllUsersType> {
    const { location, searchText, offset, limit, accessRole } = data;

    try {
      let query: any = {};

      if (location) query = { ...query, location };
      if (accessRole) query = { ...query, accessRole };

      if (isValidString(searchText)) {
        query = [{ ...query, firstName: ILike(`%${searchText}%`) }];
      }

      const [users, totalCount] = await this.userRepository.findAndCount({
        where: query,
        // order: { ...defaultOrder },
        skip: offset,
        take: limit,
        relations: ['profile', 'youtube', 'requests'],
      });

      if (!users) {
        throw new NotFoundException(`No user found@!`);
      }

      return { users, totalCount };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllUserReviews(
    data: GetUserReviewInput,
  ): Promise<GetAllUserReviewsType> {
    const { offset, limit } = data;

    try {
      const [users, totalCount] = await this.userRepository.findAndCount({
        where: {
          reviewText: Not(IsNull()),
        },
        // order: { ...defaultOrder },
        skip: offset,
        take: limit,
        relations: ['profile', 'youtube'],
      });

      if (!users) {
        throw new NotFoundException(`No user found@!`);
      }

      return { users, totalCount };
    } catch (error) {
      throw new Error(error);
    }
  }

  //-------------------------------------------------------------
  async addUserReview(input: AddReviewInput): Promise<any> {
    const { id, reviewText, rating } = input;

    const found = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ reviewText: reviewText, rating: rating })
      .where('id = :id', { id })
      .execute();

    if (!found) {
      throw new NotFoundException(`User with id ${id} not found!`);
    }
    return await this.userRepository.findOne({
      where: { id },
    });
  }
}
