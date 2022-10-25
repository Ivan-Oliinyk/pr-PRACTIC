import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false, id: false })
export class DedicatedTimer extends Document {
  @Prop()
  eliminateExpensiveMechanicalTimers: boolean;
  @Prop()
  timersLonger: boolean;
}
export const DedicatedTimerSchema = SchemaFactory.createForClass(
  DedicatedTimer,
);
