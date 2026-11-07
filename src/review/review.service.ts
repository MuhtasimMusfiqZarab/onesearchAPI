/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Review from './review.entity';
import {
  AddReviewInput,
  EditReviewInput,
  GetReviewInput,
} from './review.input';
import { ReviewType, ReviewsType } from './review.type';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async addReview(input: AddReviewInput): Promise<ReviewType> {
    try {
      return await this.reviewRepository.save(input);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getReviewById(id: string): Promise<ReviewType | null> {
    const found = await this.reviewRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Review with id ${id} not found!`);
    }
    return found;
  }

  async editReview(input: EditReviewInput): Promise<ReviewType> {
    const { id, reviewText, rating } = input;
    const review = await this.reviewRepository.findOne({ where: { id } });

    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found!`);
    }

    if (reviewText !== undefined) review.reviewText = reviewText;
    if (rating !== undefined) review.rating = rating;

    return this.reviewRepository.save(review);
  }

  async getAllReviews(
    data: GetReviewInput,
    user: { userId?: string },
  ): Promise<ReviewsType | null> {
    const { userId, offset, limit } = data;
    const where = userId ? { userId } : {};

    try {
      const [reviews, totalCount] = await this.reviewRepository.findAndCount({
        where,
        order: { createdAt: 'DESC' },
        skip: offset,
        take: limit,
      });

      const currentUser = user?.userId
        ? await this.reviewRepository.findOne({
            where: { userId: user.userId },
            order: { createdAt: 'DESC' },
          })
        : null;

      return { reviews, totalCount, currentUser };
    } catch (error) {
      throw new Error(error);
    }
  }
}
