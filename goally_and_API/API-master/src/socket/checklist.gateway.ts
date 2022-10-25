import { UsePipes } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { InjectEventEmitter } from 'nest-emitter';
import { ClientsService } from 'src/entities/clients/clients.service';
import { CompletedChecklistsService } from 'src/entities/completed-checklists/completed-checklists.service';
import {
  INITIATOR,
  STATUS_PLAYED_CHECKLIST,
} from 'src/entities/completed-checklists/const';
import {
  CreateCompletedChecklist,
  CreateCompletedChecklistRequest,
  UpdateCompletedChecklistActivityWebPortal,
} from 'src/entities/completed-checklists/dto/CreateCompletedChecklist.dto';
import { PlayOrPauseActivityDto } from 'src/entities/played-routine/dto/CreatePlayedRoutine.dto';
import { UsersService } from 'src/entities/users/users.service';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { FCM_CLIENT_EVENTS } from 'src/shared/fcm/const';
import { FcmService } from 'src/shared/fcm/fcm.service';
import { AuthenticatedSocket } from './adapter/socket-redis.adapter';
import { CHECKLIST_ACTIONS } from './const';
import { SocketValidationPipe } from './filterts';
import { RealTimeChecklistService } from './services/realtime-checklist.service';
import { SocketBase } from './socket-base.gateway';

@UsePipes(new SocketValidationPipe())
@WebSocketGateway(null, { transports: ['websocket'] })
export class ChecklistGateway {
  constructor(
    private us: UsersService,
    private cs: ClientsService,
    private ccs: CompletedChecklistsService,
    private baseSocket: SocketBase,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private realTimeCheckService: RealTimeChecklistService,
    private fcmService: FcmService,
  ) {}

  @SubscribeMessage(CHECKLIST_ACTIONS.WP_REQUEST_TO_PLAY_CHECKLIST)
  async onWpChecklistStart(
    @MessageBody() body: CreateCompletedChecklistRequest,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    try {
      const socketId = await this.getSocketId(body);
      const activeChecklists = await this.ccs.getActiveChecklistsByClientId(
        body.clientId,
      );
      if (activeChecklists.length === 1)
        return {
          error: 'Another checklist is currently running',
          checklistId: activeChecklists[0].checklistId,
        };
      if (activeChecklists.length > 1) {
        await this.ccs.stopAllActiveChecklistForClient(body.clientId);
      }
      if (!socketId) {
        try {
          let response;
          if (body.deviceId)
            response = await this.fcmService.sendMessageToDevice(
              body.deviceId,
              { [FCM_CLIENT_EVENTS.START_CHECKLIST]: body.checklistId },
            );
          else
            response = await this.fcmService.sendMessageToClientDevice(
              body.clientId,
              { [FCM_CLIENT_EVENTS.START_CHECKLIST]: body.checklistId },
            );

          return {
            error: 'Device in sleep mode 💤 we are waking him up 😃!',
            meta: response,
          };
        } catch (e) {
          return {
            error: 'Device might be offline',
          };
        }
      }

      const activeChecklist = await this.ccs.saveWelcomeScreenChecklist(
        body,
        INITIATOR.USER,
        await this.getDeviceId(body),
      );

      this.emitter.emit('ActiveChecklistChangedNotifyDevice', {
        checklist: activeChecklist,
        clientId: body.clientId,
        socketId,
      });

      this.emitter.emit('ActiveChecklistChangedNotifyWebPortal', {
        checklist: activeChecklist,
        clientId: body.clientId,
      });

      return { activeChecklist };
    } catch (e) {
      return { error: e.message };
    }
  }
  @SubscribeMessage(CHECKLIST_ACTIONS.DEVICE_OPEN_WELCOME_CHECKLIST_SCREEN)
  async onDeviceOpenWelcomeChecklistScreen(
    @MessageBody() body: CreateCompletedChecklist,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    try {
      const completedChecklist = await this.ccs.getActiveChecklistByDeviceId(
        socket.device._id,
      );

      if (completedChecklist) {
        if (
          completedChecklist.status ===
          STATUS_PLAYED_CHECKLIST.SHOW_WELCOME_SCREEN
        ) {
          await this.ccs.stopWelcomeScreenChecklist(socket.device._id);
        } else {
          await this.realTimeCheckService.stopChecklist(completedChecklist);
        }
      }

      const activeChecklist = await this.ccs.saveWelcomeScreenChecklist(
        body,
        INITIATOR.CLIENT,
        socket.device._id,
      );

      this.emitter.emit('ActiveChecklistChangedNotifyWebPortal', {
        checklist: activeChecklist,
        clientId: activeChecklist.clientId,
      });

      return {
        activeChecklist,
      };
    } catch (e) {
      return { error: e.message };
    }
  }
  @SubscribeMessage(CHECKLIST_ACTIONS.DEVICE_START_CHECKLIST)
  async onDeviceStartChecklist(
    @MessageBody() body: CreateCompletedChecklist,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    try {
      const playedChecklist = await this.ccs.getActiveChecklistByDeviceId(
        socket.device._id,
      );
      if (
        playedChecklist &&
        playedChecklist.checklistId.toString() !== body.checklistId.toString()
      ) {
        console.log(playedChecklist.checklistId);
        console.log(body.checklistId);
        return {
          error: `You are trying to run checklist ${body.checklistId} but ${playedChecklist?.checklistId} is playing now with status ${playedChecklist?.status}`,
        };
      }
      const activeChecklist = await this.realTimeCheckService.startChecklistAfterWelcomeScreen(
        playedChecklist,
      );

      this.emitter.emit('ActiveChecklistChangedNotifyWebPortal', {
        checklist: activeChecklist,
        clientId: activeChecklist.clientId,
      });
      console.log('sending_finished');

      return {
        activeChecklist,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  @SubscribeMessage(CHECKLIST_ACTIONS.DEVICE_COMPLETE_CHECKLIST_ACTIVITY)
  async onDeviceActivityComplete(
    @MessageBody() body: PlayOrPauseActivityDto,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    try {
      const playedChecklist = await this.ccs.getActiveChecklistByDeviceId(
        socket.device._id,
      );
      const activeChecklist = await this.realTimeCheckService.completeActivity(
        playedChecklist,
        body.activityId,
      );

      this.emitter.emit('ActiveChecklistChangedNotifyWebPortal', {
        checklist: activeChecklist,
        clientId: activeChecklist.clientId,
      });
      return {
        activeChecklist,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  @SubscribeMessage(CHECKLIST_ACTIONS.WP_COMPLETE_CHECKLIST_ACTIVITY)
  async onWpActivityComplete(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() body: UpdateCompletedChecklistActivityWebPortal,
  ) {
    try {
      const socketId = await this.getSocketId(body);
      const playedChecklist = await this.ccs.getActiveChecklistById(
        body.checklistId,
      );
      if (!playedChecklist)
        return `Checklist with id ${body.checklistId} not playing`;
      const activeChecklist = await this.realTimeCheckService.completeActivity(
        playedChecklist,
        body.activityId,
      );
      socketId &&
        this.emitter.emit('ActiveChecklistChangedNotifyDevice', {
          checklist: activeChecklist,
          socketId,
          clientId: activeChecklist.clientId,
        });

      this.emitter.emit('ActiveChecklistChangedNotifyWebPortal', {
        checklist: activeChecklist,
        clientId: activeChecklist.clientId,
      });

      return {
        activeChecklist,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  @SubscribeMessage(CHECKLIST_ACTIONS.WP_STOP_CHECKLIST)
  async onWpChecklistStop(
    @MessageBody() body: CreateCompletedChecklistRequest,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    try {
      const socketId = await this.getSocketId(body);
      const playedChecklist = await this.ccs.getActiveChecklistById(
        body.checklistId,
      );
      if (!playedChecklist)
        return `Checklist with id ${body.checklistId} not played`;
      const activeChecklist = await this.realTimeCheckService.stopChecklist(
        playedChecklist,
      );
      socketId &&
        this.emitter.emit('ActiveChecklistChangedNotifyDevice', {
          checklist: activeChecklist,
          clientId: activeChecklist.clientId,
          socketId,
        });

      this.emitter.emit('ActiveChecklistChangedNotifyWebPortal', {
        checklist: activeChecklist,
        clientId: activeChecklist.clientId,
      });
      return {
        activeChecklist,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  @SubscribeMessage(CHECKLIST_ACTIONS.DEVICE_STOP_CHECKLIST)
  async onDeviceStopChecklist(@ConnectedSocket() socket: AuthenticatedSocket) {
    try {
      const checklist = await this.ccs.getActiveChecklistByDeviceId(
        socket.device._id,
      );
      if (!checklist) return `Client does not have any active routine`;

      const activeChecklist = await this.realTimeCheckService.stopChecklist(
        checklist,
      );

      this.emitter.emit('ActiveChecklistChangedNotifyWebPortal', {
        checklist: activeChecklist,
        clientId: activeChecklist.clientId,
      });
      return {
        activeChecklist,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  @SubscribeMessage(CHECKLIST_ACTIONS.WP_START_NEXT_CHECKLIST_ACTIVITY)
  async onWpStartActivityNext(
    @MessageBody() body: UpdateCompletedChecklistActivityWebPortal,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    try {
      const socketId = await this.getSocketId(body);
      const playedChecklist = await this.ccs.getActiveChecklistById(
        body.checklistId,
      );
      if (!playedChecklist)
        return `Checklist with id ${body.checklistId} not playing`;

      const activeChecklist = await this.realTimeCheckService.startActivityNext(
        playedChecklist,
        body.activityId,
      );

      socketId &&
        this.emitter.emit('ActiveChecklistChangedNotifyDevice', {
          checklist: activeChecklist,
          clientId: activeChecklist.clientId,
          socketId,
        });

      this.emitter.emit('ActiveChecklistChangedNotifyWebPortal', {
        checklist: activeChecklist,
        clientId: activeChecklist.clientId,
      });

      return {
        activeChecklist,
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
