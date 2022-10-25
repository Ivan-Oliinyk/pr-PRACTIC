import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminConfigModule } from '../admin-config/admin-config.module';
import { SleepMode, SleepModeSchema } from './schema/sleep-mode.schema';
import { SleepModeController } from './sleep-mode.controller';
import { SleepModeService } from './sleep-mode.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SleepMode.name, schema: SleepModeSchema },
    ]),
    forwardRef(() => AdminConfigModule),
    ConfigModule,
  ],
  controllers: [SleepModeController],
  providers: [SleepModeService],
  exports: [SleepModeService],
})
export class SleepModeModule {}
