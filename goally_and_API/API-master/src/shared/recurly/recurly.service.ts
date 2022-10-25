import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as recurly from 'recurly';
import { Address, Subscription as RecurlySubscription } from 'recurly';
import { EnvironmentVariables } from 'src/config';
import { Referrals } from 'src/entities/referrals/schema/referrals.schema';
import { User } from 'src/entities/users/schema';
import { RECURLY_ITEMS } from '../const/recurly-items';
import { BLACK, BLUE, DEVICE_COLOR, PINK } from '../const/recurly-plans';
import { NewCheckoutDto, PlanInfoDto } from './dto/NewCheckoutDto';

@Injectable()
export class RecurlyService {
  apiKey: string;
  client: recurly.Client;

  public constructor(private config: ConfigService<EnvironmentVariables>) {
    this.apiKey = this.config.get('RECURLY_PRIVATE_KEY');
    this.client = new recurly.Client(this.apiKey);
  }

  async getPlans() {
    const plans = this.client.listPlans({
      params: { limit: 25, state: 'active' },
    });
    const result = [];
    for await (const plan of plans.each()) {
      result.push(plan);
    }
    return result;
  }

  async getItems() {
    const items = this.client.listItems({
      params: { limit: 25, state: 'active' },
    });
    const result = [];
    for await (const item of items.each()) {
      result.push(item);
    }
    return result;
  }

  buildCustomFields(planInfo: PlanInfoDto) {
    const buildCustomFields = [];

    if (
      planInfo.deviceItemCode == RECURLY_ITEMS.GOALLY_P1_PINK ||
      planInfo.deviceItemCode == RECURLY_ITEMS.GOALLY_P1_PINK_REPL
    ) {
      buildCustomFields.push({
        name: DEVICE_COLOR,
        value: PINK,
      });
    } else if (
      planInfo.deviceItemCode == RECURLY_ITEMS.GOALLY_P1_BLUE ||
      planInfo.deviceItemCode == RECURLY_ITEMS.GOALLY_P1_BLUE_REPL
    ) {
      buildCustomFields.push({
        name: DEVICE_COLOR,
        value: BLUE,
      });
    } else if (
      planInfo.deviceItemCode == RECURLY_ITEMS.GOALLY_DEVICE_J5_BLU ||
      planInfo.deviceItemCode == RECURLY_ITEMS.GOALLY_DEVICE_J5_BLU_REPL
    ) {
      buildCustomFields.push({
        name: DEVICE_COLOR,
        value: BLACK,
      });
    } else
      buildCustomFields.push({
        name: DEVICE_COLOR,
        value: RECURLY_ITEMS.USE_MY_OWN_DEVICE,
      });

    return buildCustomFields;
  }

  buildItems(
    newCheckoutDto: NewCheckoutDto,
    shipping: recurly.ShippingPurchase,
  ) {
    const items = [];

    newCheckoutDto.plansInfo.forEach(planInfo => {
      items.push({
        itemCode: planInfo.deviceItemCode,
      });
    });

    //check if all items are having deviceItemCode as use_my_own
    const allItemsHaveUseMyOwnDevice = newCheckoutDto.plansInfo.every(
      planInfo => {
        return planInfo.deviceItemCode == RECURLY_ITEMS.USE_MY_OWN_DEVICE;
      },
    );

    if (!allItemsHaveUseMyOwnDevice) {
      //calculate shipping fee
      switch (shipping.address.country) {
        case 'US':
          items.push({
            itemCode: RECURLY_ITEMS.US_STANDARD_SHIPPING,
          });
          break;

        case 'CA':
          items.push({
            itemCode: RECURLY_ITEMS.CANADA_STANDARD_SHIPPING,
          });
          break;

        default:
          items.push({
            itemCode: RECURLY_ITEMS.INTERNATIONAL_SHIPPING,
          });
          break;
      }
    }
    return items;
  }

  buildSubscriptions(newCheckoutDto: NewCheckoutDto) {
    const subscriptions = [];

    newCheckoutDto.plansInfo.forEach(planInfo => {
      const customFields = this.buildCustomFields(planInfo);
      subscriptions.push({
        planCode: planInfo.planCode,
        quantity: 1,
        customFields: customFields,
      });
    });
    return subscriptions;
  }

  buildAddress(newCheckoutDto: NewCheckoutDto): Address {
    const addressInfo = newCheckoutDto.isBillingSameAsShipping
      ? newCheckoutDto.shippingInfo
      : newCheckoutDto.billingInfo;
    const address = {
      phone: addressInfo.phone,
      street1: addressInfo.address,
      street2: addressInfo.apt,
      postalCode: addressInfo.postal,
      city: addressInfo.city,
      country: addressInfo.country,
      region: addressInfo.state,
    };
    return address;
  }

  buildShippingAddress(
    newCheckoutDto: NewCheckoutDto,
  ): recurly.ShippingAddressCreate {
    const addressInfo = newCheckoutDto.shippingInfo;
    const address: recurly.ShippingAddressCreate = {
      firstName: addressInfo.firstName,
      lastName: addressInfo.lastName,
      phone: addressInfo.phone,
      street1: addressInfo.address,
      street2: addressInfo.apt,
      postalCode: addressInfo.postal,
      city: addressInfo.city,
      country: addressInfo.country,
      region: addressInfo.state,
    };
    return address;
  }

  buildFullShippingPurchaseAddress(
    newCheckoutDto: NewCheckoutDto,
  ): recurly.ShippingPurchase {
    const addressInfo = newCheckoutDto.shippingInfo;
    const address: recurly.ShippingPurchase = {
      address: {
        firstName: addressInfo.firstName,
        lastName: addressInfo.lastName,
        phone: addressInfo.phone,
        street1: addressInfo.address,
        street2: addressInfo.apt,
        postalCode: addressInfo.postal,
        city: addressInfo.city,
        country: addressInfo.country,
        region: addressInfo.state,
      },
    };
    return address;
  }

  buildLocale(currency?: string): string {
    switch (currency) {
      case 'USD':
        return 'en-US';

      case 'AUD':
        return 'en-AU';

      case 'GBP':
        return 'en-GB';

      default:
        return 'en-GB';
    }
  }

  getCCEmails(newCheckoutDto: NewCheckoutDto) {
    if (!newCheckoutDto.isBillingSameAsShipping) {
      return newCheckoutDto.billingInfo.email;
    }
    return null;
  }

  async getSubscriptionById(subscriptionId): Promise<RecurlySubscription> {
    return await this.client.getSubscription(subscriptionId);
  }

  async addReferralCodeInRecurly(referral: Referrals): Promise<recurly.Coupon> {
    const couponCreate = {
      name: referral.userId.toString(),
      code: referral.referralCode,
      discount_type: 'free_trial',
      free_trial_unit: 'month',
      free_trial_amount: 1,
      max_redemptions_per_account: 1,
    };

    return await this.client.createCoupon(couponCreate);
  }

  async cancelReferralsInRecurly(referral: Referrals) {
    await this.client.deactivateCoupon(referral.referralCode);
  }

  async getInvoiceDetails(invoiceNumber: string) {
    try {
      const invoice = await this.client.getInvoice('number-' + invoiceNumber);
      return invoice;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  isInvoiceShippable(invoice: recurly.Invoice) {
    if (invoice.state !== 'paid') return false;
    if (invoice.customerNotes)
      if (invoice.customerNotes.toLowerCase().includes('shippo')) return false;
    if (!(invoice.balance === 0)) return false;
    if (!invoice.lineItems[0].externalSku) return false;
    if (!invoice.lineItems[0].externalSku.toLowerCase().includes('device'))
      return false;
    if (!(invoice.refundableAmount == invoice.paid)) return false;
    if (!invoice.shippingAddress) return false;
    return true;
  }
  async updateInvoice(invoiceId: string, body: recurly.InvoiceUpdate) {
    try {
      const invoice = await this.client.updateInvoice(invoiceId, body);
      return invoice;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  getDeviceSubscriptionIds(invoice: recurly.Invoice) {
    const subIds = [];
    invoice.lineItems.forEach(item => {
      if (item.subscriptionId && item.planCode.includes('device')) {
        subIds.indexOf(item.subscriptionId) === -1
          ? subIds.push(item.subscriptionId)
          : '';
      }
    });
    return subIds;
  }
  async updateSubscription(
    subscriptionId: string,
    body: recurly.SubscriptionUpdate,
  ) {
    try {
      const invoice = await this.client.updateSubscription(
        subscriptionId,
        body,
      );
      return invoice;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async createAccount(newCheckoutDto: NewCheckoutDto, user: User) {
    try {
      const shippingAddress = this.buildShippingAddress(newCheckoutDto);
      const account = {
        code: user._id.toString(),
        preferredLocale: this.buildLocale(newCheckoutDto.currency),
        shippingAddresses: [shippingAddress],
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        address: this.buildAddress(newCheckoutDto),
      };
      const accountCreated = await this.client.createAccount(account);
      return accountCreated;
    } catch (err) {
      if (err instanceof recurly.errors.ValidationError) {
        if (err.message.includes('Code has already been taken')) {
          const accountUpdated = await this.updateAccount(newCheckoutDto, user);
          return accountUpdated;
        }
        console.log('create validation error', err);
        throw new BadRequestException(err);
      } else {
        console.log('create error', err);
        throw new BadRequestException(err);
      }
    }
  }

  async updateAccount(newCheckoutDto: NewCheckoutDto, user: User) {
    try {
      const accountCode = user._id.toString();

      const account = {
        preferredLocale: this.buildLocale(newCheckoutDto.currency),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        address: this.buildAddress(newCheckoutDto),
      };
      const accountCreated = await this.client.updateAccount(
        `code-${accountCode}`,
        account,
      );
      return accountCreated;
    } catch (err) {
      if (err instanceof recurly.errors.ValidationError) {
        console.log('update validation error', err);
        throw new BadRequestException(err);
      } else {
        console.log('update error', err);
        throw new BadRequestException(err);
      }
    }
  }

  async createPurchase(newCheckoutDto: NewCheckoutDto, user: User) {
    try {
      const purchaseShipping = this.buildFullShippingPurchaseAddress(
        newCheckoutDto,
      );
      const purchaseReq = {
        currency: newCheckoutDto.currency,
        account: {
          code: user._id.toString(),
          preferredLocale: this.buildLocale(newCheckoutDto.currency),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          billingInfo: {
            tokenId: newCheckoutDto.recurlyTokenId,
            ...(newCheckoutDto.threeDSecureActionResultTokenId && {
              threeDSecureActionResultTokenId:
                newCheckoutDto.threeDSecureActionResultTokenId,
            }),
          },
          ccEmails: this.getCCEmails(newCheckoutDto),
        },
        subscriptions: this.buildSubscriptions(newCheckoutDto),
        shipping: purchaseShipping,
        lineItems: this.buildItems(newCheckoutDto, purchaseShipping),
      };
      if (newCheckoutDto.referralCode) {
        purchaseReq['coupon_codes'] = [newCheckoutDto.referralCode];
      }
      const invoiceCollection = await this.client.createPurchase(purchaseReq);
      return invoiceCollection;
    } catch (err) {
      if (err instanceof recurly.errors.ValidationError) {
        console.log('purchase validation error', err);
        throw new BadRequestException(err);
      } else if (err.transactionError) {
        console.log('purchase three_d_secure_action_required error', err);
        return err.transactionError;
      } else {
        console.log('purchase error', err);
        throw new BadRequestException(err);
      }
    }
  }

  async createPurchaseWithoutToken(
    newCheckoutDto: NewCheckoutDto,
    user: User,
  ): Promise<recurly.InvoiceCollection> {
    try {
      const purchaseShipping = this.buildFullShippingPurchaseAddress(
        newCheckoutDto,
      );
      const purchaseReq = {
        currency: newCheckoutDto.currency,
        account: {
          code: user._id.toString(),
          preferredLocale: this.buildLocale(newCheckoutDto.currency),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          ccEmails: this.getCCEmails(newCheckoutDto),
        },
        collectionMethod: 'manual',
        subscriptions: this.buildSubscriptions(newCheckoutDto),
        shipping: purchaseShipping,
        lineItems: this.buildItems(newCheckoutDto, purchaseShipping),
      };
      const invoiceCollection = await this.client.createPurchase(purchaseReq);
      return invoiceCollection;
    } catch (err) {
      if (err instanceof recurly.errors.ValidationError) {
        console.log('purchase without token validation error', err);
        throw new BadRequestException(err);
      } else {
        console.log('purchase without token error', err);
        throw new BadRequestException(err);
      }
    }
  }
}
