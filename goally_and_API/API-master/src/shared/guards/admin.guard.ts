import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AdminSessionService } from 'src/entities/admin-session/admin-session.service';
import { SessionsService } from 'src/entities/sessions/sessions.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private adminSession: AdminSessionService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];
    if (!token) return false;
    const session = await this.adminSession.getByToken(token);
    if (!session) return false;
    session.admin.token = token;
    if (!session.admin) return false;
    request.user = session.admin;
    return true;
  }
}
