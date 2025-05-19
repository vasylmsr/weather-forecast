import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import {
  SubscriptionEntity,
  SubscriptionFrequency,
} from 'src/db/entities/subscription.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeatherService } from 'src/modules/weather/weather.service';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { SubscribeDto } from './dto/subscribe.dto';
import { getSubscriptionConfirmationUrl } from 'src/utils/public-links';
import { capitalizeFirstLetter } from 'src/utils/capitalizeFirstLetter';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private subscriptionRepository: Repository<SubscriptionEntity>,
    private weatherService: WeatherService,
    private mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  private async sendConfirmationSubscriptionMail(
    sendTo: string,
    city: string,
    confirmationLink: string,
  ) {
    const message = `
      <p style="font-size:18px"><b>Hi,</b></p>
      <p>Thank you for your interest in our service.</p>
      <p>  
        <span>You requested weather forecast subscription for <b>${city}</b>.<span>
        </br>
        <span>Confirm your subscription now to stay updated with the latest weather forecasts!!</span>
      </p>
    `;

    return this.mailerService.sendMail({
      to: sendTo,
      subject: `✅ Confirm subscription`,
      template: 'confirm-subscription',
      context: {
        body: message,
        confirmationLink,
      },
    });
  }

  private generateConfirmationUrl = (subscriptionDetails: SubscribeDto) => {
    const token = this.jwtService.sign(subscriptionDetails, {
      expiresIn: '12h',
    });

    return getSubscriptionConfirmationUrl(token);
  };

  async getSubscriptionsGroupedByCityWithFrequency(
    frequency: SubscriptionFrequency,
  ) {
    const subscriptions = await this.subscriptionRepository.find({
      where: { frequency },
    });
    return Object.groupBy(subscriptions, ({ city }) => city);
  }

  async createSubscription(subscriptionDetails: SubscribeDto) {
    const existingSubscription = await this.subscriptionRepository.findOne({
      where: { email: subscriptionDetails.email },
    });
    if (existingSubscription) {
      throw new ConflictException('Email already subscribed');
    }
    const city = capitalizeFirstLetter(subscriptionDetails.city.toLowerCase());
    // If execution is successful - city was found
    await this.weatherService.getWeather(city);

    const verificationUrl = this.generateConfirmationUrl({
      ...subscriptionDetails,
      city,
    });

    return this.sendConfirmationSubscriptionMail(
      subscriptionDetails.email,
      city,
      verificationUrl,
    );
  }

  async confirmSubscription(token: string) {
    try {
      const tokenPayload =
        await this.jwtService.verifyAsync<SubscribeDto>(token);

      const subscription = this.subscriptionRepository.create({
        email: tokenPayload.email,
        city: tokenPayload.city,
        frequency: tokenPayload.frequency,
      });
      await this.subscriptionRepository.save(subscription);

      return subscription;
    } catch {
      throw new BadRequestException('Invalid token');
    }
  }

  async cancelSubscription(token: string) {
    try {
      const tokenDetails = await this.jwtService.verifyAsync<{ email: string }>(
        token,
      );
      return this.subscriptionRepository.delete({ email: tokenDetails.email });
    } catch {
      throw new BadRequestException('Invalid token');
    }
  }
}
