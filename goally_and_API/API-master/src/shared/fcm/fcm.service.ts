import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import * as moment from 'moment';
import { Types } from 'mongoose';
import { EnvironmentVariables } from 'src/config';
import { ClientsService } from 'src/entities/clients/clients.service';
import { DevicesService } from 'src/entities/devices/devices.service';
import { STATUS_PLAYED_ROUTINE } from 'src/entities/played-routine/const';
import { UsersService } from 'src/entities/users/users.service';
import { FCM_CLIENT_EVENTS, FCM_USER_EVENTS } from 'src/shared/fcm/const';
import {
  BEHAVIOR_NOTIFICATIONS,
  DEVICE_SERVICE_ACTION,
  REWARD_NOTIFICATIONS,
  ROUTINE_ACTIONS,
  ROUTINE_NOTIFICATIONS,
} from 'src/socket/const';

@Injectable()
export class FcmService {
  private projectId: string;
  private privateKey: string;
  private clientEmail: string;

  constructor(
    private cs: ClientsService,
    @Inject(forwardRef(() => DevicesService)) private ds: DevicesService,
    private us: UsersService,
    private config: ConfigService<EnvironmentVariables>,
  ) {
    this.projectId = this.config.get('FIREBASE_PROJECT_ID');
    this.privateKey = this.config.get('FIREBASE_PRIVATE_KEY');
    this.clientEmail = this.config.get('FIREBASE_CLIENT_EMAIL');

    this.privateKey = Buffer.from(this.privateKey, 'base64').toString();
    console.log('privateKey', this.privateKey);

    const adminConfig = {
      projectId: this.projectId,
      privateKey: this.privateKey.replace(/\\n/g, '\n'),
      clientEmail: this.clientEmail,
    };

    admin.initializeApp({ credential: admin.credential.cert(adminConfig) });
  }

  async sendDataMessage(token: string, data) {
    const options = {
      priority: 'high',
      // dryRun: true,
    };
    const payload = {
      data: this.toString(data),
    };

    const response = await admin
      .messaging()
      .sendToDevice(token, payload, options);

    console.log('fcm data response: ', JSON.stringify(response));
    if (response.results[0].error) {
      // throw new Error(response.results[0].error.message);
      throw new NotFoundException(response.results[0].error.message);
    }
    return { response, token, data };
  }
  toString(o) {
    const dataStringified = {};
    Object.keys(o).forEach(k => {
      dataStringified[k] = typeof o[k] !== 'string' ? o[k].toString() : o[k];
    });
    return dataStringified;
  }
  async sendDisplayMessage(
    token: string,
    notification: { title: string; body: string },
    data: { notificationType: string },
  ) {
    const options = {
      priority: 'high',
      contentAvailable: true,
      mutableContent: true,
      // dryRun: true,
      clickAction: data.notificationType,
    };
    const payload = {
      notification,
      data: this.toString(data),
    };

    const response = await admin
      .messaging()
      .sendToDevice(token, payload, options);

    console.log('fcm display response: ', JSON.stringify(response));
    if (response.results[0].error) {
      throw new Error(response.results[0].error.message);
    }
    return { response, token, notification };
  }

  async sendMessageToClientDevice(clientId: Types.ObjectId, body) {
    const client = await this.cs.findById(clientId);
    if (!client) return new Error('Client not found');
    const device = await this.ds.findById(client.device);
    if (!device) return new Error('Device not found');
    if (!device.fcmToken)
      return new Error('Client Device fcm token is not found');

    return this.sendDataMessage(device.fcmToken, body);
  }

  async sendMessageToDevice(deviceId: Types.ObjectId, body) {
    const device = await this.ds.findById(deviceId);
    if (!device) return new Error('Device not found');
    if (!device.fcmToken)
      return new Error('Client Device fcm token is not found');

    return this.sendDataMessage(device.fcmToken, body);
  }

  async sendOfflineMessageToDevice(deviceId, action, body) {
    console.log(deviceId, 'device offline trying to send fcm');

    if (deviceId && body) {
      switch (action) {
        case REWARD_NOTIFICATIONS.REDEEMED_REWARDS_CHANGED: {
          if (body.action && body.action == 'CREATED') {
            const fcmInfo = await this.sendMessageToDevice(deviceId, {
              [FCM_CLIENT_EVENTS.REWARD_REDEEMED]: body.reward.rewardId,
            });
            console.log('response', fcmInfo);
          }
          break;
        }
        case BEHAVIOR_NOTIFICATIONS.RECORDED_BEHAVIOR_CHANGED: {
          if (body.action && body.action == 'CREATED') {
            const fcmInfo = await this.sendMessageToDevice(deviceId, {
              [FCM_CLIENT_EVENTS.BEHAVIOR_RECORDED]: body.behavior.behaviorId,
            });
            console.log('response', fcmInfo);
          }
          break;
        }
        case DEVICE_SERVICE_ACTION.EVENT_DEVICE_LOGS_SYNC: {
          const fcmInfo = await this.sendMessageToDevice(deviceId, {
            [FCM_CLIENT_EVENTS.SYNC_LOGS]: body.clientId,
          });
          console.log('response', fcmInfo);
          break;
        }
      }
    }

    const fcmInfo = await this.sendMessageToDevice(deviceId, {
      [FCM_CLIENT_EVENTS.SLEEP_MODE]: false,
    });
    console.log(fcmInfo);
  }

  async sendMessageToUserDevice(
    userId: Types.ObjectId,
    notification,
    notificationType,
  ) {
    const user = await this.us.findById(userId);
    if (!user) return new Error('User not found');
    if (!user.fcmToken) return 'User device fcm token does not exists';
    return this.sendDisplayMessage(
      user.fcmToken,
      notification,
      notificationType,
    );
  }

  async sendOfflineMessageToUser(userId, action, body) {
    console.log('user offline trying to send fcm');

    try {
      if (userId && body) {
        switch (action) {
          case REWARD_NOTIFICATIONS.REDEEMED_REWARDS_CHANGED: {
            console.log('reward redeemed fcm body', body);
            if (body.action && body.action == 'CREATED') {
              const client = await this.cs.findById(body.reward.clientId);
              const createdAt = moment(body.reward.createdAt);
              const date = createdAt
                .tz(client.timezone || 'UTC')
                .format('MMM DD');
              const time = createdAt
                .tz(client.timezone || 'UTC')
                .format('hh:mm a');
              const fcmInfo = await this.sendMessageToUserDevice(
                userId,
                {
                  title: `${client.firstName} ${client.lastName ||
                    ''} redeemed ${body.reward.name} reward`,
                  body: `${client.firstName} ${client.lastName ||
                    ''} redeemed ${
                    body.reward.name
                  } reward at ${time} on ${date}`,
                },
                {
                  notificationType: FCM_USER_EVENTS.REWARD_REDEEMED,
                  rewardId: body.reward._id,
                  clientId: client._id,
                },
              );
              console.log(fcmInfo);
            }
            break;
          }
          case ROUTINE_ACTIONS.ACTIVE_ROUTINE_CHANGED: {
            console.log('routine started fcm body', body);
            if (
              body.activeRoutine &&
              body.activeRoutine.status ==
                STATUS_PLAYED_ROUTINE.SHOW_WELCOME_SCREEN
            ) {
              const client = await this.cs.findById(body.clientId);
              const fcmInfo = await this.sendMessageToUserDevice(
                userId,
                {
                  title: `${client.firstName} ${client.lastName ||
                    ''} started ${body.activeRoutine.routine.name} routine`,
                  body: `Click here to see ${
                    client.firstName
                  } ${client.lastName || ''} progress on the ${
                    body.activeRoutine.routine.name
                  } routine`,
                },
                {
                  notificationType: FCM_USER_EVENTS.ROUTINE_STARTED,
                  routineId: body.activeRoutine.routine._id,
                  clientId: client._id,
                },
              );
              console.log(fcmInfo);
            }
            break;
          }
          case ROUTINE_NOTIFICATIONS.ROUTINE_COMPLETED: {
            console.log('routine completed fcm body', body);
            if (body.action && body.action == 'CREATED') {
              const client = await this.cs.findById(body.routine.clientId);
              const createdAt = moment(body.routine.createdAt);
              const date = createdAt
                .tz(client.timezone || 'UTC')
                .format('MMM DD');
              const time = createdAt
                .tz(client.timezone || 'UTC')
                .format('hh:mm a');
              const fcmInfo = await this.sendMessageToUserDevice(
                userId,
                {
                  title: `${client.firstName} ${client.lastName ||
                    ''} completed ${body.routine.routine.name} routine`,
                  body: `${client.firstName} ${client.lastName ||
                    ''} completed ${
                    body.routine.routine.name
                  } routine at ${time} on ${date}`,
                },
                {
                  notificationType: FCM_USER_EVENTS.ROUTINE_COMPLETE,
                  routineId: body.routine.routine._id,
                  clientId: client._id,
                },
              );
              console.log(fcmInfo);
            }
            break;
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
}
