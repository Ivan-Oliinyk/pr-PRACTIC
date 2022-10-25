import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { GameConfig } from 'src/entities/game-configs/schema/game-configs.schema';
import { GAME_CONFIG_NOTIFICATIONS } from 'src/socket/const';
import { SocketBase } from 'src/socket/socket-base.gateway';
import { GoallyEventEmitter } from '../const';
@Injectable()
export class GameConfigNotifier implements OnModuleInit {
  constructor(
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private baseSocket: SocketBase,
  ) {}

  onModuleInit() {
    this.emitter.on(
      'GameConfigCreated',
      async gameConfig => await this.onGameConfigCreated(gameConfig),
    );
    this.emitter.on(
      'GameConfigUpdated',
      async gameConfig => await this.onGameConfigUpdated(gameConfig),
    );
  }

  private async onGameConfigCreated(gameConfig) {
    this.onGameConfigChanged(gameConfig, 'CREATED');
  }

  private async onGameConfigUpdated(gameConfig) {
    this.onGameConfigChanged(gameConfig, 'UPDATED');
  }

  onGameConfigChanged(gameConfig: GameConfig, action) {
    const body = {
      gameConfigId: gameConfig._id,
      clientId: gameConfig.clientId,
      action,
      gameConfig,
    };
    if (gameConfig.clientId) {
      this.baseSocket.notifyAllParentsAndDeviceByClientId(
        gameConfig.clientId,
        GAME_CONFIG_NOTIFICATIONS.CLIENT_GAME_CONFIG_CHANGED,
        body,
      );
    }
  }
}
