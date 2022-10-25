import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false, id: false })
export class TokenEconomy extends Document {
  @Prop()
  giveChildPointsForAnything: false;
  @Prop()
  behaviorTrackerIntegration: false;
  @Prop()
  puzzlesForLearnersToComplete: false;
  @Prop()
  beautifulPuzzles: false;
  @Prop()
  createCustomRewardsToEarn: false;
}
export const TokenEconomySchema = SchemaFactory.createForClass(TokenEconomy);
