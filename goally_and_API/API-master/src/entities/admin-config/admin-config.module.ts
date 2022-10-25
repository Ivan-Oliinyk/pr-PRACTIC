import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSessionModule } from '../admin-session/admin-session.module';
import { SleepModeModule } from '../sleep-mode/sleep-mode.module';
import { AdminConfigController } from './admin-config.controller';
import { AdminConfigService } from './admin-config.service';
import { AdminConfig, AdminConfigSchema } from './schema/admin-config.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AdminConfig.name, schema: AdminConfigSchema },
    ]),
    AdminSessionModule,
    forwardRef(() => SleepModeModule),
  ],
  controllers: [AdminConfigController],
  providers: [AdminConfigService],
  exports: [AdminConfigService],
})
export class AdminConfigModule {}
