import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { Sound } from 'src/entities/sounds/schema/sound.schema';
import { SOUND_NOTIFICATIONS } from 'src/socket/const';
import { SocketBase } from 'src/socket/socket-base.gateway';
import { GoallyEventEmitter } from '../const';
@Injectable()
export class SoundNotifier implements OnModuleInit {
  constructor(
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private baseSocket: SocketBase,
  ) {}

  onModuleInit() {
    this.emitter.on(
      'SoundUpdated',
      async sound => await this.onSoundUpdated(sound),
    );
  }

  private async onSoundUpdated(sound) {
    this.onSoundChanged(sound, 'UPDATED');
  }

  onSoundChanged(sound: Sound, action) {
    const body = {
      soundId: sound._id,
      clientId: sound.clientId,
      action,
      sound,
    };
    if (sound.clientId) {
      this.baseSocket.notifyAllParentsAndDeviceByClientId(
        sound.clientId,
        SOUND_NOTIFICATIONS.CLIENT_SOUND_CHANGED,
        body,
      );
    }
  }
}
