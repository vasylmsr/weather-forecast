import { Cron, CronExpression } from '@nestjs/schedule';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  SubscriptionEntity,
  SubscriptionFrequency,
} from 'src/db/entities/subscription.entity';
import { SubscriptionService } from 'src/modules/subscription/subscription.service';
import { WeatherService } from 'src/modules/weather/weather.service';
import { getUnsubscriptionUrl } from 'src/utils/public-links';

@Injectable()
export class WeatherMailingScheduleService {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly subscriptionService: SubscriptionService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  private async sendMailWeatherUpdate(
    subscription: { email: string; city: string },
    weather: { temp_c: number; humidity: number; description: string },
    unsubscribeUrl: string,
  ) {
    const message = `
      <p>Current weather in <b>${subscription.city}</b>:</p>
      Temperature: ${weather.temp_c}°C</br>
      Humidity: ${weather.humidity}%</br>
      Description: ${weather.description} </br>
    `;

    const mailOptions = {
      to: subscription.email,
      subject: `Weather Forecast updates for ${subscription.city}`,
      template: 'weather-updates',
      context: {
        body: message,
        unsubscribeLink: unsubscribeUrl,
      },
    };

    return this.mailerService.sendMail(mailOptions);
  }

  async sendForecastToCitySubscribers(
    city: string,
    subscriptions: SubscriptionEntity[],
  ) {
    const cityWeatherResult = await this.weatherService.getWeather(city);

    const promises = subscriptions.map((subscription) => {
      const jwt = this.jwtService.sign(
        { email: subscription.email },
        { expiresIn: '12h' },
      );
      const unsubscribeUrl = getUnsubscriptionUrl(jwt);
      return this.sendMailWeatherUpdate(
        subscription,
        {
          temp_c: cityWeatherResult.current.temp_c,
          humidity: cityWeatherResult.current.humidity,
          description: cityWeatherResult.current.condition.text,
        },
        unsubscribeUrl,
      );
    });

    return Promise.allSettled(promises);
  }

  async handleUpdates(frequency: SubscriptionFrequency) {
    const citiesSubscriptions =
      await this.subscriptionService.getSubscriptionsGroupedByCityWithFrequency(
        frequency,
      );

    const tasks = Object.entries(citiesSubscriptions).map(
      ([city, subscriptions = []]) =>
        this.sendForecastToCitySubscribers(city, subscriptions),
    );

    return Promise.allSettled(tasks);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleHourlyUpdates() {
    return this.handleUpdates(SubscriptionFrequency.HOURLY);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyUpdates() {
    return this.handleUpdates(SubscriptionFrequency.DAILY);
  }
}
