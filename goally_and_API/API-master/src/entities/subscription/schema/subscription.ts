import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Client } from 'src/entities/clients/schema/client.schema';
import { User } from 'src/entities/users/schema';

@Schema({ timestamps: true })
export class Subscription extends Document {
  @Prop()
  subscriptionToken: string;

  @Prop()
  subscriptionUuid: string;

  @Prop()
  invoiceNumber: string;

  @Prop()
  shippoObjectId: string;

  @Prop()
  sku: string;

  @Prop()
  carrierName: string;

  @Prop()
  trackingNumber: string;

  @Prop()
  trackingUrl: string;

  @Prop()
  shippingStatus: string;

  @Prop()
  shippingSubStatus: string;

  @Prop()
  shippingAddress: string;

  @Prop()
  color: string;

  @Prop({ type: [{ priceId: String, itemId: String }] })
  prices: { priceId: string; itemId: string }[];

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
  })
  payer: Types.ObjectId;

  @Prop()
  status: string;

  @Prop()
  subscriptionType: string;

  @Prop()
  currentPeriodStartedAt: Date;

  @Prop()
  currentPeriodEndsAt: Date;

  @Prop()
  cancellationDate: Date;

  @Prop()
  collectionMethod: string;

  @Prop({
    type: Types.ObjectId,
    ref: Client.name,
    default: null,
  })
  client: Types.ObjectId;

  @Prop()
  couponUsed: string;

  @Prop({ default: false })
  isShipmentCreated: boolean;
}
const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

export { SubscriptionSchema };
