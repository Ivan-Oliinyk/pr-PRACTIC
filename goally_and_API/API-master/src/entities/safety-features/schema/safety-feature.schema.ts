import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Client } from 'src/entities/clients/schema/client.schema';
import { User } from 'src/entities/users/schema';

export class UniqueBehavior {
  name: string;
}

export class Contact {
  firstName: string;
  lastName: string;
  imgURL: string;
  relationship: string;
  phoneNumber: string;
  priority: number;
  _id?: Types.ObjectId;
}

@Schema({ timestamps: true })
export class SafetyFeature extends Document {
  @Prop({ required: true })
  learnerDescription: string;

  @Prop({ required: true, default: true })
  showIdCard: boolean;

  @Prop({ required: true })
  nameOfSchoolOrFVP: string;

  @Prop({
    required: true,
    default: [],
    type: [{ name: String }],
  })
  uniqueBehaviors: UniqueBehavior[];

  @Prop({ required: true })
  additionalNotes: string;

  @Prop({
    required: true,
    default: [],
    type: [
      {
        firstName: String,
        lastName: String,
        imgURL: String,
        relationship: String,
        phoneNumber: String,
        priority: Number,
      },
    ],
  })
  contacts: Contact[];

  @Prop({ required: true, default: true })
  allow911Calling: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  createdBy: User;

  @Prop({
    type: Types.ObjectId,
    ref: Client.name,
  })
  clientId: Types.ObjectId;
}
const SafetyFeatureSchema = SchemaFactory.createForClass(SafetyFeature);

export { SafetyFeatureSchema };
