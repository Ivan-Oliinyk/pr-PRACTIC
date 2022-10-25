import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { generateCode } from 'src/shared/helper/generateCode';
import { User } from '.';
import { STATUSES } from '../../../shared/const/statuses';

@Schema({ timestamps: true })
export class Organization extends Document {
  @Prop()
  name: string;

  @Prop({ unique: true, required: true })
  code: string;

  @Prop()
  state: string;

  @Prop()
  city: string;

  @Prop()
  type: string;

  @Prop()
  postalCode: string;

  @Prop()
  country: string;

  @Prop()
  address: string;

  @Prop()
  numberOfStaff: string;

  @Prop({
    enum: [STATUSES.ACTIVE, STATUSES.DISABLED],
    default: STATUSES.ACTIVE,
  })
  status: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  owner: User;
}

const OrganizationSchema = SchemaFactory.createForClass(Organization);
OrganizationSchema.pre<Organization>('validate', preValidate);

async function preValidate() {
  const org = this as Organization;
  org.code = generateCode(8);
}
export { OrganizationSchema };
