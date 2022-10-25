import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { USER_TYPES } from 'src/shared/const';
import { generateCode } from 'src/shared/helper/generateCode';

@Schema({ timestamps: true })
export class Invitation extends Document {
  @Prop()
  email: string;

  @Prop({
    enum: Object.values(USER_TYPES),
  })
  type: string;

  @Prop()
  firstName: string;

  @Prop({ default: '' })
  lastName: string;

  @Prop({ type: Types.ObjectId, ref: 'Client' })
  assignedClient: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  invitedBy: Types.ObjectId;

  createdAt: Date;

  @Prop()
  phoneNumber: string;

  @Prop({ unique: true, required: true })
  code: string;
}
const InvitationSchema = SchemaFactory.createForClass(Invitation);

InvitationSchema.pre<Invitation>('validate', function preValidate() {
  const invitation = this as Invitation;
  invitation.code = generateCode(6);
});

export { InvitationSchema };
