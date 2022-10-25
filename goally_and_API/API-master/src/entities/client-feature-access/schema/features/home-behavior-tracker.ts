import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false, id: false })
export class HomeBehaviorTracker extends Document {
  @Prop()
  streamlinedParentRecording: boolean;
  @Prop()
  promptingHierarchyForParents: boolean;
  @Prop()
  quizletsToQueryAnyKnowledge: boolean;
  @Prop()
  reportingSuiteToTrackProgress: boolean;
}
export const HomeBehaviorTrackerSchema = SchemaFactory.createForClass(
  HomeBehaviorTracker,
);
