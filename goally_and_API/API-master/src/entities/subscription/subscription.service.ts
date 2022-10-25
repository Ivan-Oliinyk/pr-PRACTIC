import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as BB from 'bluebird';
import { Model, Types } from 'mongoose';
import { UsersService } from 'src/entities/users/users.service';
import { PREFIX } from 'src/shared/const';
import { RECURLY_ITEMS } from 'src/shared/const/recurly-items';
import { RECURLY, RECURLY_PLANS } from 'src/shared/const/recurly-plans';
import { MessangerService } from 'src/shared/messanger/messanger.service';
import { RecurlyService } from 'src/shared/recurly/recurly.service';
import { ShippoService } from 'src/shared/shippo/shippo.service';
import { TinyUrlService } from '../../shared/tiny-url/tiny-url.service';
import { User } from '../users/schema';
import { Subscription } from './schema/subscription';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription.name)
    private SubscriptionModel: Model<Subscription>,
    private http: HttpService,
    private messagingService: MessangerService,
    private recurlyService: RecurlyService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private tinyUrlService: TinyUrlService,
    private shippoService: ShippoService,
  ) {}

  async createGoallySubscription(
    subscriptionToken: string,
    subscriptionUuid: string,
    invoiceNumber: string,
    user: User,
    prices: { priceId: string; itemId: string }[],
    sku: string,
    address?: string,
    color?: string,
    clientId?: Types.ObjectId,
    subscriptionType?: string,
    status?: string,
    currentPeriodStartedAt?: Date,
    currentPeriodEndsAt?: Date,
    collectionMethod?: string,
    couponUsed?: string,
  ) {
    const subscription = new this.SubscriptionModel({
      subscriptionToken,
      subscriptionUuid,
      invoiceNumber,
      sku,
      payer: user._id,
      prices,
      shippingAddress: address,
      color,
      client: clientId || null,
      subscriptionType: subscriptionType || null,
      status: status || null,
      currentPeriodStartedAt: currentPeriodStartedAt || null,
      currentPeriodEndsAt: currentPeriodEndsAt || null,
      collectionMethod: collectionMethod || null,
      couponUsed,
    });
    const savedSubscription = await subscription.save();
    return savedSubscription;
  }
  getUserNotAppliedSubscription(user: User) {
    return this.SubscriptionModel.findOne({ payer: user._id, client: null });
  }
  getUserNotAppliedSubscriptionById(
    user: User,
    subscriptionId: Types.ObjectId,
  ) {
    return this.SubscriptionModel.findOne({
      _id: subscriptionId,
      payer: user._id,
      client: null,
    });
  }
  getUserAllNotAppliedSubscription(user: User) {
    return this.SubscriptionModel.find({ payer: user._id, client: null });
  }

  async getUserSubscriptionsCount(user: User) {
    const availableSubscriptions = await this.SubscriptionModel.count({
      payer: user._id,
      client: null,
    });
    const subscriptions = await this.SubscriptionModel.find({
      payer: user._id,
    });
    return {
      availableSubscriptions,
      totalSubscriptions: subscriptions.length,
      assignedSubscriptions: subscriptions.length - availableSubscriptions,
      assignedSubscriptionsClients: subscriptions.map(sub => sub.client),
    };
  }
  updateUserSubscription(id: Types.ObjectId, data: Partial<Subscription>) {
    return this.SubscriptionModel.findByIdAndUpdate(id, data, { new: true });
  }
  async cancelGoallySubscription(subscriptionToken) {
    const subscription = await this.SubscriptionModel.findOne({
      subscriptionToken,
    });
    const res = await this.SubscriptionModel.deleteOne({ subscriptionToken });
    const refersionRes = await this.cancelRefersion(
      subscriptionToken,
      subscription.sku,
    );
    console.log(res);
    console.log('cancelGoallySubscription');
    console.log(refersionRes);
    console.log('cancelRefersion');

    return res;
  }
  async cancelRefersion(orderId, sku) {
    try {
      const response = await this.http
        .post(`cancel_conversion`, {
          order_id: orderId,
          items: [
            {
              sku: sku,
            },
          ],
        })
        .toPromise();
      console.log(response.data);
      return response.data;
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e.response.message);
    }
  }
  getGoallySubscriptionByClient(clientId: Types.ObjectId) {
    return this.SubscriptionModel.findOne({
      client: clientId,
    });
  }
  getGoallySubscriptionByClientAndPayer(
    clientId: Types.ObjectId,
    payerId: Types.ObjectId,
  ) {
    return this.SubscriptionModel.findOne({
      client: clientId,
      payer: payerId,
    });
  }
  getSubscriptionById(id: Types.ObjectId) {
    return this.SubscriptionModel.findById(id);
  }

  async getGoallySubscriptionByPayer(
    payer: Types.ObjectId,
  ): Promise<Subscription[]> {
    const res = await this.SubscriptionModel.find({ payer });
    return res;
  }
  async getGoallySubscriptionByInvoiceNumber(invoiceNumber: string) {
    try {
      const subscription = await this.SubscriptionModel.findOne({
        invoiceNumber,
      });
      return subscription;
    } catch (e) {
      console.log(e);
    }
  }
  async removeClientFromSubscription(
    clientId: Types.ObjectId,
    payerId: Types.ObjectId,
  ) {
    const subscription = await this.SubscriptionModel.findOne({
      client: clientId,
      payer: payerId,
    });
    if (subscription) {
      await this.SubscriptionModel.findByIdAndUpdate(
        subscription._id,
        { client: null },
        { new: true },
      );
    }
  }

  updateGoallySubItems(
    subscriptionToken: string,
    prices: {
      priceId: string;
      itemId: string;
    }[],
  ) {
    return this.SubscriptionModel.findOneAndUpdate(
      { subscriptionToken },
      { prices },
    );
  }

  stripeSubscriptionWebHook(body) {
    let event;

    try {
      event = body;
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.deleted': {
        const subscriptionUpdated = event.data.object;
        console.log('customer.subscription.deleted');
        console.log(JSON.stringify(subscriptionUpdated, null, 2));
        this.checkCancelGoallySubscriptionStatus(
          subscriptionUpdated.status,
          subscriptionUpdated.id,
        );
        break;
      }

      case 'customer.subscription.updated': {
        const subscriptionUpdated = event.data.object;
        console.log('customer.subscription.updated');
        console.log(JSON.stringify(subscriptionUpdated, null, 2));
        this.checkCancelGoallySubscriptionStatus(
          subscriptionUpdated.status,
          subscriptionUpdated.id,
        );
        this.updateGoallySubItems(
          subscriptionUpdated.id,
          subscriptionUpdated.items.data.map(e => ({
            priceId: e.price.id,
            itemId: e.id,
          })),
        );

        break;
      }

      case 'invoice.payment_failed':
        const paymentFailed = event.data.object;
        console.log(paymentFailed.customer);
        //TODO: log failed invoice
        console.log(paymentFailed.customer_email);

        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    return { received: true };
  }

  checkCancelGoallySubscriptionStatus(status, subscriptionId) {
    if (status !== 'active' && status !== 'trialing') {
      this.cancelGoallySubscription(subscriptionId);
    }
  }

  async recurlyWebHook(body) {
    let event;
    try {
      event = body;
    } catch (err) {
      throw new BadRequestException(`Recurly Webhook Error: ${err.message}`);
    }

    //related to SMS Order Notification
    const permissibleEvents = [
      'new_subscription_notification',
      'updated_subscription_notification',
      'canceled_subscription_notification',
      'expired_subscription_notification',
      'renewed_subscription_notification',
      'reactivated_account_notification',
      'subscription_paused_notification',
      'subscription_resumed_notification',
      'scheduled_subscription_pause_notification',
      'scheduled_subscription_update_notification',
      'subscription_pause_modified_notification',
      'paused_subscription_renewal_notification',
      'subscription_pause_canceled_notification',
      'prerenewal_notification',
      'new_dunning_event_notification',
      'new_dunning_event_notification',
    ];

    const fieldsToUpdate: Partial<Subscription> = {};
    let subscription;
    let subscriptionUuid;
    permissibleEvents.forEach(name => {
      if (event[name]) {
        subscription = event[name].subscription[0];
        if (subscription) {
          subscriptionUuid = subscription.uuid[0];
        }
      }
    });

    if (subscription && subscriptionUuid) {
      if (subscription.state[0]) {
        fieldsToUpdate.status = subscription.state[0];
      }
      if (subscription.current_period_started_at[0]._) {
        fieldsToUpdate.currentPeriodStartedAt =
          subscription.current_period_started_at[0]._;
      }
      if (subscription.current_period_ends_at[0]._) {
        fieldsToUpdate.currentPeriodEndsAt =
          subscription.current_period_ends_at[0]._;
      }
      if (subscription.canceled_at[0]._) {
        fieldsToUpdate.cancellationDate = subscription.canceled_at[0]._;
      }

      if (Object.keys(fieldsToUpdate).length !== 0) {
        try {
          this.updateSubscriptionByUuid(subscriptionUuid, fieldsToUpdate);
        } catch (error) {
          console.log(error);
        }
      }
    }

    //related to Send data to Shippo from Recurly to ship the Goally Device to the Client
    if (event.successful_payment_notification) {
      try {
        const notificationRes = event.successful_payment_notification;
        const account = notificationRes.account[0];
        const transaction = notificationRes.transaction[0];
        const transactionStatus = transaction.status[0];
        if (transactionStatus === 'success') {
          const invoiceNumber = transaction.invoice_number[0]._.toString();
          this.sendDataToShippo(
            account.email[0],
            account.phone[0],
            invoiceNumber,
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
    // Return a response to acknowledge receipt of the event
    return { received: true };
  }

  //Uuid is unique for each subscription and is assigned by reculry
  async updateSubscriptionByUuid(
    subscriptionUuid: string,
    fieldsToUpdate: Partial<Subscription>,
  ) {
    const subscription = await this.SubscriptionModel.findOne({
      subscriptionUuid,
    });
    if (!subscription)
      throw new BadRequestException(
        `Subscription with Subscription uuid:${subscriptionUuid} is not found.`,
      );
    const updatedSubscription = await this.SubscriptionModel.findByIdAndUpdate(
      subscription._id,
      fieldsToUpdate,
      { new: true },
    );
    return updatedSubscription;
  }

  async shippoWebHook(body) {
    let event;
    try {
      event = body;
    } catch (err) {
      throw new BadRequestException(`Shippo Webhook Error: ${err.message}`);
    }
    console.log('event', JSON.stringify(event));

    if (event.event === 'transaction_created') {
      const data = event.data;
      const fieldsToUpdate: Partial<Subscription> = {};
      fieldsToUpdate.shippoObjectId = data.object_id;
      fieldsToUpdate.trackingNumber = data.tracking_number;
      fieldsToUpdate.trackingUrl = data.tracking_url_provider;
      fieldsToUpdate.shippingStatus = data.tracking_status;

      const invoiceNumber = data.metadata
        .replace(PREFIX.RECURLY_INVOICE, '')
        .slice(0, -1);

      const subscription = await this.updateShippoFieldsInSubscription(
        { invoiceNumber },
        fieldsToUpdate,
      );
      // const user = await this.getUser(subscription.payer);
      // if (user && user.phoneNumber) {
      //   let message = '';
      //   message = `Your Goally order has been received! We'll send you a message when it's shipped. Yahooo!`;
      //   this.sendSms(message, user.phoneNumber);
      // }
    }

    if (event.event === 'track_updated') {
      const data = event.data;
      let shippingStatus = '';
      let shippingSubStatus = '';

      if (data.tracking_status) {
        const tracking_status = data.tracking_status;
        shippingStatus = tracking_status.status;
        if (tracking_status.substatus)
          shippingSubStatus = tracking_status.substatus.code;
      }

      const trackingNumber = data.tracking_number;

      const fieldsToUpdate: Partial<Subscription> = {};
      fieldsToUpdate.carrierName = data.carrier;
      fieldsToUpdate.shippingStatus = shippingStatus;
      fieldsToUpdate.shippingSubStatus = shippingSubStatus;

      const subscription = await this.updateShippoFieldsInSubscription(
        { trackingNumber },
        fieldsToUpdate,
      );

      const user = await this.getUser(subscription.payer);
      let message = '';
      if (user && user.phoneNumber) {
        if (shippingSubStatus === 'out_for_delivery') {
          const shortenerUrl = await this.tinyUrlService.getShortUrl(
            subscription.trackingUrl,
          );
          if (shortenerUrl)
            message = `Your Goally has been shipped! See tracking ${shortenerUrl}`;
          else message = `Your Goally has been shipped!`;
          this.sendSms(message, user.phoneNumber);
        } else if (shippingSubStatus === 'delivered') {
          message = `Goally has been delivered to ${user.address}. You're a lucky penguin today!`;
          this.sendSms(message, user.phoneNumber);
        }
      }
    }
    // Return a response to acknowledge receipt of the event
    return { received: true };
  }

  //updateShippoFieldsInSubscription will use the following two fields (object) to uniquely identify and update the subscription.
  //invoiceNumber serves as the unique identifier of subscription, invoice Number is a shared/connection field between Recurly and Shippo. In recurly, it is invoice number while in shippo, it is order number.
  //Shippo Object Id serves as unique identifier of subscription in case invoice number is not available.
  async updateShippoFieldsInSubscription(
    object: any,
    fieldsToUpdate: Partial<Subscription>,
  ) {
    const subscriptions = await this.SubscriptionModel.find(object);
    if (!subscriptions || subscriptions.length == 0)
      throw new BadRequestException(
        `Subscription with object: ${JSON.stringify(object)} is not found.`,
      );

    const subscriptionsIds = subscriptions.map(
      subscription => subscription._id,
    );

    const updatedSubscriptions = await this.SubscriptionModel.updateMany(
      { _id: { $in: subscriptionsIds } },
      fieldsToUpdate,
      { multi: true },
    );
    return subscriptions[0];
  }

  async sendSms(message: string, phoneNumber: string) {
    await this.messagingService.sendSms(message, phoneNumber);
  }

  async addSubscriptionsUuidField() {
    const total = await this.SubscriptionModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const subscriptions = await this.SubscriptionModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(subscriptions, async subscription => {
          await this.addSubscriptionUuidField(subscription);
        });
      });
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e,
      };
    }
  }

  async addSubscriptionUuidField(subscription: Subscription) {
    if (
      subscription.subscriptionType == RECURLY &&
      subscription.subscriptionToken
    ) {
      const subscriptionFromRecurly = await this.recurlyService.getSubscriptionById(
        subscription.subscriptionToken,
      );
      subscription.subscriptionUuid = subscriptionFromRecurly.uuid;
      const savedSubscription = await new this.SubscriptionModel(
        subscription,
      ).save();
    }
    return subscription;
  }

  async getUser(userId: Types.ObjectId) {
    const user = await this.usersService.findById(userId);
    if (user) return user;
    return false;
  }

  async sendDataToShippo(email: string, phone: string, invoiceNumber: string) {
    const invoice = await this.recurlyService.getInvoiceDetails(invoiceNumber);
    const isInvoiceShippable = this.recurlyService.isInvoiceShippable(invoice);
    if (isInvoiceShippable) {
      const user = await this.getUser(
        (invoice.account?.code as unknown) as Types.ObjectId,
      );
      if (user && user.phoneNumber) {
        const message = `Your Goally order has been received! We'll send you a message when it's shipped. To get started, download the Parent App so you can manage your kid's Goally (https://linktr.ee/getgoally) and watch this video: tinyurl.com/yfpbwpdv`;
        try {
          await this.sendSms(message, user.phoneNumber);
        } catch (e) {
          console.log('error', e);
        }
      }

      invoice.shippingAddress.email = email;
      invoice.shippingAddress.phone = phone;
      const shippoOrder = this.shippoService.createShippoOrder(invoice);
      const isShipmentCreated = await this.shippoService.postShippoOrder(
        shippoOrder,
      );
      if (isShipmentCreated) {
        const invoiceBody = {
          customerNotes: `shippo order = ${shippoOrder.order_number}`,
        };
        await this.recurlyService.updateInvoice(invoice.id, invoiceBody);
        const subIds = this.recurlyService.getDeviceSubscriptionIds(invoice);
        subIds.forEach(async subId => {
          const subscriptionBody = {
            customFields: [
              { name: 'shippo_order', value: shippoOrder.order_number },
            ],
          };
          await this.recurlyService.updateSubscription(subId, subscriptionBody);
        });

        const updatedSubscriptions = await this.updateShippoFieldsInSubscription(
          { invoiceNumber },
          { isShipmentCreated: true },
        );
        return updatedSubscriptions;
      }
    }
  }

  async postReferralSubsToShippo() {
    // const deviceRegex = { $regex: new RegExp('device', 'i') };
    const subscriptions = await this.SubscriptionModel.find({
      couponUsed: { $ne: '' },
      status: 'active',
      isShipmentCreated: false,
      $and: [
        {
          sku: { $ne: RECURLY_PLANS.HTS_ONLY_MONTHLY },
        },
        {
          sku: { $ne: RECURLY_PLANS.HTS_ONLY_PREPAID_12 },
        },
        {
          sku: { $ne: RECURLY_PLANS.HTS_ONLY_PREPAID_24 },
        },
        {
          sku: { $ne: RECURLY_PLANS.HTS_ONLY_PREPAID_36 },
        },
      ],
      color: { $ne: RECURLY_ITEMS.USE_MY_OWN_DEVICE },
    });

    console.log('subscriptions', subscriptions);
    await BB.mapSeries(subscriptions, async subscription => {
      const user = await this.getUser(subscription.payer);
      if (user) {
        try {
          await this.sendDataToShippo(
            user.email,
            user.phoneNumber,
            subscription.invoiceNumber,
          );
        } catch (error) {
          console.log(error);
        }
      }
    });
  }
}
