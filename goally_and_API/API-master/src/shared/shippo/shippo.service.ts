import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { EnvironmentVariables } from 'src/config';
@Injectable()
export class ShippoService {
  ordersUrl: string;
  headers: any;

  public constructor(
    private config: ConfigService<EnvironmentVariables>,
    private http: HttpService,
  ) {
    const apiKey = this.config.get('SHIPPO_PRIVATE_KEY');
    this.ordersUrl = 'https://api.goshippo.com/orders/';
    this.headers = {
      Authorization: `ShippoToken ${apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async getOrders() {
    try {
      const shippoResponse$ = this.http.get(this.ordersUrl, {
        headers: this.headers,
      });
      const shippoResponseValue = await lastValueFrom(shippoResponse$);
      if (
        shippoResponseValue.status === 200 &&
        shippoResponseValue.statusText === 'OK'
      ) {
        const orders = shippoResponseValue.data.results;
        return orders;
      } else {
        return false;
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  createShippoOrder(invoice: recurly.Invoice) {
    const orderNumber = `rcrlyinv_${invoice.number}_`;
    const shippingAddress = invoice.shippingAddress;
    const toAddress = {};
    toAddress['name'] =
      shippingAddress['firstName'] + ' ' + shippingAddress['lastName'];
    toAddress['email'] = shippingAddress['email'];
    toAddress['phone'] = shippingAddress['phone'];

    toAddress['street1'] = shippingAddress['street1'].split(',')[0];

    if (shippingAddress['street2']) {
      toAddress['street2'] = shippingAddress['street2'];
    }

    toAddress['zip'] = shippingAddress.postalCode
      ? shippingAddress.postalCode
      : // @ts-ignore
        shippingAddress.zip;
    toAddress['city'] = shippingAddress.city;
    toAddress['state'] = shippingAddress.region
      ? shippingAddress.region
      : // @ts-ignore
        shippingAddress.state;
    toAddress['country'] = shippingAddress.country;

    const lineItems = [];
    let outWeight = 0.5;

    invoice.lineItems.forEach(item => {
      if (item.externalSku) {
        if (
          item.externalSku.includes('goally_device') ||
          item.externalSku.includes('goally_phone')
        ) {
          outWeight += 0.5;
          lineItems.push({
            quantity: 1,
            title: this.getItemTitle(item.externalSku.toString()),
            sku: item.externalSku,
            weight: '.5',
            weight_unit: 'lb',
            total_price: 20.0,
          });
        }
      }
    });

    return {
      to_address: toAddress,
      line_items: lineItems,
      order_number: orderNumber,
      status: invoice.state,
      placed_at: invoice.createdAt.toISOString(),
      weight: outWeight.toString(),
      weight_unit: 'lb',
    };
  }
  getItemTitle(sku: string) {
    const title = sku.split('_');
    const capitalizedTitle = title
      .map(word => {
        return word[0].toUpperCase() + word.substring(1);
      })
      .join(' ');
    return capitalizedTitle;
  }
  async postShippoOrder(shippoOrder) {
    try {
      const shippoResponse$ = this.http.post(this.ordersUrl, shippoOrder, {
        headers: this.headers,
      });
      const shippoResponseValue = await lastValueFrom(shippoResponse$);
      if (
        shippoResponseValue.status === 201 &&
        shippoResponseValue.statusText === 'Created'
      ) {
        console.log(
          'testing shippoResponseValue',
          shippoResponseValue.data,
          'ends',
        );
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
