import { Entity, Column, ManyToMany, Relation } from 'typeorm';
import { ExtendedBaseEntity } from '../config/_base.entity';

import User from '../user/user.entity';

@Entity()
export default class Youtube extends ExtendedBaseEntity {
  @Column({ type: 'varchar', nullable: true })
  socialblade_category: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  channel_url: string;

  @Column({ type: 'json', nullable: true })
  bio_email: string[];

  @Column({ type: 'bigint', nullable: true })
  subscribers: number;

  @Column({ type: 'varchar', nullable: true })
  location: string;

  @Column({ type: 'varchar', nullable: true })
  channel_name: string;

  @Column({ type: 'timestamp', nullable: true })
  timestamp: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  instagram: string;

  @Column({ type: 'varchar', nullable: true })
  twitter: string;

  @Column({ type: 'varchar', nullable: true })
  facebook: string;

  @Column({ type: 'varchar', nullable: true })
  tiktok: string;

  @Column({ type: 'varchar', nullable: true })
  pinterest: string;

  @Column({ type: 'varchar', nullable: true })
  others: string;

  @Column({ type: 'varchar', nullable: true })
  joined: string;

  @Column({ type: 'varchar', nullable: true })
  views: string;

  @ManyToMany(
    () => User,
    user => user.youtube,
  )
  users: Relation<User[]>;
}
