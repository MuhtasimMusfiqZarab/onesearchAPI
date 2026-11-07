import { Entity, Column, ManyToOne, Relation } from 'typeorm';
import { ExtendedBaseEntity } from '../config/_base.entity';

import { RequestStatusEnum } from './request.enum';

import User from 'src/user/user.entity';

@Entity()
export default class Request extends ExtendedBaseEntity {
  @Column({ type: 'varchar', nullable: true })
  platform: string;

  @Column({ type: 'varchar', nullable: true })
  location: string;

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({ type: 'varchar', nullable: true })
  datasize: string;

  @Column({
    type: 'enum',
    enum: RequestStatusEnum,
    default: RequestStatusEnum.Requested,
  })
  status: RequestStatusEnum;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(
    () => User,
    user => user.requests,
  )
  user: Relation<User>;

  @Column({ type: 'varchar', nullable: true })
  userId: string;
}
