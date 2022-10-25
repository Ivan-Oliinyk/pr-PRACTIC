import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { CompletedQuizlet } from 'src/entities/completed-quizlet/schema/completed-quizlet.schema';
import { Quizlet } from 'src/entities/quizlet/schema/quizlet.schema';
import { QUIZLET_NOTIFICATIONS } from 'src/socket/const';
import { SocketBase } from 'src/socket/socket-base.gateway';
import { GoallyEventEmitter } from '../const';
@Injectable()
export class QuizletNotifier implements OnModuleInit {
  constructor(
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private baseSocket: SocketBase,
  ) {}

  onModuleInit() {
    this.emitter.on(
      'QuizletCreated',
      async quizlet => await this.onQuizletCreated(quizlet),
    );
    this.emitter.on(
      'QuizletCreatedForTheChild',
      async quizlet => await this.onQuizletCreatedForTheChild(quizlet),
    );
    this.emitter.on(
      'QuizletUpdated',
      async quizlet => await this.onQuizletUpdated(quizlet),
    );
    this.emitter.on(
      'QuizletDeleted',
      async quizlet => await this.onQuizletDeleted(quizlet),
    );
    this.emitter.on(
      'QuizletLibraryReordered',
      async quizlet => await this.onQuizletLibraryReordered(quizlet),
    );

    this.emitter.on(
      'CompletedQuizletRemoved',
      async quizlet => await this.onCompletedQuizletRemoved(quizlet),
    );

    this.emitter.on(
      'CompletedQuizletCreated',
      async quizlet => await this.onCompletedQuizletCreated(quizlet),
    );
  }
  onQuizletLibraryReordered(quizlet) {
    this.onQuizletLibraryChanged(quizlet, 'REORDERED');
  }
  onCompletedQuizletCreated(quizlet) {
    this.onCompletedQuizletChanged(quizlet, 'CREATED');
  }
  onCompletedQuizletRemoved(quizlet) {
    this.onCompletedQuizletChanged(quizlet, 'REMOVED');
  }

  private async onQuizletCreated(quizlet) {
    this.onQuizletLibraryChanged(quizlet, 'CREATED');
  }

  private async onQuizletCreatedForTheChild(quizlet) {
    this.onQuizletLibraryChanged(quizlet, 'CREATED');
  }

  private async onQuizletUpdated(quizlet) {
    this.onQuizletLibraryChanged(quizlet, 'UPDATED');
  }

  private async onQuizletDeleted(quizlet) {
    this.onQuizletLibraryChanged(quizlet, 'DELETED');
  }
  onQuizletLibraryChanged(quizlet: Quizlet, action) {
    const body = {
      quizletId: quizlet._id,
      clientId: quizlet.clientId,
      action,
      quizlet,
    };
    if (quizlet.clientId) {
      this.baseSocket.notifyAllParentsAndDeviceByClientId(
        quizlet.clientId,
        QUIZLET_NOTIFICATIONS.CHILD_LIBRARY_CHANGED,
        body,
      );
    } else {
      this.baseSocket.sendToAllUserConnectedSession(
        quizlet.createdBy,
        QUIZLET_NOTIFICATIONS.PARENT_LIBRARY_CHANGED,
        body,
      );
    }
  }
  onCompletedQuizletChanged(quizlet: CompletedQuizlet, action) {
    const body = {
      quizletId: quizlet._id,
      clientId: quizlet.clientId,
      action,
      quizlet,
    };
    this.baseSocket.notifyAllParentsAndDeviceByClientId(
      quizlet.clientId,
      QUIZLET_NOTIFICATIONS.COMPLETED_QUIZLET_CHANGED,
      body,
    );
  }
}
