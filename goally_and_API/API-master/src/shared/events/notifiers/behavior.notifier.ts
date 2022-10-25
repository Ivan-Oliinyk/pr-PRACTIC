import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { BEHAVIOR_NOTIFICATIONS } from 'src/socket/const';
import { SocketBase } from 'src/socket/socket-base.gateway';
import { GoallyEventEmitter } from '../const';

@Injectable()
export class BehaviorNotifier implements OnModuleInit {
  constructor(
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private baseSocket: SocketBase,
  ) {}

  onModuleInit() {
    this.emitter.on(
      'BehaviorCreated',
      async behavior => await this.onBehaviorCreated(behavior),
    );
    this.emitter.on(
      'BehaviorCreatedForTheChild',
      async behavior => await this.onBehaviorCreatedForTheChild(behavior),
    );
    this.emitter.on(
      'BehaviorUpdated',
      async behavior => await this.onBehaviorUpdated(behavior),
    );
    this.emitter.on(
      'BehaviorDeleted',
      async behavior => await this.onBehaviorDeleted(behavior),
    );

    this.emitter.on(
      'RecordedBehaviorRemoved',
      async behavior => await this.onRecordedBehaviorRemoved(behavior),
    );

    this.emitter.on(
      'RecordedBehaviorCreated',
      async behavior => await this.onRecordedBehaviorCreated(behavior),
    );

    this.emitter.on('BehaviorLibraryReordered', async behavior => {
      await this.onBehaviorLibraryReordered(behavior);
    });
  }

  onBehaviorUpdated(behavior) {
    this.onBehaviorLibraryChanged(behavior, 'UPDATED');
  }

  onBehaviorDeleted(behavior) {
    this.onBehaviorLibraryChanged(behavior, 'DELETED');
  }

  onBehaviorCreated(behavior) {
    this.onBehaviorLibraryChanged(behavior, 'CREATED');
  }

  onBehaviorCreatedForTheChild(behavior) {
    this.onBehaviorLibraryChanged(behavior, 'CREATED');
  }
  onBehaviorLibraryReordered(behavior) {
    this.onBehaviorLibraryChanged(behavior, 'REORDERED');
  }
  onBehaviorLibraryChanged(behavior, action) {
    const body = {
      behaviorId: behavior._id,
      clientId: behavior.clientId,
      action,
      behavior,
    };
    if (behavior.clientId) {
      this.baseSocket.notifyAllParentsAndDeviceByClientId(
        behavior.clientId,
        BEHAVIOR_NOTIFICATIONS.CHILD_LIBRARY_CHANGED,
        body,
      );
    } else {
      this.baseSocket.sendToAllUserConnectedSession(
        behavior.createdBy,
        BEHAVIOR_NOTIFICATIONS.PARENT_LIBRARY_CHANGED,
        body,
      );
    }
  }

  onRecordedBehaviorCreated(behavior) {
    this.onRecordedLibraryChanged(behavior, 'CREATED');
  }
  onRecordedBehaviorRemoved(behavior) {
    this.onRecordedLibraryChanged(behavior, 'REMOVED');
  }

  onRecordedLibraryChanged(behavior, action) {
    const body = {
      behaviorId: behavior._id,
      clientId: behavior.clientId,
      action,
      behavior,
    };
    this.baseSocket.notifyAllParentsAndDeviceByClientId(
      behavior.clientId,
      BEHAVIOR_NOTIFICATIONS.RECORDED_BEHAVIOR_CHANGED,
      body,
    );
  }
}
