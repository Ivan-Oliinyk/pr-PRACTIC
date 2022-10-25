import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AdminSession } from './admin-session.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AdminSessionService {
  constructor(
    @InjectModel(AdminSession.name) private AdminModel: Model<AdminSession>,
  ) {}
  create(adminId: Types.ObjectId) {
    const session = new this.AdminModel({
      token: uuidv4(),
      admin: adminId,
    });
    return session.save();
  }

  delete(token: string) {
    return this.AdminModel.remove({ token });
  }
  async getByToken(token): Promise<AdminSession> {
    const session = await this.AdminModel.findOne({ token }).populate({
      path: 'admin',
    });

    return session;
  }
}
