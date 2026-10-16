import { Entity, Column, ManyToMany, Relation } from 'typeorm';
import { ExtendedBaseEntity } from '../config/_base.entity';

import User from '../user/user.entity';

@Entity()
export default class Linkedin extends ExtendedBaseEntity {
  @Column({ type: 'varchar', nullable: true })
  firstName: string;

  @Column({ type: 'varchar', nullable: true })
  lastName: string;

  @Column({ type: 'varchar', nullable: true })
  fullName: string;

  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  company: string;

  @Column({ type: 'varchar', nullable: true })
  location: string;

  @Column({ type: 'varchar' })
  url: string;

  @ManyToMany(
    () => User,
    user => user.linkedin,
  )
  users: Relation<User[]>;
}
