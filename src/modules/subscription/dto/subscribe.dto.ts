import { IsEmail, IsString, IsEnum } from 'class-validator';
import { SubscriptionFrequency } from 'src/db/entities/subscription.entity';

export class SubscribeDto {
  @IsEmail()
  email: string;

  @IsString()
  city: string;

  @IsEnum(SubscriptionFrequency)
  frequency: SubscriptionFrequency;
}
