import { Entity, Column } from 'typeorm';
import { ExtendedBaseEntity } from '../config/_base.entity';

@Entity()
export default class Google extends ExtendedBaseEntity {
  @Column({ type: 'varchar', nullable: true })
  company: string;

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({ type: 'float', nullable: true })
  rating: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  postcode: string;

  @Column({ type: 'varchar', nullable: true })
  country: string;

  @Column({ type: 'varchar', nullable: true })
  city: string;

  @Column({ type: 'varchar', nullable: true })
  state: string;

  @Column({ type: 'varchar', nullable: true })
  latitude: string;

  @Column({ type: 'varchar', nullable: true })
  longitude: string;

  @Column({ type: 'varchar', nullable: true })
  website: string;

  @Column({ type: 'varchar', nullable: true })
  claim_status: string;

  @Column({ type: 'varchar', nullable: true })
  total_reviews: string;

  @Column({ type: 'json', nullable: true })
  review_data: string;

  @Column({ type: 'varchar', nullable: true })
  gmaps_url: string;

  @Column({ type: 'date' })
  timestamp: Date;
}
