import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AdminSessionService } from 'src/entities/admin-session/admin-session.service';
import { ADMIN_ROLE_TYPES } from 'src/shared/const';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(private adminSession: AdminSessionService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];
    if (!token) return false;
    const session = await this.adminSession.getByToken(token);
    if (!session) return false;
    const { admin } = session;
    if (admin.role !== ADMIN_ROLE_TYPES.SUPER_ADMIN) return false;
    return true;
  }
}
