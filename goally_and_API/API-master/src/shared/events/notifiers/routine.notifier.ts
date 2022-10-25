import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { PlayedRoutine } from 'src/entities/played-routine/schema/played-routine.schema';
import { Routine } from 'src/entities/routines/schema/routine.schema';
import { ROUTINE_NOTIFICATIONS } from 'src/socket/const';
import { SocketBase } from 'src/socket/socket-base.gateway';
import { GoallyEventEmitter } from '../const';

@Injectable()
export class RoutineNotifier implements OnModuleInit {
  constructor(
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private baseSocket: SocketBase,
  ) {}

  onModuleInit() {
    this.emitter.on(
      'RoutineCreatedForTheChild',
      async routine => await this.onRoutineCreatedForTheChild(routine),
    );
    this.emitter.on(
      'RoutineCreated',
      async routine => await this.onRoutineCreated(routine),
    );
    this.emitter.on(
      'RoutineUpdated',
      async routine => await this.onRoutineUpdated(routine),
    );
    this.emitter.on(
      'RoutineDeleted',
      async routine => await this.onRoutineDeleted(routine),
    );

    this.emitter.on(
      'RoutineHistoryNewAdded',
      async routine => await this.onRoutineHistoryNewAdded(routine, 'CREATED'),
    );

    this.emitter.on(
      'RoutineHistoryEdited',
      async routine => await this.onRoutineHistoryChanged(routine, 'EDITED'),
    );

    this.emitter.on(
      'RoutineLibraryReordered',
      async routine => await this.onRoutineLibraryReordered(routine),
    );
  }

  onRoutineLibraryReordered(routine) {
    const body = {
      routineId: routine._id,
      clientId: routine.clientId,
      action: 'REORDERED',
      routine,
    };
    if (routine.clientId) {
      this.baseSocket.notifyAllParentsAndDeviceByClientId(
        routine.clientId,
        ROUTINE_NOTIFICATIONS.CHILD_LIBRARY_CHANGED,
        body,
      );
    } else {
      this.baseSocket.sendToAllUserConnectedSession(
        routine.createdBy,
        ROUTINE_NOTIFICATIONS.PARENT_LIBRARY_CHANGED,
        body,
      );
    }
  }
  onRoutineHistoryNewAdded(routine: PlayedRoutine, action) {
    const body = { action, playedRoutineId: routine._id, routine };
    this.baseSocket.notifyAllParentsAndDeviceByClientId(
      routine.clientId,
      ROUTINE_NOTIFICATIONS.ROUTINE_COMPLETED,
      body,
    );
  }
  onRoutineHistoryChanged(routine: PlayedRoutine, action) {
    const body = { action, playedRoutineId: routine._id, routine };
    this.baseSocket.notifyAllParentsAndDeviceByClientId(
      routine.clientId,
      ROUTINE_NOTIFICATIONS.PARENT_HISTORY_CHANGED,
      body,
    );
  }
  private async onRoutineCreated(routine: Routine) {
    this.baseSocket.sendToAllUserConnectedSession(
      routine.createdBy,
      ROUTINE_NOTIFICATIONS.PARENT_LIBRARY_CHANGED,
      { routine, action: 'CREATED' },
    );
  }
  private async onRoutineUpdated(routine: Routine) {
    const body = {
      routineId: routine._id,
      routine,
      clientId: routine.clientId,
      action: 'UPDATED',
    };
    if (routine.clientId) {
      this.baseSocket.notifyAllParentsAndDeviceByClientId(
        routine.clientId,
        ROUTINE_NOTIFICATIONS.CHILD_LIBRARY_CHANGED,
        body,
      );
    } else {
      this.baseSocket.sendToAllUserConnectedSession(
        routine.createdBy,
        ROUTINE_NOTIFICATIONS.PARENT_LIBRARY_CHANGED,
        body,
      );
    }
  }

  private async onRoutineDeleted(routine: Routine) {
    const body = {
      routineId: routine._id,
      clientId: routine.clientId,
      action: 'DELETED',
      routine,
    };
    if (routine.clientId) {
      this.baseSocket.notifyAllParentsAndDeviceByClientId(
        routine.clientId,
        ROUTINE_NOTIFICATIONS.CHILD_LIBRARY_CHANGED,
        body,
      );
    } else {
      this.baseSocket.sendToAllUserConnectedSession(
        routine.createdBy,
        ROUTINE_NOTIFICATIONS.PARENT_LIBRARY_CHANGED,
        body,
      );
    }
  }

  private async onRoutineCreatedForTheChild(routine: Routine) {
    const body = { clientId: routine.clientId, action: 'CREATED', routine };
    if (routine.clientId) {
      this.baseSocket.notifyAllParentsAndDeviceByClientId(
        routine.clientId,
        ROUTINE_NOTIFICATIONS.CHILD_LIBRARY_CHANGED,
        body,
      );
    }
  }
}
