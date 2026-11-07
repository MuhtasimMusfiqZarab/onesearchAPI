import { Entity, Column, JoinColumn, OneToOne, Relation } from 'typeorm';
import { ExtendedBaseEntity } from '../config/_base.entity';
import User from '../user/user.entity';

@Entity()
export default class Review extends ExtendedBaseEntity {
  @Column({ type: 'text', nullable: true })
  reviewText: string;

  @Column({ type: 'float', nullable: true })
  rating: number;

  @OneToOne(
    () => User,
    user => user.review,
  )
  @JoinColumn()
  user: Relation<User>;

  @Column({ type: 'varchar' })
  userId: string;
}
