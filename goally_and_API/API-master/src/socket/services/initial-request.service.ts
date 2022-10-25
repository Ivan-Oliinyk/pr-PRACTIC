import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CompletedChecklistsService } from 'src/entities/completed-checklists/completed-checklists.service';
import { CompletedSleepModeService } from 'src/entities/completed-sleep-mode/completed-sleep-mode.service';
import { Device } from 'src/entities/devices/schemas';
import { PlayedRoutineService } from 'src/entities/played-routine/played-routine.service';
import { User } from 'src/entities/users/schema';
import {
  CHECKLIST_ACTIONS,
  ROUTINE_ACTIONS,
  SLEEP_MODE_ACTIONS,
} from '../const';
import { SocketBase } from '../socket-base.gateway';

@Injectable()
export class InitWebSocketPushes {
  constructor(
    private playedRoutineService: PlayedRoutineService,
    private completedChecklistService: CompletedChecklistsService,
    private completedSleepModeService: CompletedSleepModeService,
    private baseSocket: SocketBase,
  ) {}

  async getUserActiveRoutine(clients: Types.ObjectId[]) {
    const clientRoutine = await Promise.all(
      clients.map(e =>
        this.playedRoutineService.getPlayedRoutineByClientIdV2(e),
      ),
    );
    return clientRoutine;
  }
  async getUserActiveChecklist(clients: Types.ObjectId[]) {
    const clientChecklist = await Promise.all(
      clients.map(e =>
        this.completedChecklistService.getActiveChecklistByClientIdV2(e),
      ),
    );
    return clientChecklist;
  }
  async getUserActiveSleepMode(clients: Types.ObjectId[]) {
    const clientSleepMode = await Promise.all(
      clients.map(e =>
        this.completedSleepModeService.getActiveSleepModeByClientIdV2(e),
      ),
    );
    return clientSleepMode;
  }
  async initialPushesRoutine(user: User, socketID: string) {
    const userActiveRoutine = await this.getUserActiveRoutine(
      user.clients as Types.ObjectId[],
    );
    await Promise.all(
      userActiveRoutine.map(e => {
        return this.baseSocket.sendToSocketId(
          socketID,
          ROUTINE_ACTIONS.ACTIVE_ROUTINE_CHANGED,
          {
            activeRoutine: e.playedRoutine,
            clientId: e.clientId,
          },
        );
      }),
    );
  }
  async initialPushesChecklist(user: User, socketID: string) {
    const userActiveChecklist = await this.getUserActiveChecklist(
      user.clients as Types.ObjectId[],
    );
    await Promise.all(
      userActiveChecklist.map(e => {
        return this.baseSocket.sendToSocketId(
          socketID,
          CHECKLIST_ACTIONS.ACTIVE_CHECKLIST_CHANGED,
          {
            activeChecklist: e.completedChecklist,
            clientId: e.clientId,
          },
        );
      }),
    );
  }
  async initialPushesSleepMode(user: User, socketID: string) {
    const userActiveSleepMode = await this.getUserActiveSleepMode(
      user.clients as Types.ObjectId[],
    );
    await Promise.all(
      userActiveSleepMode.map(e => {
        return this.baseSocket.sendToSocketId(
          socketID,
          SLEEP_MODE_ACTIONS.ACTIVE_SLEEP_MODE_CHANGED,
          {
            activeSleepMode: e.completedSleepMode,
            clientId: e.clientId,
          },
        );
      }),
    );
  }

  async initialDevicePushes(device: Device, socketID: string) {
    //TODO: temporary for testing
    return;
    if (!device.client) return null;
    const deviceActiveRoutine = await this.playedRoutineService.getPlayedRoutineByDeviceId(
      device._id,
    );
    return await this.baseSocket.sendToSocketId(
      socketID,
      ROUTINE_ACTIONS.ACTIVE_ROUTINE_CHANGED,
      {
        activeRoutine: deviceActiveRoutine,
      },
    );
  }
}
