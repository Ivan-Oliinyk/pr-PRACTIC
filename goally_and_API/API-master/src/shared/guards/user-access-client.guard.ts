import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SessionsService } from 'src/entities/sessions/sessions.service';
import { User } from 'src/entities/users/schema';
import { Types } from 'mongoose';

@Injectable()
export class UserAccessToTheClient implements CanActivate {
  constructor(private sessionService: SessionsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    const clients = (user.clients as Types.ObjectId[]).map(e => e.toString());
    if (request.body.clientId) {
      const clientId = request.body.clientId.toString();
      return clients.includes(clientId);
    }
    if (request.params.clientId) {
      const clientId = request.params.clientId.toString();
      return clients.includes(clientId);
    }
    return true;
  }
}
