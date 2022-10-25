import { forwardRef, Module } from '@nestjs/common';
import { ClientsModule } from 'src/entities/clients/clients.module';
import { CompletedChecklistsModule } from 'src/entities/completed-checklists/completed-checklists.module';
import { CompletedSleepModeModule } from 'src/entities/completed-sleep-mode/completed-sleep-mode.module';
import { DevicesModule } from 'src/entities/devices/devices.module';
import { PlayedRoutineModule } from 'src/entities/played-routine/played-routine.module';
import { RemindersModule } from 'src/entities/reminders/reminders.module';
import { SessionsModule } from 'src/entities/sessions/sessions.module';
import { UsersModule } from 'src/entities/users/users.module';
import { RedisModule } from 'src/redis/redis.module';
import { SharedModule } from 'src/shared/shared.module';
import { AddDeviceGateway } from './add-device.gateway';
import { ChecklistGateway } from './checklist.gateway';
import { DeviceServiceGateway } from './device-restart-restore.gateway';
import { ReminderGateway } from './reminder.gateway';
import { RoutineGateway } from './routine.gateway';
import { InitWebSocketPushes } from './services/initial-request.service';
import { RealTimeChecklistService } from './services/realtime-checklist.service';
import { RealTimeRoutineService } from './services/realtime-routine.service';
import { RealTimeSleepModeService } from './services/realtime-sleep-mode.service';
import { SleepModeGateway } from './sleep-mode.gateway';
import { SocketBase } from './socket-base.gateway';
@Module({
  imports: [
    forwardRef(() => DevicesModule),
    forwardRef(() => UsersModule),
    forwardRef(() => ClientsModule),
    forwardRef(() => SharedModule),
    RedisModule,
    SessionsModule,
    PlayedRoutineModule,
    CompletedChecklistsModule,
    CompletedSleepModeModule,
    RemindersModule,
  ],
  providers: [
    AddDeviceGateway,
    SocketBase,
    RoutineGateway,
    RealTimeRoutineService,
    InitWebSocketPushes,
    DeviceServiceGateway,
    ChecklistGateway,
    RealTimeChecklistService,
    ReminderGateway,
    SleepModeGateway,
    RealTimeSleepModeService,
  ],
  exports: [SocketBase],
})
export class SocketModule {}
