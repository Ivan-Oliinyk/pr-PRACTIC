import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Behavior } from 'src/entities/behavior/schema/behavior.schema';
import { Client } from 'src/entities/clients/schema/client.schema';
import { User } from 'src/entities/users/schema';

@Schema({ timestamps: true })
export class RecordedBehavior extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  usedPoints: number;

  @Prop()
  date: Date;

  @Prop()
  time: string;

  @Prop()
  duration: string;

  @Prop()
  severity: string;

  @Prop()
  groupSize: string;

  @Prop()
  location: string;

  @Prop()
  antecedent: string;

  @Prop({
    type: Types.ObjectId,
    ref: Client.name,
    default: null,
  })
  clientId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Behavior.name,
    default: null,
  })
  behaviorId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  createdBy: User;

  @Prop({ default: false })
  migrated: boolean;

  createdAt: Date;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;
}
const RecordedBehaviorSchema = SchemaFactory.createForClass(RecordedBehavior);

export { RecordedBehaviorSchema };
