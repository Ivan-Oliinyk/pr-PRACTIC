import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Session } from './session.schema';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private SessionModel: Model<Session>,
  ) {}
  create(userId: Types.ObjectId, adminId?: Types.ObjectId) {
    const session = new this.SessionModel({
      token: uuidv4(),
      user: userId,
      admin: adminId || null,
    });
    return session.save();
  }

  delete(token: string) {
    return this.SessionModel.remove({ token });
  }
  async getByToken(token): Promise<Session> {
    const session = await this.SessionModel.findOne({ token }).populate({
      path: 'user',
    });

    return session;
  }

  async getSessionsByUserId(userId): Promise<string[]> {
    const sessions = await this.SessionModel.find({ user: userId });
    return sessions.map(e => e.token);
  }
  async getSessionsByUserIds([userIds]): Promise<string[]> {
    const sessions = await this.SessionModel.find({ user: { $in: userIds } });
    return sessions.map(e => e.token);
  }
}
