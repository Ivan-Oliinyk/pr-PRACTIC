import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config } from 'src/config';
import { AdminService } from 'src/entities/admin/admin.service';
import { ADMIN_ROLE_TYPES } from 'src/shared/const';

export async function setupSuperAdmin(app: INestApplication) {
  const adminService = app.get(AdminService);
  const adminEmail = config().SUPER_ADMIN_EMAIL;
  const adminPassword = config().SUPER_ADMIN_PWD;

  const adminExist = await adminService.adminExist(adminEmail);
  console.log('admin exist ', adminEmail);
  if (!adminExist) {
    const admin = await adminService.create(
      adminEmail,
      adminPassword,
      ADMIN_ROLE_TYPES.SUPER_ADMIN,
    );
    console.log('admin created ', adminEmail, admin._id);
  }

  return app;
}
