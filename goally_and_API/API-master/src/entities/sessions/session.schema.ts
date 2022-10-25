import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/entities/users/schema';
import { Admin } from '../admin/schema/admin.schema';

@Schema({ timestamps: true })
export class Session extends Document {
  @Prop()
  token: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
  })
  user: User;

  @Prop({
    type: Types.ObjectId,
    ref: Admin.name,
    default: null,
  })
  admin: Admin;
}
const SessionSchema = SchemaFactory.createForClass(Session);

export { SessionSchema };
