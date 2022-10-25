import { UsePipes } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway
} from '@nestjs/websockets';
import { InjectEventEmitter } from 'nest-emitter';
import { CreateCompletedReminderRequest } from 'src/entities/completed-reminders/dto/CompleteReminder.dto';
import { RemindersService } from 'src/entities/reminders/reminders.service';
import { UsersService } from 'src/entities/users/users.service';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { FCM_CLIENT_EVENTS } from 'src/shared/fcm/const';
import { FcmService } from 'src/shared/fcm/fcm.service';
import { AuthenticatedSocket } from './adapter/socket-redis.adapter';
import { REMINDER_ACTIONS } from './const';
import { SocketValidationPipe } from './filterts';
import { SocketBase } from './socket-base.gateway';

@UsePipes(new SocketValidationPipe())
@WebSocketGateway(null, { transports: ['websocket'] })
export class ReminderGateway {
  constructor(
    private us: UsersService,
    private rs: RemindersService,
    private baseSocket: SocketBase,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private fcmService: FcmService,
  ) {}

  @SubscribeMessage(REMINDER_ACTIONS.WP_REQUEST_TO_PLAY_REMINDER)
  async onWpReminderStart(
    @MessageBody() body: CreateCompletedReminderRequest,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log('onWpReminderStart');
    console.log(JSON.stringify(body));

    try {
      const socketId = await this.getSocketId(body);
      if (!socketId) {
        try {
          let response;
          if (body.deviceId)
            response = await this.fcmService.sendMessageToDevice(
              body.deviceId,
              { [FCM_CLIENT_EVENTS.START_REMINDER]: body.reminderId },
            );
          else
            response = await this.fcmService.sendMessageToClientDevice(
              body.clientId,
              { [FCM_CLIENT_EVENTS.START_REMINDER]: body.reminderId },
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

      const activeReminder = await this.rs.findById(body.reminderId);

      this.emitter.emit('ActiveReminderChangedNotifyDevice', {
        reminder: activeReminder,
        clientId: body.clientId,
        socketId,
      });

      this.emitter.emit('ActiveReminderChangedNotifyWebPortal', {
        reminder: activeReminder,
        clientId: body.clientId,
      });

      return { activeReminder };
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
}
