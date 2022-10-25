import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Admin } from '../admin/schema/admin.schema';

@Schema({ timestamps: true })
export class AdminSession extends Document {
  @Prop()
  token: string;

  @Prop({
    type: Types.ObjectId,
    ref: Admin.name,
  })
  admin: Admin;
}
const AdminSessionSchema = SchemaFactory.createForClass(AdminSession);

export { AdminSessionSchema };
