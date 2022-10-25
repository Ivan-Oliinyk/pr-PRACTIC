import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/entities/users/schema';

export class Redemption {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  redeemedBy: Types.ObjectId | User;

  @Prop({
    default: 0,
  })
  amountEarned: number;
}

@Schema({ timestamps: true })
export class Referrals extends Document {
  @Prop({
    type: String,
    unique: true,
    sparse: true,
  })
  referralCode: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
  })
  userId: User;

  @Prop({
    default: [],
    type: [{ redeemedBy: Types.ObjectId, amountEarned: Number }],
  })
  redemptions: Redemption[];
}
const ReferralsSchema = SchemaFactory.createForClass(Referrals);

export { ReferralsSchema };
