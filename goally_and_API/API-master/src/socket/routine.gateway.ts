import { UsePipes } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { InjectEventEmitter } from 'nest-emitter';
import { ClientsService } from 'src/entities/clients/clients.service';
import {
  INITIATOR,
  STATUS_PLAYED_ROUTINE,
} from 'src/entities/played-routine/const';
import {
  CreatePlayedRoutine,
  CreatePlayedRoutineRequest,
  PlayOrPauseActivityDto,
  UpdatePlayedRoutineActivityWebPortal,
  UpdatePlayedRoutineWebPortal,
} from 'src/entities/played-routine/dto/CreatePlayedRoutine.dto';
import { PlayedRoutineService } from 'src/entities/played-routine/played-routine.service';
import { UsersService } from 'src/entities/users/users.service';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { FCM_CLIENT_EVENTS } from 'src/shared/fcm/const';
import { FcmService } from 'src/shared/fcm/fcm.service';
import { AuthenticatedSocket } from './adapter/socket-redis.adapter';
import { ROUTINE_ACTIONS } from './const';
import { SocketValidationPipe } from './filterts';
import { RealTimeRoutineService } from './services/realtime-routine.service';
import { SocketBase } from './socket-base.gateway';

@UsePipes(new SocketValidationPipe())
@WebSocketGateway(null, { transports: ['websocket'] })
export class RoutineGateway {
  constructor(
    private us: UsersService,
    private cs: ClientsService,
    private playedRoutineService: PlayedRoutineService,
    private baseSocket: SocketBase,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private realTimeRoutineService: RealTimeRoutineService,
    private fcmService: FcmService,
  ) {}

  @SubscribeMessage(ROUTINE_ACTIONS.WP_REQUEST_TO_PLAY_ROUTINE)
  async onWpRoutineStart(
    @MessageBody() body: CreatePlayedRoutineRequest,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    try {
      const socketId = await this.getSocketId(body);
      const playedRoutine = await this.playedRoutineService.getPlayedRoutinesByClientId(
        body.clientId,
      );
      if (playedRoutine.length === 1)
        return { error: 'Another routine is currently running' };
      if (playedRoutine.length > 1) {
        await this.playedRoutineService.stopAllActiveRoutineForClient(
          body.clientId,
        );
      }
      if (!socketId) {
        try {
          let response;
          if (body.deviceId)
            response = await this.fcmService.sendMessageToDevice(
              body.deviceId,
              { [FCM_CLIENT_EVENTS.START_ROUTINE]: body.routineId },
            );
          else
            response = await this.fcmService.sendMessageToClientDevice(
              body.clientId,
              { [FCM_CLIENT_EVENTS.START_ROUTINE]: body.routineId },
            );

          return {
            error: 'Device in sleep mode 💤 we are waking him up 😃!',
            meta: response,
          };
        } catch (e) {
          console.log(e);
          return {
            error: 'Device might be offline',
          };
        }
      }

      const activeRoutine = await this.playedRoutineService.routineShowWelcomeScreen(
        body,
        INITIATOR.USER,
        await this.getDeviceId(body),
      );

      this.emitter.emit('ActiveRoutineChangedNotifyDevice', {
        routine: activeRoutine,
        clientId: body.clientId,
        socketId,
      });

      this.emitter.emit('ActiveRoutineChangedNotifyWebPortal', {
        routine: activeRoutine,
        clientId: body.clientId,
      });

      return { activeRoutine };
    } catch (e) {
      return { error: e.message };
    }
  }
  @SubscribeMessage(ROUTINE_ACTIONS.DEVICE_OPEN_WELCOME_ROUTINE_SCREEN)
  async onDeviceOpenWelcomeRoutineScreen(
    @MessageBody() body: CreatePlayedRoutine,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    try {
      const playedRoutine = await this.playedRoutineService.getPlayedRoutineByDeviceId(
        socket.device._id,
      );

      if (
        playedRoutine &&
        playedRoutine.status === STATUS_PLAYED_ROUTINE.SHOW_WELCOME_SCREEN
      ) {
        await this.realTimeRoutineService.stopRoutine(playedRoutine);
      } else {
        await this.playedRoutineService.stopWelcomeScreenRoutine(
          socket.device._id,
        );
      }

      const activeRoutine = await this.playedRoutineService.routineShowWelcomeScreen(
        body,
        INITIATOR.CLIENT,
        socket.device._id,
      );

      this.emitter.emit('ActiveRoutineChangedNotifyWebPortal', {
        routine: activeRoutine,
        clientId: activeRoutine.clientId,
      });

      return {
        activeRoutine,
      };
    } catch (e) {
      return { error: e.message };
    }
  }
  @SubscribeMessage(ROUTINE_ACTIONS.DEVICE_START_ROUTINE)
  async onDeviceStartRoutine(
    @MessageBody() body: CreatePlayedRoutine,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    try {
      const playedRoutine = await this.playedRoutineService.getPlayedRoutineByDeviceId(
        socket.device._id,
      );
      if (
        playedRoutine &&
        playedRoutine.routineId.toString() !== body.routineId.toString()
      ) {
        console.log(playedRoutine.routineId);
        console.log(body.routineId);
        return {
          error: `You are trying to run routine ${body.routineId} but ${playedRoutine?.routineId} is playing now with status ${playedRoutine?.status}`,
        };
      }
      const activeRoutine = await this.realTimeRoutineService.startRoutineAfterWelcomeScreen(
        playedRoutine,
      );

      this.emitter.emit('ActiveRoutineChangedNotifyWebPortal', {
        routine: activeRoutine,
        clientId: activeRoutine.clientId,
      });
      console.log('sending_finished');

      return {
        activeRoutine,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  @SubscribeMessage(ROUTINE_ACTIONS.DEVICE_STOP_ROUTINE)
  async onDeviceStopRoutine(@ConnectedSocket() socket: AuthenticatedSocket) {
    try {
      const playedRoutine = await this.playedRoutineService.getPlayedRoutineByDeviceId(
        socket.device._id,
      );
      if (!playedRoutine)
        throw new Error(`Client does not have any active routine`);

      const activeRoutine = await this.realTimeRoutineService.stopRoutine(
        playedRoutine,
      );

      this.emitter.emit('ActiveRoutineChangedNotifyWebPortal', {
        routine: activeRoutine,
        clientId: activeRoutine.clientId,
      });
      return {
        activeRoutine,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  @SubscribeMessage(ROUTINE_ACTIONS.DEVICE_PLAY_ACTIVITY)
  async onDeviceActivityPlay(
    @MessageBody() body: PlayOrPauseActivityDto,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    try {
      const playedRoutine = await this.playedRoutineService.getPlayedRoutineByDeviceId(
        socket.device._id,
      );
      if (!playedRoutine)
        throw new Error(`Client does not have any active routine`);
      const activeRoutine = await this.realTimeRoutineService.playActivity(
        playedRoutine,
        body.activityId,
      );

      this.emitter.emit('ActiveRoutineChangedNotifyWebPortal', {
        routine: activeRoutine,
        clientId: activeRoutine.clientId,
      });

      return {
        activeRoutine,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  @SubscribeMessage(ROUTINE_ACTIONS.DEVICE_PAUSE_ACTIVITY)
  async onDeviceActivityPause(
    @MessageBody() body: PlayOrPauseActivityDto,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    try {
      const playedRoutine = await this.playedRoutineService.getPlayedRoutineByDeviceId(
        socket.device._id,
      );
      if (!playedRoutine)
        throw new Error(`Client does not have any active routine`);
      const activeRoutine = await this.realTimeRoutineService.pauseActivity(
        playedRoutine,
        body.activityId,
      );

      this.emitter.emit('ActiveRoutineChangedNotifyWebPortal', {
        routine: activeRoutine,
        clientId: activeRoutine.clientId,
      });

      return {
        activeRoutine,
      };
    } catch (e) {
      return { error: e.message };
    }
  }
  @SubscribeMessage(ROUTINE_ACTIONS.DEVICE_SKIP_ACTIVITY)
  async onDeviceActivitySkip(
    @MessageBody() body: PlayOrPauseActivityDto,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    try {
      const playedRoutine = await this.playedRoutineService.getPlayedRoutineByDeviceId(
        socket.device._id,
      );
      if (!playedRoutine)
        throw new Error(`Client does not have any active routine`);
      const activeRoutine = await this.realTimeRoutineService.skipActivity(
        playedRoutine,
        body.activityId,
      );

      this.emitter.emit('ActiveRoutineChangedNotifyWebPortal', {
        routine: activeRoutine,
        clientId: activeRoutine.clientId,
      });
      return {
        activeRoutine,
      };
    } catch (e) {
      return { error: e.message };
    }
  }
  @SubscribeMessage(ROUTINE_ACTIONS.DEVICE_CANCEL_ACTIVITY)
  async onDeviceCancelActivity(
    @MessageBody() body: PlayOrPauseActivityDto,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    try {
      const playedRoutine = await this.playedRoutineService.getPlayedRoutineByDeviceId(
        socket.device._id,
      );
      if (!playedRoutine)
        throw new Error(`Client does not have any active routine`);
      const activeRoutine = await this.realTimeRoutineService.cancelActivity(
        playedRoutine,
        body.activityId,
      );

      this.emitter.emit('ActiveRoutineChangedNotifyWebPortal', {
        routine: activeRoutine,
        clientId: activeRoutine.clientId,
      });
      return {
        activeRoutine,
      };
    } catch (e) {
      return { error: e.message };
    }
  }
  @SubscribeMessage(ROUTINE_ACTIONS.DEVICE_COMPLETE_ACTIVITY)
  async onDeviceActivityComplete(
    @MessageBody() body: PlayOrPauseActivityDto,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    try {
      const playedRoutine = await this.playedRoutineService.getPlayedRoutineByDeviceId(
        socket.device._id,
      );
      if (!playedRoutine)
        throw new Error(`Client does not have any active routine`);
      const activeRoutine = await this.realTimeRoutineService.completeActivity(
        playedRoutine,
        body.activityId,
      );

      this.emitter.emit('ActiveRoutineChangedNotifyWebPortal', {
        routine: activeRoutine,
        clientId: activeRoutine.clientId,
      });
      return {
        activeRoutine,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  @SubscribeMessage(ROUTINE_ACTIONS.WP_PLAY_PAUSED_ROUTINE)
  async onWpRoutinePlay(
    @MessageBody() body: UpdatePlayedRoutineWebPortal,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    try {
      const socketId = await this.getSocketId(body);
      const playedRoutine = await this.playedRoutineService.getPlayedRoutineByRoutineId(
        body.routineId,
      );
      if (!playedRoutine) return `Routine with id ${body.routineId} not played`;
      const activeRoutine = await this.realTimeRoutineService.startRoutine(
        playedRoutine,
      );

      this.emitter.emit('ActiveRoutineChangedNotifyDevice', {
        routine: activeRoutine,
        clientId: activeRoutine.clientId,
        socketId,
      });

      this.emitter.emit('ActiveRoutineChangedNotifyWebPortal', {
        routine: activeRoutine,
        clientId: activeRoutine.clientId,
      });

      return {
        activeRoutine,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  @SubscribeMessage(ROUTINE_ACTIONS.WP_STOP_ROUTINE)
  async onWpRoutineStop(
    @MessageBody() body: UpdatePlayedRoutineWebPortal,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    try {
      const socketId = await this.getSocketId(body);
      const playedRoutine = await this.playedRoutineService.getPlayedRoutineByRoutineId(
        body.routineId,
      );
      if (!playedRoutine) return `Routine with id ${body.routineId} not played`;
      const activeRoutine = await this.realTimeRoutineService.stopRoutine(
        playedRoutine,
      );
      socketId &&
        this.emitter.emit('ActiveRoutineChangedNotifyDevice', {
          routine: activeRoutine,
          clientId: activeRoutine.clientId,
          socketId,
        });

      this.emitter.emit('ActiveRoutineChangedNotifyWebPortal', {
        routine: activeRoutine,
        clientId: activeRoutine.clientId,
      });
      return {
        activeRoutine,
      };
    } catch (e) {
      return { error: e.message };
    }
  }
  @SubscribeMessage(ROUTINE_ACTIONS.WP_PAUSE_ROUTINE)
  async onWpRoutinePause(
    @MessageBody() body: UpdatePlayedRoutineWebPortal,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    try {
      const socketId = await this.getSocketId(body);
      const playedRoutine = await this.playedRoutineService.getPlayedRoutineByRoutineId(
        body.routineId,
      );
      if (!playedRoutine) return `Routine with id ${body.routineId} not played`;
      const activeRoutine = await this.realTimeRoutineService.pauseRoutine(
        playedRoutine,
      );

      socketId &&
        this.emitter.emit('ActiveRoutineChangedNotifyDevice', {
          routine: activeRoutine,
          clientId: activeRoutine.clientId,
          socketId,
        });

      this.emitter.emit('ActiveRoutineChangedNotifyWebPortal', {
        routine: activeRoutine,
        clientId: activeRoutine.clientId,
      });
      return {
        activeRoutine,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  @SubscribeMessage(ROUTINE_ACTIONS.WP_PAUSE_ACTIVITY)
  async onWpActivityPause(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() body: UpdatePlayedRoutineActivityWebPortal,
  ) {
    try {
      const socketId = await this.getSocketId(body);
      const playedRoutine = await this.playedRoutineService.getPlayedRoutineByRoutineId(
        body.routineId,
      );
      if (!playedRoutine) return `Routine with id ${body.routineId} not played`;
      const activeRoutine = await this.realTimeRoutineService.pauseActivity(
        playedRoutine,
        body.activityId,
      );
      socketId &&
        this.emitter.emit('ActiveRoutineChangedNotifyDevice', {
          routine: activeRoutine,
          clientId: activeRoutine.clientId,
          socketId,
        });

      this.emitter.emit('ActiveRoutineChangedNotifyWebPortal', {
        routine: activeRoutine,
        clientId: activeRoutine.clientId,
      });
      return {
        activeRoutine,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  @SubscribeMessage(ROUTINE_ACTIONS.WP_CANCEL_ACTIVITY)
  async onWpActivityCancel(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() body: UpdatePlayedRoutineActivityWebPortal,
  ) {
    try {
      const socketId = await this.getSocketId(body);
      const playedRoutine = await this.playedRoutineService.getPlayedRoutineByRoutineId(
        body.routineId,
      );
      if (!playedRoutine) return `Routine with id ${body.routineId} not played`;
      const activeRoutine = await this.realTimeRoutineService.cancelActivity(
        playedRoutine,
        body.activityId,
      );
      socketId &&
        this.emitter.emit('ActiveRoutineChangedNotifyDevice', {
          routine: activeRoutine,
          socketId,
          clientId: activeRoutine.clientId,
        });

      this.emitter.emit('ActiveRoutineChangedNotifyWebPortal', {
        routine: activeRoutine,
        clientId: activeRoutine.clientId,
      });

      return {
        activeRoutine,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  @SubscribeMessage(ROUTINE_ACTIONS.WP_COMPLETE_ACTIVITY)
  async onWpActivityComplete(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() body: UpdatePlayedRoutineActivityWebPortal,
  ) {
    try {
      const socketId = await this.getSocketId(body);
      const playedRoutine = await this.playedRoutineService.getPlayedRoutineByRoutineId(
        body.routineId,
      );
      if (!playedRoutine) return `Routine with id ${body.routineId} not played`;
      const activeRoutine = await this.realTimeRoutineService.completeActivity(
        playedRoutine,
        body.activityId,
      );
      socketId &&
        this.emitter.emit('ActiveRoutineChangedNotifyDevice', {
          routine: activeRoutine,
          socketId,
          clientId: activeRoutine.clientId,
        });

      this.emitter.emit('ActiveRoutineChangedNotifyWebPortal', {
        routine: activeRoutine,
        clientId: activeRoutine.clientId,
      });

      return {
        activeRoutine,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  @SubscribeMessage(ROUTINE_ACTIONS.WP_PLAY_ACTIVITY)
  async onWpActivityPlay(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() body: UpdatePlayedRoutineActivityWebPortal,
  ) {
    try {
      const socketId = await this.getSocketId(body);
      const playedRoutine = await this.playedRoutineService.getPlayedRoutineByRoutineId(
        body.routineId,
      );
      if (!playedRoutine) return `Routine with id ${body.routineId} not played`;
      const activeRoutine = await this.realTimeRoutineService.playActivity(
        playedRoutine,
        body.activityId,
      );
      socketId &&
        this.emitter.emit('ActiveRoutineChangedNotifyDevice', {
          routine: activeRoutine,
          clientId: activeRoutine.clientId,
          socketId,
        });

      this.emitter.emit('ActiveRoutineChangedNotifyWebPortal', {
        routine: activeRoutine,
        clientId: activeRoutine.clientId,
      });
      return {
        activeRoutine,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  @SubscribeMessage(ROUTINE_ACTIONS.WP_SKIP_ACTIVITY)
  async onWpActivitySkip(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() body: UpdatePlayedRoutineActivityWebPortal,
  ) {
    try {
      const socketId = await this.getSocketId(body);
      console.log(socketId);
      const playedRoutine = await this.playedRoutineService.getPlayedRoutineByRoutineId(
        body.routineId,
      );
      console.log('2');
      if (!playedRoutine) return `Routine with id ${body.routineId} not played`;
      const activeRoutine = await this.realTimeRoutineService.skipActivity(
        playedRoutine,
        body.activityId,
      );
      socketId &&
        this.emitter.emit('ActiveRoutineChangedNotifyDevice', {
          routine: activeRoutine,
          clientId: activeRoutine.clientId,
          socketId,
        });

      this.emitter.emit('ActiveRoutineChangedNotifyWebPortal', {
        routine: activeRoutine,
        clientId: activeRoutine.clientId,
      });
      return {
        activeRoutine,
      };
    } catch (e) {
      return { error: e.message };
    }
  }
  @SubscribeMessage(ROUTINE_ACTIONS.WP_ADD_1MIN_TO_ACTIVITY)
  async onWpAddOneMinToActivity(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() body: UpdatePlayedRoutineActivityWebPortal,
  ) {
    try {
      const socketId = await this.getSocketId(body);
      const playedRoutine = await this.playedRoutineService.getPlayedRoutineByRoutineId(
        body.routineId,
      );
      if (!playedRoutine) return `Routine with id ${body.routineId} not played`;
      const activeRoutine = await this.realTimeRoutineService.addOneMinToActivity(
        playedRoutine,
        body.activityId,
      );
      socketId &&
        this.emitter.emit('ActiveRoutineChangedNotifyDevice', {
          routine: activeRoutine,
          clientId: activeRoutine.clientId,
          socketId,
        });

      this.emitter.emit('ActiveRoutineChangedNotifyWebPortal', {
        routine: activeRoutine,
        clientId: activeRoutine.clientId,
      });
      return {
        activeRoutine,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  @SubscribeMessage(ROUTINE_ACTIONS.WP_START_ACTIVITY_NOW)
  async onWpStartActivityNow(
    @MessageBody() body: UpdatePlayedRoutineActivityWebPortal,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    try {
      const socketId = await this.getSocketId(body);
      const playedRoutine = await this.playedRoutineService.getPlayedRoutineByRoutineId(
        body.routineId,
      );
      if (!playedRoutine) return `Routine with id ${body.routineId} not played`;
      const activeRoutine = await this.realTimeRoutineService.startActivityNow(
        playedRoutine,
        body.activityId,
      );

      socketId &&
        this.emitter.emit('ActiveRoutineChangedNotifyDevice', {
          routine: activeRoutine,
          clientId: activeRoutine.clientId,
          socketId,
        });

      this.emitter.emit('ActiveRoutineChangedNotifyWebPortal', {
        routine: activeRoutine,
        clientId: activeRoutine.clientId,
      });

      return {
        activeRoutine,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  @SubscribeMessage(ROUTINE_ACTIONS.WP_START_ACTIVITY_NEXT)
  async onWpStartActivityNext(
    @MessageBody() body: UpdatePlayedRoutineActivityWebPortal,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    try {
      const socketId = await this.getSocketId(body);
      const playedRoutine = await this.playedRoutineService.getPlayedRoutineByRoutineId(
        body.routineId,
      );
      if (!playedRoutine) return `Routine with id ${body.routineId} not played`;
      const activeRoutine = await this.realTimeRoutineService.startActivityNext(
        playedRoutine,
        body.activityId,
      );

      socketId &&
        this.emitter.emit('ActiveRoutineChangedNotifyDevice', {
          routine: activeRoutine,
          clientId: activeRoutine.clientId,
          socketId,
        });

      this.emitter.emit('ActiveRoutineChangedNotifyWebPortal', {
        routine: activeRoutine,
        clientId: activeRoutine.clientId,
      });

      return {
        activeRoutine,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  @SubscribeMessage(ROUTINE_ACTIONS.WP_SKIP_ACTIVITY_IN_ADVANCE)
  async onWpSkipActivityInAdvance(
    @MessageBody() body: UpdatePlayedRoutineActivityWebPortal,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    try {
      const socketId = await this.getSocketId(body);
      const playedRoutine = await this.playedRoutineService.getPlayedRoutineByRoutineId(
        body.routineId,
      );
      if (!playedRoutine) return `Routine with id ${body.routineId} not played`;
      const activeRoutine = await this.realTimeRoutineService.skipActivityInAdvance(
        playedRoutine,
        body.activityId,
      );

      socketId &&
        this.emitter.emit('ActiveRoutineChangedNotifyDevice', {
          routine: activeRoutine,
          clientId: activeRoutine.clientId,
          socketId,
        });

      this.emitter.emit('ActiveRoutineChangedNotifyWebPortal', {
        routine: activeRoutine,
        clientId: activeRoutine.clientId,
      });

      return {
        activeRoutine,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  private async getSocketId(body) {
    let socketId;
    if (body.deviceId)
      socketId = await this.baseSocket.getDeviceSocketByDeviceId(
        body.deviceId,
        body.clientId,
        false,
      );
    else
      socketId = await this.baseSocket.getDeviceSocketByClientId(
        body.clientId,
        false,
      );
    return socketId;
  }

  private async getDeviceId(body) {
    if (body.deviceId) return body.deviceId;
    else {
      const client = await this.cs.findById(body.clientId);
      return client.device;
    }
  }
}
