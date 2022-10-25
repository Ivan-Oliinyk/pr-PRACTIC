import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { CareGiverTile } from 'src/entities/admin-config/schema/admin-config.schema';
import { Client } from 'src/entities/clients/schema/client.schema';
import { USER_TYPES } from 'src/shared/const';
import { USER_PLANS } from 'src/shared/const/user-plans';
import { Hasher } from 'src/shared/helper/Hasher';
import { Organization } from '.';
import { STATUSES } from '../../../shared/const/statuses';

export class CoachingStatus {
  is3DaySmsSent: boolean;
  is10DaySmsSent: boolean;
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop()
  firstName: string;

  @Prop({ default: '' })
  lastName: string;

  @Prop({ unique: true, sparse: true })
  phoneNumber: string;

  @Prop({
    unique: true,
    collation: { locale: 'en', strength: 2 },
    trim: true,
    lowercase: true,
  })
  email: string;

  @Prop()
  password: string;

  @Prop({ type: [Types.ObjectId], ref: 'Client' })
  clients: Types.ObjectId[] | Client[];

  @Prop({ type: [Types.ObjectId], ref: 'careGiverTiles', default: [] })
  completedTiles: Types.ObjectId[] | CareGiverTile[];

  @Prop()
  stripeToken: string;

  @Prop({ default: null, enum: Object.values(USER_PLANS).concat(null) })
  plan: string;

  @Prop({
    enum: [STATUSES.ACTIVE, STATUSES.DISABLED],
    default: STATUSES.ACTIVE,
  })
  status: string;

  @Prop({
    enum: Object.values(USER_TYPES),
  })
  type: string;

  @Prop()
  otherType: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Organization',
  })
  organization: Organization;

  @Prop()
  postalCode: string;

  @Prop()
  address: string;

  @Prop()
  apt: string;

  @Prop()
  country: string;

  comparePasswords: (pwd: string) => Promise<boolean>;
  hashPwd: (pwd: string) => Promise<string>;
  token: string;

  @Prop({ default: null })
  stripeCustomerId: string;

  @Prop({ default: null })
  recurlyCustomerId: string;

  @Prop({ default: null })
  paymentMethod: string;

  @Prop({ default: null })
  subscription: string;

  @Prop({ default: null })
  last4: string;

  @Prop({ default: false })
  migrated: boolean;

  @Prop()
  fcmToken: string;

  @Prop()
  state: string;

  @Prop()
  city: string;

  @Prop({
    collation: { locale: 'en', strength: 2 },
    trim: true,
    lowercase: true,
  })
  payPalId: string;

  @Prop({ default: false })
  isSiteLicense: boolean;

  @Prop({
    collation: { locale: 'en', strength: 2 },
    trim: true,
    lowercase: true,
  })
  alternateEmail: string;

  @Prop({
    type: CoachingStatus,
    default: {
      is3DaySmsSent: false,
      is10DaySmsSent: false,
    },
  })
  coachingStatus: CoachingStatus;

  createdAt: Date;

  @Prop()
  lastLoginMedium: string;
}

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(aggregatePaginate);
UserSchema.pre<User>('save', preSave);

async function preSave() {
  const user = this as User;
  if (user.isModified('password') && !user.migrated) {
    user.password = await user.hashPwd(user.password);
  }
}

UserSchema.methods.hashPwd = async function(password) {
  const pwd = await Hasher.generateHash(password);
  return pwd;
};
UserSchema.methods.comparePasswords = async function(password) {
  const user = this;
  const match = await Hasher.compare(password, user.password);

  const matchOld =
    match || (await Hasher.comparePasswordOldPortal(password, user.password));

  return match || matchOld;
};
export { UserSchema };
