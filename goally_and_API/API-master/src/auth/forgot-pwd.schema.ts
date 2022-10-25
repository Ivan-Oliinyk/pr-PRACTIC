import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/entities/users/schema';

@Schema({ timestamps: true })
export class ForgotPwdRequest extends Document {
  @Prop()
  token: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
  })
  user: User;
  createdAt: Date;
}
const ForgotPwdRequestSchema = SchemaFactory.createForClass(ForgotPwdRequest);

export { ForgotPwdRequestSchema };
