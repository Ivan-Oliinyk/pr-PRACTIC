import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false, id: false })
export class AwardWinningVisualScheduler extends Document {
  @Prop()
  awardWinningVisualScheduler: boolean;
  @Prop()
  dedicatedMobileAppForLearners: boolean;
  @Prop()
  winPointsForRoutineCompletion: boolean;
  @Prop()
  startTimeAutomation: boolean;
  @Prop()
  uploadCustomImagesForVisualAids: boolean;
  @Prop()
  uploadCustomVideoToModelBehavior: boolean;
  @Prop()
  uploadAudioRecordingsForAuditoryPrompts: boolean;
}
export const AwardWinningVisualSchedulerSchema = SchemaFactory.createForClass(
  AwardWinningVisualScheduler,
);
