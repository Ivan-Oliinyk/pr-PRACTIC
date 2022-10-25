import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { BehaviorTraining } from 'src/entities/behavior-trainings/schema/behavior-training.schema';
import { CompletedTraining } from 'src/entities/completed-trainings/schema/completed-training.schema';
import { BEHAVIOR_TRAINING_NOTIFICATIONS } from 'src/socket/const';
import { SocketBase } from 'src/socket/socket-base.gateway';
import { GoallyEventEmitter } from '../const';
@Injectable()
export class BehaviorTrainingNotifier implements OnModuleInit {
  constructor(
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private baseSocket: SocketBase,
  ) {}

  onModuleInit() {
    this.emitter.on(
      'BehaviorTrainingCreated',
      async behaviorTraining =>
        await this.onBehaviorTrainingCreated(behaviorTraining),
    );
    this.emitter.on(
      'BehaviorTrainingCreatedForTheChild',
      async behaviorTraining =>
        await this.onBehaviorTrainingCreatedForTheChild(behaviorTraining),
    );
    this.emitter.on(
      'BehaviorTrainingUpdated',
      async behaviorTraining =>
        await this.onBehaviorTrainingUpdated(behaviorTraining),
    );
    this.emitter.on(
      'BehaviorTrainingDeleted',
      async behaviorTraining =>
        await this.onBehaviorTrainingDeleted(behaviorTraining),
    );
    this.emitter.on(
      'BehaviorTrainingLibraryReordered',
      async behaviorTraining =>
        await this.onBehaviorTrainingLibraryReordered(behaviorTraining),
    );

    this.emitter.on(
      'CompletedTrainingRemoved',
      async completedTraining =>
        await this.onCompletedTrainingRemoved(completedTraining),
    );

    this.emitter.on(
      'CompletedTrainingCreated',
      async completedTraining =>
        await this.onCompletedTrainingCreated(completedTraining),
    );
  }
  onBehaviorTrainingLibraryReordered(behaviorTraining) {
    this.onBehaviorTrainingLibraryChanged(behaviorTraining, 'REORDERED');
  }
  onCompletedTrainingCreated(completedTraining) {
    this.onCompletedTrainingChanged(completedTraining, 'CREATED');
  }
  onCompletedTrainingRemoved(completedTraining) {
    this.onCompletedTrainingChanged(completedTraining, 'REMOVED');
  }

  private async onBehaviorTrainingCreated(behaviorTraining) {
    this.onBehaviorTrainingLibraryChanged(behaviorTraining, 'CREATED');
  }

  private async onBehaviorTrainingCreatedForTheChild(behaviorTraining) {
    this.onBehaviorTrainingLibraryChanged(behaviorTraining, 'CREATED');
  }

  private async onBehaviorTrainingUpdated(behaviorTraining) {
    this.onBehaviorTrainingLibraryChanged(behaviorTraining, 'UPDATED');
  }

  private async onBehaviorTrainingDeleted(behaviorTraining) {
    this.onBehaviorTrainingLibraryChanged(behaviorTraining, 'DELETED');
  }
  onBehaviorTrainingLibraryChanged(behaviorTraining: BehaviorTraining, action) {
    const body = {
      behaviorTrainingId: behaviorTraining._id,
      clientId: behaviorTraining.clientId,
      action,
      behaviorTraining,
    };
    if (behaviorTraining.clientId) {
      this.baseSocket.notifyAllParentsAndDeviceByClientId(
        behaviorTraining.clientId,
        BEHAVIOR_TRAINING_NOTIFICATIONS.CHILD_LIBRARY_CHANGED,
        body,
      );
    } else {
      this.baseSocket.sendToAllUserConnectedSession(
        behaviorTraining.createdBy,
        BEHAVIOR_TRAINING_NOTIFICATIONS.PARENT_LIBRARY_CHANGED,
        body,
      );
    }
  }
  onCompletedTrainingChanged(completedTraining: CompletedTraining, action) {
    const body = {
      quizletId: completedTraining._id,
      clientId: completedTraining.clientId,
      action,
      completedTraining,
    };
    this.baseSocket.notifyAllParentsAndDeviceByClientId(
      completedTraining.clientId,
      BEHAVIOR_TRAINING_NOTIFICATIONS.COMPLETED_TRAINING_CHANGED,
      body,
    );
  }
}
