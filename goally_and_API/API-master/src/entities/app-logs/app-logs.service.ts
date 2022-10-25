import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { pick } from 'lodash';
import { PaginateModel, Types } from 'mongoose';
import { ClientsService } from '../clients/clients.service';
import { Client } from '../clients/schema/client.schema';
import { UsersService } from '../users/users.service';
import { ACTION_TYPE, AppLogs, LOGS_TYPE } from './schema/app-logs.schema';

@Injectable()
export class AppLogsService {
  clientPopulate: { path: string; model: string; select: string };
  constructor(
    @InjectModel(AppLogs.name) private AppLogs: PaginateModel<AppLogs>,
    private userService: UsersService,
    private clientService: ClientsService,
  ) {
    this.clientPopulate = {
      path: 'client',
      model: 'Client',
      select: ['firstName', 'lastName', ' -_id'].join(' '),
    };
  }

  async create(data: {
    action: ACTION_TYPE;
    entity: LOGS_TYPE;
    user: Types.ObjectId;
    client: Types.ObjectId | null;
    meta: any;
  }) {
    const log = new this.AppLogs(data);
    const savedLog = await log.save();
    return savedLog;
  }

  async getLogsByClient(
    client: Types.ObjectId,
    user: Types.ObjectId,
    page: number,
  ) {
    const userFromDb = await this.userService.findById(user);
    const clientFromDb = await this.clientService.findById(client);

    const logs = await this.AppLogs.paginate(
      {
        entity: { $in: Object.values(LOGS_TYPE) },
        client: { $in: [client, null] },
        user,
      },
      { sort: '-createdAt', page, populate: this.clientPopulate },
    );
    logs.docs = this.transformLogs(logs.docs);
    return {
      logs,
      user: pick(userFromDb, ['firstName', 'lastName']),
      client: pick(clientFromDb, ['firstName', 'lastName']),
    };
  }

  async getLogsByUser(user: Types.ObjectId, page: number) {
    const userFromDb = await this.userService.findById(user);

    const logs = await this.AppLogs.paginate(
      {
        entity: { $in: Object.values(LOGS_TYPE) },
        user,
      },
      {
        sort: '-createdAt',
        page,
        populate: this.clientPopulate,
      },
    );
    logs.docs = this.transformLogs(logs.docs);
    return {
      logs,
      user: pick(userFromDb, ['firstName', 'lastName']),
    };
  }

  transformLogs(logs: AppLogs[]): any {
    return logs.map(e => {
      return { ...e.toObject(), text: this.getTexByLog(e) };
    });
  }
  getTexByLog(log: AppLogs): string {
    const client: Client = log.client as Client;
    if (log.entity === LOGS_TYPE.SESSION) {
      if (log.action === ACTION_TYPE.CREATE) {
        return 'User logged in';
      }
      if (log.action === ACTION_TYPE.DELETE) {
        return 'User logged out';
      }
    }
    if (log.entity === LOGS_TYPE.REPORTS) {
      const reportName = Array.isArray(log.meta.name)
        ? log.meta.name
            .map(e => {
              if (e.name) return e.name.toString();
              if (e.question) return e.question.toString();

              return e;
            })
            .toString()
        : '';
      if (log.action === ACTION_TYPE.READ) {
        return `User watched ${log.meta.reportName} ${reportName} ${
          log.meta.from ? `${log.meta.from} - ${log.meta.to}` : ''
        } for child ${client.firstName} ${client.lastName}`;
      }
    }
    if (log.entity === LOGS_TYPE.BEHAVIORS) {
      if (log.action === ACTION_TYPE.CREATE) {
        if (log.client)
          return `User added behavior ${log.meta.behavior.name} to the child library`;
        else
          return `User created behavior ${log.meta.behavior.name} to the child library`;
      }
      if (log.action === ACTION_TYPE.UPDATE) {
        if (log.client)
          return `User updated child behavior ${log.meta.newBehavior?.name}`;
        else return `User updated behavior ${log.meta.newBehavior?.name}`;
      }
      if (log.action === ACTION_TYPE.DELETE) {
        if (log.client)
          return `User removed behavior ${log.meta.behavior.name} from the child library`;
        else return `User removed behavior ${log.meta.behavior.name}`;
      }
    }
    if (log.entity === LOGS_TYPE.BEHAVIOR_TRAININGS) {
      if (log.action === ACTION_TYPE.CREATE) {
        if (log.client)
          return `User added behavior skill training  ${log.meta.behaviorTraining.name} to the child library`;
        else
          return `User created behavior skill training ${log.meta.behaviorTraining.name} to the child library`;
      }
      if (log.action === ACTION_TYPE.UPDATE) {
        if (log.client)
          return `User updated child behavior skill training ${log.meta.newBehaviorTraining?.name}`;
        else
          return `User updated behavior skill training ${log.meta.newBehaviorTraining?.name}`;
      }
      if (log.action === ACTION_TYPE.DELETE) {
        if (log.client)
          return `User removed behavior skill training ${log.meta.behaviorTraining.name} from the child library`;
        else
          return `User removed behavior skill training ${log.meta.behaviorTraining.name}`;
      }
    }
    if (log.entity === LOGS_TYPE.REWARDS) {
      if (log.action === ACTION_TYPE.CREATE) {
        if (log.client)
          return `User added reward ${log.meta.reward.name} to the child library`;
        else
          return `User created reward ${log.meta.reward.name} to the child library`;
      }
      if (log.action === ACTION_TYPE.UPDATE) {
        if (log.client)
          return `User updated child reward ${log.meta.newReward?.name}`;
        else return `User updated reward ${log.meta.newReward?.name}`;
      }
      if (log.action === ACTION_TYPE.DELETE) {
        if (log.client)
          return `User removed reward ${log.meta.reward.name} from the child library`;
        else return `User removed reward ${log.meta.reward.name}`;
      }
    }
    if (log.entity === LOGS_TYPE.ROUTINES) {
      if (log.action === ACTION_TYPE.CREATE) {
        if (log.client)
          return `User added routine ${log.meta.routine.name} to the child library`;
        else
          return `User created routine ${log.meta.routine.name} to the library`;
      }
      if (log.action === ACTION_TYPE.UPDATE) {
        if (log.client)
          return `User updated child routine ${log.meta.newRoutine?.name}`;
        else return `User updated routine ${log.meta.newRoutine?.name}`;
      }
      if (log.action === ACTION_TYPE.DELETE) {
        if (log.client)
          return `User removed routine ${log.meta.removeRoutine?.name} from the child library`;
        else return `User removed routine ${log.meta.removeRoutine?.name}`;
      }
    }
    if (log.entity === LOGS_TYPE.CLIENTS) {
      if (log.action === ACTION_TYPE.UPDATE) {
        if (log.client)
          return `User updated ${client.firstName} ${client.lastName} client info`;
      }
    }
    if (log.entity === LOGS_TYPE.USERS_WITH_ACCESS) {
      if (log.action === ACTION_TYPE.DELETE)
        return `User removed ${log.meta ? log.meta.email : ''} access to the ${
          client.firstName
        } ${client.lastName} client`;
    }
    if (log.entity === LOGS_TYPE.INVITES) {
      if (log.action === ACTION_TYPE.DELETE)
        return `User removed ${log.meta ? log.meta.email : ''} invite to the ${
          client.firstName
        } ${client.lastName} client`;
      if (log.action === ACTION_TYPE.CREATE)
        return `User invited ${log.meta ? log.meta.email : ''}`;
    }

    if (log.entity === LOGS_TYPE.BILLINGS) {
      if (
        log.action === ACTION_TYPE.CREATE ||
        log.action === ACTION_TYPE.UPDATE
      )
        return `User updated payment method `;
      if (log.action === ACTION_TYPE.TAKE_OVER_BILLING)
        return `User took over billing for ${client.firstName} ${client.lastName} client `;
    }

    if (log.entity === LOGS_TYPE.SUBSCRIPTION) {
      const logPrice = log.meta.newValue
        ? log.meta.newValue.prices
        : log.meta.prices;
      const prices = logPrice
        .map(e => e.priceId.replace(/_/g, ' ').toUpperCase())
        .toString();
      if (log.action === ACTION_TYPE.CREATE)
        return `User bought subscription: ${prices}`;
      if (log.action === ACTION_TYPE.UPDATE) {
        return `User update subscription: ${prices}`;
      }
    }
    if (log.entity === LOGS_TYPE.DEVICE) {
      if (log.action === ACTION_TYPE.RESTART) return `User restarted device `;
      if (log.action === ACTION_TYPE.RESET) return `User hard reseted device `;
    }
  }
}
