import {
  BadRequestException,
  Controller,
  Post,
  Get,
  UsePipes,
  ValidationPipe,
  Body,
  Param,
  HttpCode,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscribeDto } from './dto/subscribe.dto';

@Controller()
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('/subscribe')
  @HttpCode(200)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: () => {
        throw new BadRequestException('Invalid input');
      },
    }),
  )
  async subscribe(@Body() subscribeDto: SubscribeDto) {
    await this.subscriptionService.createSubscription(subscribeDto);

    return { message: 'Subscription successful. Confirmation email sent.' };
  }

  @Get('/confirm/:token')
  async confirmSubscription(@Param('token') token: string) {
    await this.subscriptionService.confirmSubscription(token);

    return { message: 'Subscription confirmed successfully' };
  }

  @Get('/unsubscribe/:token')
  @HttpCode(200)
  async cancelSubscription(@Param('token') token: string) {
    await this.subscriptionService.cancelSubscription(token);

    return { message: 'Unsubscribed successfully' };
  }
}
