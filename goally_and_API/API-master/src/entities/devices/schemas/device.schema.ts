import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Client } from 'src/entities/clients/schema/client.schema';
import { generateCode } from 'src/shared/helper/generateCode';

@Schema({ timestamps: true })
export class Device extends Document {
  @Prop({ unique: true, required: true })
  uniqIdentifier: string;

  @Prop({ unique: true, required: true })
  code: string;

  @Prop()
  fcmToken: string;

  @Prop()
  appId: string;

  @Prop({})
  batteryLevel: number;

  @Prop({ default: false })
  wifiConnected: boolean;

  @Prop({ default: false })
  migrated: boolean;

  @Prop({ default: 1 })
  appVersion: number;

  @Prop()
  desiredVersion: number;

  createdAt: Date;
  client: Client;
  childConnected: boolean;

  @Prop({})
  wifiName: string;

  @Prop({})
  wifiStrength: number;

  @Prop({})
  isConnected: boolean;

  @Prop()
  platform: string;

  @Prop()
  osVersion: string;

  @Prop()
  manufacturer: string;

  @Prop()
  _model: string;

  @Prop()
  screenWidth: number;

  @Prop()
  screenHeight: number;

  @Prop()
  sku: string;

  @Prop()
  imei: string;

  @Prop()
  imsi: string;

  @Prop({ type: [Types.ObjectId], ref: 'Client' })
  clients: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Client' })
  activeClientId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  userId: Types.ObjectId;

  @Prop({
    default: 'Home',
  })
  deviceName: string;

  @Prop()
  memorySize: number;

  @Prop({ default: 50 })
  brightnessLevel: number;
}
const DeviceSchema = SchemaFactory.createForClass(Device);

DeviceSchema.pre<Device>('validate', function preValidate() {
  const device = this as Device;
  if (!device.migrated) device.code = generateCode(8);
});

export { DeviceSchema };
