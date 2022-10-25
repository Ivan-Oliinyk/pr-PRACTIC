import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SessionsService } from 'src/entities/sessions/sessions.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private sessionService: SessionsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];
    if (!token) return false;
    const session = await this.sessionService.getByToken(token);
    if (!session) return false;
    session.user.token = token;
    if (!session.user) return false;
    request.user = session.user;
    return true;
  }
}
