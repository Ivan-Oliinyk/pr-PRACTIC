import { Controller, Get, Param } from '@nestjs/common';
import { RecurlyService } from './recurly.service';
@Controller('recurly')
export class RecurlyController {
  constructor(private readonly recurly: RecurlyService) {}

  @Get('/plans')
  async getPlans() {
    const plans = await this.recurly.getPlans();
    return plans;
  }
  @Get('/items')
  async getItems() {
    const items = await this.recurly.getItems();
    return items;
  }
  @Get('/invoice/:invoiceId')
  async getInvoiceDetails(@Param('invoiceId') invoiceId) {
    const plans = await this.recurly.getInvoiceDetails(invoiceId);
    return plans;
  }

  @Get('/subscription/:subscriptionId')
  async getSubscription(@Param('subscriptionId') subscriptionId) {
    const subscriptionFromRecurly = await this.recurly.getSubscriptionById(
      subscriptionId,
    );
    console.log('subscriptionFromRecurly', subscriptionFromRecurly);
    return subscriptionFromRecurly;
  }
}
