import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Client } from 'src/entities/clients/schema/client.schema';
import {
  AwardWinningVisualScheduler,
  AwardWinningVisualSchedulerSchema,
} from './features/award-wining.schema';
import { BstFeature } from './features/behavior-skill-training';
import { ChatFeature, ChatFeatureSchema } from './features/chat-feature';
import {
  DedicatedTimer,
  DedicatedTimerSchema,
} from './features/dedicated-timer';
import {
  HomeBehaviorTracker,
  HomeBehaviorTrackerSchema,
} from './features/home-behavior-tracker';
import { TokenEconomy, TokenEconomySchema } from './features/token-economy';

@Schema({ timestamps: true })
export class ClientFeatureAccess extends Document {
  @Prop({ type: AwardWinningVisualSchedulerSchema })
  awardWinningVisualScheduler: AwardWinningVisualScheduler;

  @Prop({ type: ChatFeatureSchema })
  chat: ChatFeature;

  @Prop({ type: TokenEconomySchema })
  tokenEconomy: TokenEconomy;

  @Prop({ type: DedicatedTimerSchema })
  dedicatedVisualTimer: DedicatedTimer;

  @Prop({ type: HomeBehaviorTrackerSchema })
  homeBehaviorTracker: HomeBehaviorTracker;

  @Prop({ type: BstFeature })
  behaviorSkillsTraining: BstFeature;

  @Prop({
    type: Types.ObjectId,
    ref: Client.name,
    required: true,
    unique: true,
  })
  client: Types.ObjectId;
  createdAt: Date;
}
const ClientFeatureAccessSchema = SchemaFactory.createForClass(
  ClientFeatureAccess,
);

export { ClientFeatureAccessSchema };
