import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { SafetyFeature } from 'src/entities/safety-features/schema/safety-feature.schema';
import { SAFETY_NOTIFICATIONS } from 'src/socket/const';
import { SocketBase } from 'src/socket/socket-base.gateway';
import { GoallyEventEmitter } from '../const';
@Injectable()
export class SafetyNotifier implements OnModuleInit {
  constructor(
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private baseSocket: SocketBase,
  ) {}

  onModuleInit() {
    this.emitter.on(
      'SafetyCreated',
      async safety => await this.onSafetyCreated(safety),
    );

    this.emitter.on(
      'SafetyUpdated',
      async safety => await this.onSafetyUpdated(safety),
    );
  }

  private async onSafetyCreated(safety) {
    this.onSafetyChanged(safety, 'CREATED');
  }
  private async onSafetyUpdated(safety) {
    this.onSafetyChanged(safety, 'UPDATED');
  }

  onSafetyChanged(safety: SafetyFeature, action) {
    const body = {
      safetyId: safety._id,
      clientId: safety.clientId,
      action,
      safety,
    };
    if (safety.clientId) {
      this.baseSocket.notifyAllParentsAndDeviceByClientId(
        safety.clientId,
        SAFETY_NOTIFICATIONS.CLIENT_SAFETY_CHANGED,
        body,
      );
    }
  }
}
