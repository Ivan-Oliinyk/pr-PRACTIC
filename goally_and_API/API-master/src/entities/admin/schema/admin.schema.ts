import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ADMIN_ROLE_TYPES } from 'src/shared/const';

import { Hasher } from 'src/shared/helper/Hasher';

@Schema({ timestamps: true })
export class Admin extends Document {
  @Prop({
    unique: true,
    collation: { locale: 'en', strength: 2 },
    trim: true,
    lowercase: true,
  })
  email: string;

  @Prop()
  password: string;

  token?: string;

  @Prop({ enum: Object.values(ADMIN_ROLE_TYPES) })
  role: string;

  comparePasswords: (pwd: string) => Promise<boolean>;
  hashPwd: (pwd: string) => Promise<string>;
}
const AdminSchema = SchemaFactory.createForClass(Admin);
AdminSchema.pre<Admin>('save', preSave);

async function preSave() {
  const admin = this as Admin;
  if (admin.isModified('password')) {
    admin.password = await admin.hashPwd(admin.password);
  }
}

AdminSchema.methods.hashPwd = async function(password) {
  const pwd = await Hasher.generateHash(password);
  return pwd;
};
AdminSchema.methods.comparePasswords = async function(password) {
  const admin = this;
  const match = await Hasher.compare(password, admin.password);

  return match;
};
export { AdminSchema };
