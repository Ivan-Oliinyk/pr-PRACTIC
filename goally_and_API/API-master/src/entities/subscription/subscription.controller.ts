import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserFromReq } from 'src/shared/decorators';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { User } from '../users/schema';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @UseGuards(AuthGuard)
  @Get('/count')
  async getUserSubscriptionsCount(@UserFromReq() user: User) {
    const count = await this.subscriptionService.getUserSubscriptionsCount(
      user,
    );
    return count;
  }

  @UseGuards(AuthGuard)
  @Get('/available')
  async getUserAvailableSubscriptions(@UserFromReq() user: User) {
    const subscriptions = await this.subscriptionService.getUserAllNotAppliedSubscription(
      user,
    );
    return subscriptions;
  }

  @Post('hook')
  stripeSubscriptionWebHook(@Body() body) {
    return this.subscriptionService.stripeSubscriptionWebHook(body);
  }

  @Post('recurly/webhook')
  async recurlyWebHook(@Body() body) {
    const response = await this.subscriptionService.recurlyWebHook(body);
    return response;
  }

  @Post('shippo/webhook')
  async shippoWebHook(@Body() body) {
    const response = await this.subscriptionService.shippoWebHook(body);
    return response;
  }
}
