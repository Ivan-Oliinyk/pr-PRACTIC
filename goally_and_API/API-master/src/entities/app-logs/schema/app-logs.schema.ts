import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Client } from 'src/entities/clients/schema/client.schema';
import { User } from 'src/entities/users/schema';
export enum LOGS_TYPE {
  SESSION = 'SESSION',
  INVITES = 'INVITES',
  ROUTINES = 'ROUTINES',
  BEHAVIORS = 'BEHAVIORS',
  REWARDS = 'REWARDS',
  BILLINGS = 'BILLINGS',
  SUBSCRIPTION = 'SUBSCRIPTION',
  SOUNDS = 'SOUNDS',
  USERS = 'USERS',
  REPORTS = 'REPORTS',
  CLIENTS = 'CLIENTS',
  DEVICE = 'DEVICE',
  REMINDERS = 'REMINDERS',
  USERS_WITH_ACCESS = 'USERS_WITH_ACCESS',
  BEHAVIOR_TRAININGS = 'BEHAVIOR_TRAININGS',
}

export enum ACTION_TYPE {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  RESTART = 'RESTART',
  RESET = 'RESET',
  TAKE_OVER_BILLING = 'TAKE_OVER_BILLING',
}
@Schema({ timestamps: true })
export class AppLogs extends Document {
  @Prop({ enum: Object.values(LOGS_TYPE) })
  entity: LOGS_TYPE;

  @Prop({ enum: Object.values(ACTION_TYPE) })
  action: ACTION_TYPE;

  @Prop({
    type: Types.ObjectId,
    ref: Client.name,
    default: null,
  })
  client: Client | Types.ObjectId | null;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    default: null,
  })
  user: User | Types.ObjectId | null;

  @Prop({ type: Object })
  meta: any;

  createdAt: Date;
}
const AppLogsSchema = SchemaFactory.createForClass(AppLogs);
AppLogsSchema.plugin(mongoosePaginate);
export { AppLogsSchema };
