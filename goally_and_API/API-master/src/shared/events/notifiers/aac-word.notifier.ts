import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { AacWord } from 'src/entities/aac/aac-words/schema/aac-word.schema';
import { AAC_NOTIFICATIONS } from 'src/socket/const';
import { SocketBase } from 'src/socket/socket-base.gateway';
import { GoallyEventEmitter } from '../const';

@Injectable()
export class AacWordNotifier implements OnModuleInit {
  constructor(
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private baseSocket: SocketBase,
  ) {}

  onModuleInit() {
    this.emitter.on(
      'AacWordCreated',
      async aacWord => await this.onAacWordCreated(aacWord),
    );
    this.emitter.on(
      'AacWordAddedForTheChild',
      async aacWord => await this.onAacWordAddedForTheChild(aacWord),
    );
    this.emitter.on(
      'AacWordModelForTheChild',
      async aacWord => await this.onAacWordModelForTheChild(aacWord),
    );
    this.emitter.on(
      'AacMultipleWordsAddedForTheChild',
      async aacWords => await this.onAacMultipleWordsAddedForTheChild(aacWords),
    );
    this.emitter.on(
      'AacMultipleWordsDeletedForTheChild',
      async aacWords =>
        await this.onAacMultipleWordsDeletedForTheChild(aacWords),
    );
    this.emitter.on(
      'AacMultipleWordsUpdatedForTheChild',
      async aacWords =>
        await this.onAacMultipleWordsUpdatedForTheChild(aacWords),
    );
    this.emitter.on(
      'AacWordUpdated',
      async aacWord => await this.onAacWordUpdated(aacWord),
    );
    this.emitter.on(
      'AacWordDeleted',
      async aacWord => await this.onAacWordDeleted(aacWord),
    );
    this.emitter.on(
      'AacPlayedWordCreated',
      async aacPlayedWord => await this.onAacPlayedWordCreated(aacPlayedWord),
    );
  }

  onAacWordUpdated(aacWord) {
    this.onAacLibraryChanged(aacWord, 'UPDATED');
  }

  onAacWordDeleted(aacWord) {
    this.onAacLibraryChanged(aacWord, 'DELETED');
  }

  onAacWordCreated(aacWord) {
    this.onAacLibraryChanged(aacWord, 'CREATED');
  }

  onAacWordAddedForTheChild(aacWord) {
    this.onAacLibraryChanged(aacWord, 'CREATED');
  }

  onAacWordModelForTheChild(aacWord) {
    this.onAacLibraryChanged(aacWord, 'WORD_MODEL');
  }

  onAacMultipleWordsAddedForTheChild(aacWords: AacWord[]) {
    this.onAacMultipleChangesForTheChild(aacWords, 'MULTIPLE_CREATED');
  }
  onAacMultipleWordsDeletedForTheChild(aacWords: AacWord[]) {
    this.onAacMultipleChangesForTheChild(aacWords, 'MULTIPLE_DELETED');
  }
  onAacMultipleWordsUpdatedForTheChild(aacWords: AacWord[]) {
    this.onAacMultipleChangesForTheChild(aacWords, 'MULTIPLE_UPDATED');
  }

  onAacPlayedWordCreated(aacPlayedWord) {
    this.onAacPlayedChanged(aacPlayedWord, 'CREATED');
  }

  onAacLibraryChanged(aacWord, action) {
    const body = {
      aacWordId: aacWord._id,
      clientId: aacWord.clientId,
      action,
      aacWord,
    };
    if (aacWord.clientId) {
      this.baseSocket.notifyAllParentsAndDeviceByClientId(
        aacWord.clientId,
        AAC_NOTIFICATIONS.CHILD_WORD_LIBRARY_CHANGED,
        body,
      );
    } else {
      this.baseSocket.sendToAllUserConnectedSession(
        aacWord.createdBy,
        AAC_NOTIFICATIONS.PARENT_WORD_LIBRARY_CHANGED,
        body,
      );
    }
  }

  onAacMultipleChangesForTheChild(aacWords: AacWord[], action) {
    const clientId = aacWords[0].clientId;
    const createdBy = aacWords[0].createdBy;

    if (clientId) {
      const body = {
        clientId,
        action,
        aacWords,
      };
      this.baseSocket.notifyAllParentsAndDeviceByClientId(
        clientId,
        AAC_NOTIFICATIONS.CHILD_WORD_LIBRARY_CHANGED,
        body,
      );
    } else if (createdBy) {
      const body = {
        action,
        aacWords,
      };
      this.baseSocket.sendToAllUserConnectedSession(
        createdBy,
        AAC_NOTIFICATIONS.PARENT_WORD_LIBRARY_CHANGED,
        body,
      );
    }
  }

  onAacPlayedChanged(aacPlayedWord, action) {
    const body = {
      aacPlayedWordId: aacPlayedWord._id,
      clientId: aacPlayedWord.clientId,
      action,
      aacPlayedWord,
    };
    this.baseSocket.notifyAllParentsAndDeviceByClientId(
      aacPlayedWord.clientId,
      AAC_NOTIFICATIONS.PLAYED_AAC_CHANGED,
      body,
    );
  }
}
