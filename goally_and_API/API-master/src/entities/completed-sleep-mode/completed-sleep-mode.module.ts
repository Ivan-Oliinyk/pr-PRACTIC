import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from '../clients/clients.module';
import { SleepModeModule } from '../sleep-mode/sleep-mode.module';
import { CompletedSleepModeController } from './completed-sleep-mode.controller';
import { CompletedSleepModeService } from './completed-sleep-mode.service';
import {
  CompletedSleepMode,
  CompletedSleepModeSchema,
} from './schema/completed-sleep-mode.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CompletedSleepMode.name, schema: CompletedSleepModeSchema },
    ]),
    SleepModeModule,
    forwardRef(() => ClientsModule),
  ],
  controllers: [CompletedSleepModeController],
  providers: [CompletedSleepModeService],
  exports: [CompletedSleepModeService],
})
export class CompletedSleepModeModule {}
