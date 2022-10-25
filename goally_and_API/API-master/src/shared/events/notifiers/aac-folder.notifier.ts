import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { AAC_NOTIFICATIONS } from 'src/socket/const';
import { SocketBase } from 'src/socket/socket-base.gateway';
import { GoallyEventEmitter } from '../const';

@Injectable()
export class AacFolderNotifier implements OnModuleInit {
  constructor(
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private baseSocket: SocketBase,
  ) {}

  onModuleInit() {
    this.emitter.on(
      'AacFolderCreated',
      async folder => await this.onFolderCreated(folder),
    );
    this.emitter.on(
      'AacFolderCreatedForTheChild',
      async folder => await this.onFolderCreatedForTheChild(folder),
    );
    this.emitter.on(
      'AacFolderUpdated',
      async folder => await this.onFolderUpdated(folder),
    );
    this.emitter.on(
      'AacFolderDeleted',
      async folder => await this.onFolderDeleted(folder),
    );
  }

  onFolderUpdated(folder) {
    this.onFolderLibraryChanged(folder, 'UPDATED');
  }

  onFolderDeleted(folder) {
    this.onFolderLibraryChanged(folder, 'DELETED');
  }

  onFolderCreated(folder) {
    this.onFolderLibraryChanged(folder, 'CREATED');
  }

  onFolderCreatedForTheChild(folder) {
    this.onFolderLibraryChanged(folder, 'CREATED');
  }

  onFolderLibraryChanged(folder, action) {
    const body = {
      folderId: folder._id,
      clientId: folder.clientId,
      action,
      folder,
    };
    if (folder.clientId) {
      this.baseSocket.notifyAllParentsAndDeviceByClientId(
        folder.clientId,
        AAC_NOTIFICATIONS.CHILD_FOLDER_LIBRARY_CHANGED,
        body,
      );
    } else {
      this.baseSocket.sendToAllUserConnectedSession(
        folder.createdBy,
        AAC_NOTIFICATIONS.PARENT_FOLDER_LIBRARY_CHANGED,
        body,
      );
    }
  }
}
