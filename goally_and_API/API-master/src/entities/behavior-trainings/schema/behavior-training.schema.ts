import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TrainingSegmentSchema } from 'src/entities/behavior-trainings/training-segments/schema/training-segment.schema';
import { Client } from 'src/entities/clients/schema/client.schema';
import { User } from 'src/entities/users/schema';
import { LIBRARY_TYPES } from 'src/shared/const';
import { CreateTrainingSegment } from '../training-segments/dto/CreateTrainingSegment.dto';

export class Reason {
  reason: string;
  _id?: Types.ObjectId;
}

@Schema({ timestamps: true })
export class BehaviorTraining extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    default: [],
    type: [{ reason: String }],
  })
  reasons: Reason[];

  @Prop({})
  videoURL: string;

  @Prop({
    type: [TrainingSegmentSchema],
  })
  segments: Partial<CreateTrainingSegment>[];

  @Prop()
  segmentSize: number;

  @Prop({ required: true })
  points: number;

  @Prop({ required: true })
  puzzlePieces: number;

  @Prop()
  pin: number;

  @Prop({ default: false })
  isPinRequired: boolean;

  @Prop({ default: false })
  puzzlePieceOnCorrectAnswer: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  createdBy: User;

  @Prop({
    enum: [LIBRARY_TYPES.ADULT, LIBRARY_TYPES.CHILD],
    required: true,
  })
  libraryType: string;

  @Prop({})
  ordering: number;

  @Prop({
    type: Types.ObjectId,
    ref: Client.name,
  })
  clientId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: BehaviorTraining.name,
    default: null,
  })
  parentBehaviorTrainingId: BehaviorTraining;

  @Prop({
    type: Date,
    default: null,
  })
  lastCompleted: Date;

  createdAt: Date;
}

const BehaviorTrainingSchema = SchemaFactory.createForClass(BehaviorTraining);

export { BehaviorTrainingSchema };
