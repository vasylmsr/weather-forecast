import { Entity, Column, BeforeInsert } from 'typeorm';
import { BaseEntity } from './base.entity';
import { capitalizeFirstLetter } from 'src/utils/capitalizeFirstLetter';

export enum SubscriptionFrequency {
  HOURLY = 'hourly',
  DAILY = 'daily',
}

@Entity('subscriptions')
export class SubscriptionEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  city: string;

  @Column({ type: 'enum', enum: SubscriptionFrequency })
  frequency: SubscriptionFrequency;

  @BeforeInsert()
  setCityToLowerCase() {
    if (this.city) {
      this.city = capitalizeFirstLetter(this.city.toLowerCase());
    }
  }
}
