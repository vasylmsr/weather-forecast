import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { SubscriptionEntity } from 'src/db/entities/subscription.entity';
import { WeatherModule } from 'src/modules/weather/weather.module';
import { WeatherMailingScheduleService } from './weather-mailing-schedule.service';
import { SubscriptionModule } from 'src/modules/subscription/subscription.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionEntity]),
    MailerModule,
    WeatherModule,
    SubscriptionModule,
  ],
  controllers: [],
  providers: [WeatherMailingScheduleService],
  exports: [WeatherMailingScheduleService],
})
export class WeatherMailingScheduleModule {}
