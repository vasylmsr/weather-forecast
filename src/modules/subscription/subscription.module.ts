import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { MailerModule } from '@nestjs-modules/mailer';

import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { WeatherService } from 'src/modules/weather/weather.service';
import { SubscriptionEntity } from 'src/db/entities/subscription.entity';
import { WeatherModule } from 'src/modules/weather/weather.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionEntity]),
    HttpModule,
    MailerModule,
    WeatherModule,
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, WeatherService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
