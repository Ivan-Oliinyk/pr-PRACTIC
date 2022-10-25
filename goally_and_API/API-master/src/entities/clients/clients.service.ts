import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as BB from 'bluebird';
import { find, map, pick } from 'lodash';
import * as moment from 'moment';
import { Model, Types } from 'mongoose';
import * as PaginateModel from 'mongoose-aggregate-paginate-v2';
import { InjectEventEmitter } from 'nest-emitter';
import { EnvironmentVariables } from 'src/config';
import { User } from 'src/entities/users/schema';
import { UsersService } from 'src/entities/users/users.service';
import { TEMP_UNITS, TILE_URLS } from 'src/shared/const';
import { DIAGNOSIS } from 'src/shared/const/client-diagnosis';
import { CLIENT_THEMES } from 'src/shared/const/client-themes';
import { WORK_GOALS } from 'src/shared/const/client-work-goals';
import { TIME_FORMAT, TYPES } from 'src/shared/const/routine-type';
import { CLIENT_SEARCH_FIELDS } from 'src/shared/const/stat-search-fields';
import { CLIENT_SORT_FIELDS } from 'src/shared/const/stat-sort-fields';
import { USER_PLANS } from 'src/shared/const/user-plans';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { isDuplicateMongoError } from 'src/shared/helper';
import { getTimeZoneByAddress } from 'src/utils/getTimeZoneByAddress';
import { AdminConfigService } from '../admin-config/admin-config.service';
import { ACTION_TYPE, LOGS_TYPE } from '../app-logs/schema/app-logs.schema';
import { ChecklistsService } from '../checklists/checklists.service';
import { ClientFeatureAccessService } from '../client-feature-access/client-feature-access.service';
import { DevicesService } from '../devices/devices.service';
import { Device } from '../devices/schemas';
import { GameConfigsService } from '../game-configs/game-configs.service';
import { InvitationService } from '../invitation/invitation.service';
import { LabWordsService } from '../lab-words/lab-words.service';
import { PuzzlesService } from '../puzzles/puzzles.service';
import { ReferralsService } from '../referrals/referrals.service';
import { RemindersService } from '../reminders/reminders.service';
import { RewardsService } from '../rewards/rewards.service';
import { ScheduleDto } from '../routines/dto/ScheduleDto';
import { RoutinesService } from '../routines/routines.service';
import { SoundsService } from '../sounds/sounds.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { AacConfigDto } from './dto/AacConfigDto';
import { BalloonConfigDto } from './dto/BalloonConfigDto';
import { CreateClientDto } from './dto/CreateClientDto';
import {
  CreateOnboardingClientsDto,
  OnboardingClientsDto,
} from './dto/CreateClientsDto';
import { EntityNameDto } from './dto/EntityNameDto';
import { ThemeConfigDto } from './dto/ThemeConfigDto';
import {
  MovingEntityDto,
  UpdateCtaOrderingDto,
} from './dto/UpdateCtaOrderingDto';
import { Client } from './schema/client.schema';
@Injectable()
export class ClientsService {
  baseUrl;

  async createMultiple(clientData: CreateOnboardingClientsDto, user: User) {
    const clients = await Promise.all(
      clientData.clients.map(async (e: OnboardingClientsDto) => {
        if ('address' in e.meta) {
          e.timezone =
            (await getTimeZoneByAddress(e.meta.address)) || e.timezone;
        }
        const client = new this.ClientModel({
          ...e,
        });

        return client.save();
      }),
    );
    clients.map(e => user.clients.push(e._id));
    await user.save();
    return clients;
  }
  constructor(
    @InjectModel(Client.name) public ClientModel: Model<Client>,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private userService: UsersService,
    private subscriptionService: SubscriptionService,
    private invitationService: InvitationService,
    private clientFeatureService: ClientFeatureAccessService,
    @Inject(forwardRef(() => SoundsService))
    private soundService: SoundsService,
    @Inject(forwardRef(() => RewardsService))
    private rewardService: RewardsService,
    @Inject(forwardRef(() => RoutinesService))
    private routineService: RoutinesService,
    @InjectModel(Client.name)
    private PaginatedModel: PaginateModel<Client>,
    private puzzleServices: PuzzlesService,
    private acService: AdminConfigService,
    private referralService: ReferralsService,
    private config: ConfigService<EnvironmentVariables>,
    @Inject(forwardRef(() => DevicesService))
    private deviceService: DevicesService,
    private gcs: GameConfigsService,
    @Inject(forwardRef(() => RemindersService))
    private rs: RemindersService,
    @Inject(forwardRef(() => ChecklistsService))
    private cs: ChecklistsService,
    private lws: LabWordsService,
  ) {
    this.baseUrl = this.config.get('FE_BASE_URL');
  }
  async create(clientData: CreateClientDto, parent: User): Promise<any> {
    try {
      let plan = USER_PLANS.FREE;
      if (clientData.isSiteLicense) {
        plan = USER_PLANS.SITE_LICENSE;
      }

      let notAppliedSubscription = null;
      //if subscription is provided, then apply that specific client subscription
      if (clientData.subscriptionId)
        notAppliedSubscription = await this.subscriptionService.getUserNotAppliedSubscriptionById(
          parent,
          clientData.subscriptionId,
        );
      else
        notAppliedSubscription = await this.subscriptionService.getUserNotAppliedSubscription(
          parent,
        );

      if (!notAppliedSubscription && !clientData.isSiteLicense) {
        throw new BadRequestException(`Please purchase lincense to add user`);
      } else if (clientData.isSiteLicense && !parent.isSiteLicense)
        throw new BadRequestException(
          `${parent.firstName} ${parent.lastName} is not allowed to add site license clients`,
        );

      const client = new this.ClientModel({
        ...clientData,
        country: parent.country,
        postalCode: parent.postalCode,
        puzzlePieces: 8,
        plan,
      });
      const clientFromDb = await client.save();
      const user = await this.userService.addClientToUser(
        clientFromDb._id,
        parent._id,
      );

      if (notAppliedSubscription && !clientData.isSiteLicense) {
        await this.subscriptionService.updateUserSubscription(
          notAppliedSubscription._id,
          { client: clientFromDb._id },
        );

        if (notAppliedSubscription.shippingAddress) {
          clientFromDb.timezone =
            (await getTimeZoneByAddress(
              notAppliedSubscription.shippingAddress,
            )) || clientFromDb.timezone;
          await clientFromDb.save();
        }
      }

      const clientSubscription = await this.subscriptionService.getGoallySubscriptionByClient(
        client._id,
      );
      if (clientSubscription && !clientData.isSiteLicense) {
        plan = Object.values(USER_PLANS).find(
          plan => plan == clientSubscription.sku,
        );
        clientFromDb.plan = plan;
        await clientFromDb.save();
      }

      await this.clientFeatureService.create(clientFromDb._id, plan);
      await this.soundService.createPredefinedSounds(client);
      await this.routineService.createAdminClientRoutines(
        parent,
        clientFromDb._id,
      );
      await this.rewardService.createAdminClientRewards(
        parent,
        clientFromDb._id,
      );
      await this.addClientPuzzles(clientFromDb);
      await this.gcs.createPredefinedGameConfig(clientFromDb._id);
      await this.lws.createPredefinedLabWords(clientFromDb._id);

      if (clientData.isSiteLicense && !client.device)
        await this.addSiteLicenseDevice(client, user, false);

      return clientFromDb;
    } catch (e) {
      if (isDuplicateMongoError(e.code)) {
        throw new BadRequestException(
          `Device ${clientData.device} already connected to the child`,
        );
      } else throw new BadRequestException(e);
    }
  }
  async update(
    id: Types.ObjectId,
    clientData: Partial<Client>,
    userId: Types.ObjectId | null,
  ) {
    const oldClient = await this.ClientModel.findById(id);
    const client = await this.ClientModel.findByIdAndUpdate(id, clientData, {
      new: true,
    });
    if (userId) {
      this.emitter.emit('CreateLog', {
        entity: LOGS_TYPE.CLIENTS,
        action: ACTION_TYPE.UPDATE,
        meta: { oldClient, client },
        user: userId,
        client: client._id,
      });
    }
    return this.findByIdFull(id);
  }

  async addDevice(id: Types.ObjectId, clientData: Partial<Client>, user: User) {
    if (!clientData.device)
      throw new BadRequestException(`No device is given in object`);

    if (!clientData.deviceName)
      throw new BadRequestException(`No device name is given in object`);

    let clientFromDb = await this.findByIdFull(id);
    //second device for client is being added
    if (clientFromDb.device) {
      const existingSubscription = await this.subscriptionService.getGoallySubscriptionByClientAndPayer(
        clientFromDb._id,
        user._id,
      );
      //handle all existing FREE client to add second device as per requirements.
      if (
        !existingSubscription &&
        (((clientFromDb.device as any) as Device).userId.toString() !=
          user._id.toString() ||
          user.isSiteLicense)
      ) {
        const subscription = await this.subscriptionService.getUserNotAppliedSubscription(
          user,
        );
        if (subscription) {
          await this.subscriptionService.updateUserSubscription(
            subscription._id,
            { client: clientFromDb._id },
          );

          //save subscription plan in client
          const plan = Object.values(USER_PLANS).find(
            plan => plan == subscription.sku,
          );
          clientFromDb.plan = plan;
          await clientFromDb.save();
        } else
          throw new BadRequestException(
            `Please purchase lincense to add user device`,
          );
      }
    } else clientFromDb = await this.update(id, clientData, user._id);

    if (clientData.device) {
      //add active client to device as well as client in clients list
      await this.deviceService.addClientToDevice(
        clientFromDb._id,
        clientData.device,
        clientData.deviceName,
      );
      await this.deviceService.addActiveClientToDevice(
        clientFromDb._id,
        clientData.device,
      );
      await this.deviceService.addUserToDevice(user._id, clientData.device);
      if (clientFromDb.isSiteLicense) {
        await this.addSiteLicenseDevice(clientFromDb, user, true);
      }
    }
    await this.routineService.addDeviceInClientRoutines(id, clientData.device);
    await this.cs.addDeviceInClientChecklists(id, clientData.device);
    await this.rs.addDeviceInClientReminders(id, clientData.device);
    await this.gcs.disableHighProcessGamesForClient(
      id,
      ((clientFromDb.device as unknown) as Device).memorySize,
    );
    return clientFromDb.save();
  }
  async addSiteLicenseDevice(
    connectClientData: Partial<Client>,
    user: User,
    isConnectedClient: boolean,
  ) {
    if (!isConnectedClient) {
      await BB.map(user.clients as Types.ObjectId[], async clientId => {
        const client = await this.findById(clientId);
        if (client.isSiteLicense && client.device) {
          connectClientData = client;
          isConnectedClient = true;
        }
      });
    }

    await BB.map(user.clients as Types.ObjectId[], async clientId => {
      const client = await this.findById(clientId);

      if (client && client.isSiteLicense && isConnectedClient) {
        client.device = connectClientData.device;
        //add client in clients list
        await this.deviceService.addClientToDevice(client._id, client.device);
        const clientFromDb = await this.ClientModel.findByIdAndUpdate(
          client._id,
          client,
          {
            new: true,
          },
        );
      }
    });
  }
  async addExistingSiteLicenseDevice(clientId: Types.ObjectId, user: User) {
    let deviceId;
    await BB.map(user.clients as Types.ObjectId[], async clientId => {
      const client = await this.findById(clientId);
      if (client.isSiteLicense && client.device) {
        deviceId = client.device;
      }
    });
    const client = await this.findById(clientId);
    client.isSiteLicense = true;
    await client.save();
    //add in device clients list
    await this.deviceService.addClientToDevice(client._id, deviceId);
  }
  findById = clientId => {
    return this.ClientModel.findById(clientId);
  };
  findByIdFull(clientId) {
    return this.ClientModel.findById(clientId).populate({
      path: 'device',
      model: 'Device',
    });
  }

  getClientByDeviceForMigration(deviceId) {
    return this.ClientModel.findOne({ device: deviceId });
  }
  async getClientByDevice(deviceId) {
    const device = await this.deviceService.findById(deviceId);
    if (device.activeClientId)
      return this.ClientModel.findById(device.activeClientId);
  }

  async resetAacConfig(id: Types.ObjectId) {
    await this.ClientModel.findByIdAndUpdate(
      id,
      { $unset: { aacConfig: 1 } },
      {
        new: true,
      },
    );
    return this.findByIdFull(id);
  }

  async getUserWithAccess(clientId: Types.ObjectId) {
    const users = await this.userService.usersWithAccessToTheChild(clientId);
    const formattedUser = map(users, user => {
      return pick(user, [
        '_id',
        'firstName',
        'lastName',
        'email',
        'phoneNumber',
        'organization.name',
        'createdAt',
        'type',
      ]);
    });
    return formattedUser;
  }
  async removeUserWithAccess(
    clientId: Types.ObjectId,
    userIdToRevokeAccess: Types.ObjectId,
    currentUser: User,
  ) {
    const users = await this.userService.usersWithAccessToTheChild(clientId);

    const userToRevokeHasAccess = find(
      users,
      user => user._id.toString() === userIdToRevokeAccess.toString(),
    );
    if (!userToRevokeHasAccess)
      throw new BadRequestException(
        `User with ${userIdToRevokeAccess} not connected to the child`,
      );
    await this.userService.removeAccessToChildForUser(
      clientId,
      userIdToRevokeAccess,
    );
    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.DELETE,
      entity: LOGS_TYPE.USERS_WITH_ACCESS,
      user: currentUser._id,
      client: clientId,
      meta: { email: userToRevokeHasAccess.email },
    });
    return { deletedSuccessfully: true };
  }

  async getPendingInvites(clientId: Types.ObjectId) {
    const invitations = await this.invitationService.getInviteByClientId(
      clientId,
    );

    let users = await BB.map(invitations, async invitation => {
      if (invitation.phoneNumber) {
        return this.userService.findByPhoneNumber(invitation.phoneNumber);
      } else if (invitation.email) {
        return this.userService.findByEmail(invitation.email);
      }
    });
    users = users.filter(user => user);

    const formattedUsers: Partial<User>[] = map(users, user => {
      return pick(user, [
        '_id',
        'firstName',
        'lastName',
        'email',
        'phoneNumber',
        'organization.name',
        'createdAt',
      ]);
    });
    const pendingUsers = [];
    invitations.forEach(invite => {
      let existedUser;
      // if user is invited via web portal check existing user by email condition
      if (invite.email) {
        existedUser = find(
          formattedUsers,
          user => user.email.toLowerCase() === invite.email.toLowerCase(),
        );
      }
      //else if user is invited via CTA check existing user by phone number condition
      else if (invite.phoneNumber) {
        existedUser = find(
          formattedUsers,
          user => user.phoneNumber === invite.phoneNumber,
        );
      }
      if (existedUser) {
        pendingUsers.push({
          ...existedUser,
          inviteId: invite._id,
          code: invite.code,
          type: invite.type,
        });
      } else {
        pendingUsers.push({
          inviteId: invite._id,
          email: invite.email || '',
          _id: null,
          phoneNumber: invite.phoneNumber || '',
          firstName: invite.firstName || '',
          lastName: invite.lastName || '',
          createdAt: invite.createdAt || '',
          type: invite.type || '',
          code: invite.code || '',
        });
      }
    });
    return pendingUsers;
  }
  async revokeInviteByID(
    clientId: Types.ObjectId,
    inviteId: Types.ObjectId,
    currentUser: User,
  ) {
    const invitation = await this.invitationService.getInvite(inviteId);
    const userCanRemoveInvite = (currentUser.clients as Types.ObjectId[]).find(
      client => client.toString() === invitation.assignedClient.toString(),
    );
    if (!userCanRemoveInvite)
      return new BadRequestException('You cant remove that user');

    const removedInvite = await this.invitationService.remove(inviteId);

    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.DELETE,
      entity: LOGS_TYPE.INVITES,
      user: currentUser._id,
      client: clientId,
      meta: { email: invitation.email },
    });

    return removedInvite;
  }

  async getClientBillingInfo(clientId: Types.ObjectId) {
    const subscription = await this.subscriptionService.getGoallySubscriptionByClient(
      clientId,
    );
    if (!subscription)
      return {
        type: USER_PLANS.FREE,
        payer: null,
        _id: null,
        stripeToken: null,
      };

    const userWhichPay = await this.userService.findById(subscription.payer);
    const payer = pick(userWhichPay, 'firstName', 'lastName', '_id');

    return {
      type: USER_PLANS.PREMIUM,
      payer,
      subscriptionId: subscription._id,
      subscriptionTitle: subscription.prices
        .map(e =>
          e.priceId
            .toUpperCase()
            .replace(/_[0-9]+/g, '')
            .replace(/_/g, ' '),
        )
        .join(', '),
      subscriptions: subscription.prices,
      stripeToken: subscription.subscriptionToken,
    };
  }

  async disconnectDeviceFromChild(
    clientId: Types.ObjectId,
    user: User,
    deviceId?: Types.ObjectId,
  ) {
    let device;
    if (deviceId) device = await this.deviceService.findById(deviceId);
    //get device by userId and clientId
    else
      device = await this.deviceService.getDeviceByClientIdAndUserId(
        clientId,
        user._id,
      );

    //get all clients of device
    const clients = await this.ClientModel.find({ device: device._id });

    //remove active client from device
    await this.deviceService.removeActiveClientFromDevice(device._id);
    //remove user from device
    await this.deviceService.removeUserFromDevice(device._id);

    //remove all clients from device
    await this.deviceService.removeAllClientsFromDevice(device._id);
    //remove same device from all clients
    await this.ClientModel.updateMany(
      { device: device._id },
      {
        $unset: { device: 1 },
      },
      { multi: true },
    );

    await BB.mapSeries(clients, async client => {
      const devices = await this.deviceService.getAllDevicesByClientId(
        client._id,
      );
      console.log('devices', devices);
      if (devices && devices.length > 0) {
        const clientFromDb = await this.ClientModel.findByIdAndUpdate(
          client._id,
          {
            device: devices[0]._id,
          },
          {
            new: true,
          },
        );
      }
    });
  }

  async getAllClients(
    from: string,
    to: string,
    field: string,
    text: string,
    sortBy: string = CLIENT_SORT_FIELDS.CREATED_AT_DESC,
    page = 1,
    limit = 10,
  ) {
    const fromMoment = moment(from || '2020-12-01');
    const toMoment = moment(to)
      .set('hour', 23)
      .set('minute', 59);

    switch (field) {
      case CLIENT_SEARCH_FIELDS.DEVICE_ID:
        field = 'devices.code';
        break;
      case CLIENT_SEARCH_FIELDS.SUBSCRIPTIONS:
        field = 'subscriptions.prices.priceId';
        break;
      // case CLIENT_SEARCH_FIELDS.COMPLETED_AT:
      //   field = 'playedRoutines.updatedAt';
      //   break;.
    }

    const selectedFields = {
      _id: 1,
      dateOfBirth: 1,
      diagnosis: 1,
      schoolName: 1,
      teacherName: 1,
      timezone: 1,
      points: 1,
      lastName: 1,
      firstName: 1,
      address: 1,
      country: 1,
      postalCode: 1,
      createdAt: 1,
      updatedAt: 1,
      subscriptions: '$subscriptions',
      routines: '$routines',
      numOfRoutines: { $size: '$routines' },
      rewards: '$rewards',
      numOfRewards: { $size: '$rewards' },
      // lastRoutineCompletedAt: {
      //   $arrayElemAt: ['$playedRoutines.updatedAt', 0],
      // },
      users: '$users',
      numOfAdults: { $size: '$users' },
      deviceId: { $arrayElemAt: ['$devices.code', 0] },
    };
    const subscriptionsLookup = {
      from: 'subscriptions',
      localField: '_id',
      foreignField: 'client',
      as: 'subscriptions',
    };
    const devicesLookup = {
      from: 'devices',
      localField: 'device',
      foreignField: '_id',
      as: 'devices',
    };
    const routinesLookup = {
      from: 'routines',
      localField: '_id',
      foreignField: 'clientId',
      as: 'routines',
    };
    const rewardsLookup = {
      from: 'rewards',
      localField: '_id',
      foreignField: 'clientId',
      as: 'rewards',
    };
    const adultLookUps = {
      from: 'users',
      localField: '_id',
      foreignField: 'clients',
      as: 'users',
    };
    const playedRoutine = {
      from: 'playedroutines',
      let: { id: '$_id' },
      pipeline: [
        { $match: { $expr: { $eq: ['$clientId', '$$id'] } } },
        { $sort: { createdAt: -1 } },
        { $limit: 1 },
      ],
      as: 'playedRoutines',
    };

    const matchCriteria = {
      createdAt: {
        $gte: fromMoment.toDate(),
        $lte: toMoment.toDate(),
      },
    };

    if (field && text)
      Object.assign(matchCriteria, {
        [field]: {
          $regex: `.*${text}.*`,
          $options: 'i',
        },
      });

    const aggregateQuery = this.PaginatedModel.aggregate([
      {
        $lookup: subscriptionsLookup,
      },
      {
        $lookup: devicesLookup,
      },
      {
        $lookup: routinesLookup,
      },
      {
        $lookup: rewardsLookup,
      },
      // {
      //   $lookup: playedRoutine,
      // },
      {
        $lookup: adultLookUps,
      },
      {
        $match: matchCriteria,
      },
      {
        $project: selectedFields,
      },
    ]);
    const clients = await this.PaginatedModel.aggregatePaginate(
      aggregateQuery,
      {
        page,
        limit,
        sort: sortBy,
      },
    );
    return clients;
  }

  async addClientsDigitalClockField() {
    const total = await this.ClientModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const clients = await this.ClientModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(clients, async client => {
          await this.addClientDigitalClockField(client);
        });
      });
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e,
      };
    }
  }

  async addClientsDayScheduleField() {
    const total = await this.ClientModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const clients = await this.ClientModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(clients, async client => {
          await this.addClientDayScheduleField(client);
        });
      });
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e,
      };
    }
  }

  async addClientsAacConfigData() {
    const total = await this.ClientModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const clients = await this.ClientModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(clients, async client => {
          await this.addClientAacConfigData(client);
        });
      });
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e,
      };
    }
  }

  async addClientsBalloonConfigData() {
    const total = await this.ClientModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const clients = await this.ClientModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(clients, async client => {
          await this.addClientBalloonConfigData(client);
        });
      });
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e,
      };
    }
  }

  async addClientsPuzzles() {
    const total = await this.ClientModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const clients = await this.ClientModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(clients, async client => {
          await this.addClientPuzzles(client);
        });
      });
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e,
      };
    }
  }

  async addClientsPuzzlesPieces() {
    const total = await this.ClientModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const clients = await this.ClientModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(clients, async client => {
          await this.addClientPuzzlePieces(client);
        });
      });
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e,
      };
    }
  }

  async addClientsTempUnit() {
    const total = await this.ClientModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const clients = await this.ClientModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(clients, async client => {
          await this.addClientTempUnit(client);
        });
      });
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e,
      };
    }
  }

  async addClientsBstApp() {
    const total = await this.ClientModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const clients = await this.ClientModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(clients, async client => {
          await this.addClientBstAppField(client);
        });
      });
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e,
      };
    }
  }

  async addClientDigitalClockField(client: Client) {
    client.enableDigitalClock = false;
    const savedClient = await new this.ClientModel(client).save();
    return savedClient;
  }

  async addClientDayScheduleField(client: Client) {
    client.enableDaySchedule = true;
    const savedClient = await new this.ClientModel(client).save();
    return savedClient;
  }

  async addClientAacConfigData(client: Client) {
    client.aacConfig = this.getAacDefaultConfig();
    const savedClient = await new this.ClientModel(client).save();
    return savedClient;
  }
  getAacDefaultConfig() {
    const aacConfig = new AacConfigDto();
    aacConfig.isSpeakOnSentenceComplete = false;
    aacConfig.isVibrateOnClick = false;
    aacConfig.wordClickVolume = 0;
    aacConfig.talkerVolume = 100;
    aacConfig.aacPoints = 0;
    aacConfig.clickDelayinSec = 0.2;
    aacConfig.clickSensitivity = 50;
    aacConfig.isAutoClearMessage = false;
    aacConfig.speechSpeed = 100;
    aacConfig.enableSubwords = false;
    return aacConfig;
  }

  async addClientBalloonConfigData(client: Client) {
    client.balloonConfig = this.getBalloonDefaultConfig();
    const savedClient = await new this.ClientModel(client).save();
    return savedClient;
  }
  getBalloonDefaultConfig() {
    const balloonConfig = new BalloonConfigDto();
    balloonConfig.poppingSound = true;
    balloonConfig.borderThickness = 3;
    balloonConfig.balloonsCount = 5;
    balloonConfig.speed = 3;
    balloonConfig.size = 3;
    return balloonConfig;
  }

  addClientPuzzles(client: Client) {
    return this.puzzleServices.addClientPuzzles(client);
  }

  async addClientPuzzlePieces(client: Client) {
    client.puzzlePieces = -1;
    const savedClient = await new this.ClientModel(client).save();
    return savedClient;
  }

  async addClientTempUnit(client: Client) {
    client.tempUnit = TEMP_UNITS.FAHRENHEIT;
    const savedClient = await new this.ClientModel(client).save();
    return savedClient;
  }

  async addClientBstAppField(client: Client) {
    client.enableBstApp = true;
    const savedClient = await new this.ClientModel(client).save();
    return savedClient;
  }

  async getOnBoardTiles(user: User, clientId: Types.ObjectId) {
    const tiles = await this.acService.getOnBoardTiles();
    if (!tiles) throw new BadRequestException(`no tiles exists for in admin`);

    const userFromDb = await this.userService.findByIdFull(user);
    const subCount = await this.subscriptionService.getUserSubscriptionsCount(
      user,
    );
    const referral = await this.referralService.getUserReferralCode(user);

    let userAccessCount = 0;
    if (clientId) {
      const userAccess = await this.getUserWithAccess(clientId);
      if (userAccess && userAccess.length > 0)
        userAccessCount = userAccess.length;
    }

    let referralCount = 0;
    if (referral && referral.redemptions)
      referralCount = referral.redemptions.length;

    let pairDeviceCount = 0;
    userFromDb.clients.forEach(client => {
      if (client.device) pairDeviceCount += 1;
    });

    await BB.mapSeries(tiles, async tile => {
      if (
        tile.detailsDescription &&
        tile.url.includes(TILE_URLS.CARE_TEAM_URL)
      ) {
        tile.detailsDescription = tile.detailsDescription.replace(
          '%COUNT%',
          userAccessCount.toString(),
        );
      }

      if (
        tile.detailsDescription &&
        tile.url.includes(TILE_URLS.USER_PROFILE_URL)
      ) {
        tile.detailsDescription = tile.detailsDescription.replace(
          '%COUNT%',
          (
            (userFromDb.clients as Client[]).filter(
              client => !client.isSiteLicense,
            ).length + subCount.availableSubscriptions
          ).toString(),
        );
        tile.detailsDescription = tile.detailsDescription.replace(
          '%REMAINING%',
          (userFromDb.clients as Client[])
            .filter(client => !client.isSiteLicense)
            .length.toString(),
        );
      }

      if (tile.detailsDescription && tile.url.includes(TILE_URLS.DEVICES_URL)) {
        tile.detailsDescription = tile.detailsDescription.replace(
          '%COUNT%',
          pairDeviceCount.toString(),
        );
      }

      if (
        tile.detailsDescription &&
        tile.url.includes(TILE_URLS.GOALLY_GRANTS_URL)
      ) {
        tile.detailsDescription = tile.detailsDescription.replace(
          '%COUNT%',
          referralCount.toString(),
        );
      }
      //remove base url from internal urls
      if (tile.url.includes(this.baseUrl)) {
        tile.url = tile.url.replace(this.baseUrl, '');
        tile.url = tile.url.replace('https://', '');
        tile.url = tile.url.replace('http://', '');
      }
      if (tile.detailUrl && tile.detailUrl.includes(this.baseUrl)) {
        tile.detailUrl = tile.detailUrl.replace(this.baseUrl, '');
        tile.detailUrl = tile.detailUrl.replace('https://', '');
        tile.detailUrl = tile.detailUrl.replace('http://', '');
      }
    });

    let nonCompletedTiles = tiles;
    if (user.completedTiles) {
      nonCompletedTiles = tiles.filter(
        tile => !(user.completedTiles as Types.ObjectId[]).includes(tile._id),
      );
    }

    return nonCompletedTiles;
  }

  async addClientsAacEnableSubWords() {
    const total = await this.ClientModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const clients = await this.ClientModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(clients, async client => {
          await this.addClientAacEnableSubWords(client);
        });
      });
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e,
      };
    }
  }

  async addClientAacEnableSubWords(client: Client) {
    if (client.aacConfig) client.aacConfig.enableSubwords = false;
    const savedClient = await new this.ClientModel(client).save();
    return savedClient;
  }

  async getDefaultVoiceId(client: Client): Promise<string> {
    const sound = await this.soundService.getClientSoundObject(client._id);
    if (!sound)
      throw new BadRequestException(`No sound exists for client ${client._id}`);
    if (!sound.generalNew)
      throw new BadRequestException(
        `No migration added for new general sound for client ${client._id}`,
      );
    if (!sound.generalNew.voiceId)
      throw new BadRequestException(
        `No default voice id exists for client ${client._id}`,
      );

    return sound.generalNew.voiceId;
  }

  async deleteSiteClient(user: User, clientId: Types.ObjectId) {
    if (!user.isSiteLicense)
      throw new BadRequestException(
        `user is not allowed to delete client ${clientId}`,
      );

    const client = await this.findById(clientId);
    if (!client)
      throw new BadRequestException(
        `client does not exists having id ${clientId}`,
      );

    const device = await this.deviceService.getDeviceByClientIdAndUserId(
      clientId,
      user._id,
    );
    if (device) {
      if (device.activeClientId.toString() == client._id.toString())
        throw new BadRequestException(
          `client is active on device and cannot be deleted`,
        );
      await this.deviceService.removeClientFromDevice(
        client._id,
        client.device,
      );
    }

    await this.userService.removeClientFromUser(clientId, user._id);

    //todo delete all routines, rewards, behaviors, quiz, aac, safetyfeature, sounds, sleep feature
    // await this.findById(clientId).remove();
  }

  async getAllDevicesByClientId(clientId: Types.ObjectId) {
    const devices = await this.deviceService.getAllDevicesByClientId(clientId);
    return devices;
  }

  async disconnectClient(clientId: Types.ObjectId, user: User) {
    // get devices by userId and clientId
    const devices = await this.deviceService.getDevicesByClientIdAndUserId(
      clientId,
      user._id,
    );

    devices.forEach(async device => {
      await this.deviceService.removeClientFromDevice(clientId, device._id);

      if (device.activeClientId.toString() == clientId.toString()) {
        //remove active client from device
        await this.deviceService.removeActiveClientFromDevice(device._id);
        //remove user from device
        await this.deviceService.removeUserFromDevice(device._id);
      }
    });

    await this.userService.removeClientFromUser(clientId, user._id);

    //remove client from subscription
    await this.subscriptionService.removeClientFromSubscription(
      clientId,
      user._id,
    );

    //remove device from client
    const client = await this.ClientModel.findByIdAndUpdate(
      clientId,
      {
        $unset: { device: 1 },
      },
      { new: true },
    );

    const remainingDevices = await this.deviceService.getAllDevicesByClientId(
      clientId,
    );
    console.log('devices', devices);
    if (remainingDevices && remainingDevices.length > 0) {
      const clientFromDb = await this.ClientModel.findByIdAndUpdate(
        client._id,
        {
          device: devices[0]._id,
        },
        {
          new: true,
        },
      );
    }
  }

  getWorkGoals() {
    return WORK_GOALS;
  }

  getDiagnosis() {
    return DIAGNOSIS;
  }

  async addClientsReminderAndChecklistField() {
    const total = await this.ClientModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const clients = await this.ClientModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(clients, async client => {
          await this.addClientReminderAndChecklistField(client);
        });
      });
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e,
      };
    }
  }

  async addClientReminderAndChecklistField(client: Client) {
    client.enableChecklistApp = true;
    client.enableReminderApp = true;
    const savedClient = await new this.ClientModel(client).save();
    return savedClient;
  }

  compareSchedules(
    newSchedule: ScheduleDto,
    currentSchedules: {
      _id: Types.ObjectId;
      schedule: ScheduleDto;
      name: string;
      duration: number;
    }[],
    scheduleType: string,
  ) {
    Object.entries(newSchedule).map(newDayTime => {
      const nDay = newDayTime[0];
      const nStartTime = newDayTime[1];

      currentSchedules.forEach(currentDocument => {
        const currentSchedule = currentDocument.schedule;

        Object.entries(currentSchedule).map(currentDayTime => {
          const cDay = currentDayTime[0];
          const cStartTime = currentDayTime[1];
          const cEndTime = moment(cStartTime, TIME_FORMAT)
            .add(currentDocument.duration, 'minute')
            .format(TIME_FORMAT);

          const isBetweenInclusive: boolean = moment(
            nStartTime,
            TIME_FORMAT,
          ).isBetween(
            moment(cStartTime, TIME_FORMAT),
            moment(cEndTime, TIME_FORMAT),
            undefined,
            '[]',
          );

          if (cDay === nDay && isBetweenInclusive) {
            const recommendedStartTime = moment(cStartTime, TIME_FORMAT)
              .add(currentDocument.duration + 1, 'minute')
              .format(TIME_FORMAT);
            const day = moment(cDay, 'dd').format('dddd');
            throw new BadRequestException(
              `You can\’t schedule this for ${nStartTime} because '${currentDocument.name} ${scheduleType}' runs on '${day}' from ${cStartTime} till ${cEndTime}. Change the time to ${recommendedStartTime} or keep this as a manual (unscheduled) routine.`,
            );
          }
        });
      });
    });
  }
  async checkAvailability(clientId: Types.ObjectId, newSchedule: ScheduleDto) {
    //get client routines schedule
    const routineSchedules = await this.routineService.getSchedules(clientId);
    this.compareSchedules(newSchedule, routineSchedules, TYPES.ROUTINE);

    //get client checklist schedule
    const checklistSchedules = await this.cs.getSchedules(clientId);
    this.compareSchedules(newSchedule, checklistSchedules, TYPES.CHECKLIST);

    //get client reminder schedule
    const reminderSchedules = await this.rs.getSchedules(clientId);
    this.compareSchedules(newSchedule, reminderSchedules, TYPES.REMINDER);

    return { success: true, message: 'Schedule is available' };
  }

  async getRoutineChecklistsAndReminders(
    body: EntityNameDto,
    clientId: Types.ObjectId,
  ) {
    if (
      !body.entityNames.includes(TYPES.ROUTINE) &&
      !body.entityNames.includes(TYPES.CHECKLIST) &&
      !body.entityNames.includes(TYPES.REMINDER)
    ) {
      throw new BadRequestException(
        `Entity Name must be 'Routine', 'Checklist' or 'Reminder'`,
      );
    }
    let routines;
    let reminders;
    let checklists;
    if (body.entityNames.includes(TYPES.ROUTINE))
      routines = await this.routineService.findClientRoutine(clientId);

    if (body.entityNames.includes(TYPES.CHECKLIST))
      checklists = await this.cs.findClientChecklists(clientId);

    if (body.entityNames.includes(TYPES.REMINDER))
      reminders = await this.rs.findClientReminder(clientId);

    return { routines, checklists, reminders };
  }

  async updateCtaOrderings(data: UpdateCtaOrderingDto, user: User) {
    const fromCtaOrdering = await this.getCtaOrdering(data.from, user);
    const toCtaOrdering = await this.getCtaOrdering(data.to, user);
    await this.updateCtaOrdering(data.from, toCtaOrdering);
    await this.updateCtaOrdering(data.to, fromCtaOrdering);
  }

  async getCtaOrdering(data: MovingEntityDto, user: User): Promise<number> {
    const entityName = data.name;
    const entityId = data.id;
    let ctaOrdering = null;
    switch (entityName) {
      case TYPES.ROUTINE:
        ctaOrdering = (await this.routineService.getById(entityId)).ctaOrdering;
        break;
      case TYPES.CHECKLIST:
        ctaOrdering = (await this.cs.getById(entityId, user)).ctaOrdering;
        break;
      case TYPES.REMINDER:
        ctaOrdering = (await this.rs.getById(entityId)).ctaOrdering;
        break;
    }
    return ctaOrdering;
  }
  async updateCtaOrdering(data: MovingEntityDto, ctaOrdering: number) {
    const entityName = data.name;
    const entityId = data.id;
    switch (entityName) {
      case TYPES.ROUTINE:
        await this.routineService.updatePartial(entityId, { ctaOrdering });
        break;
      case TYPES.CHECKLIST:
        await this.cs.updatePartial(entityId, { ctaOrdering });
        break;
      case TYPES.REMINDER:
        await this.rs.updatePartial(entityId, { ctaOrdering });
        break;
    }
  }

  //it is used to synchronize the ctaOrdering of routines, checklists and reminders
  async updateAllCtaOrderings(
    steps: number, //increment or decrement
    updateCtaOrderFrom: number, //position number where new ctaOrder will be inserted or old ctaOrder will be removed
    clientId: Types.ObjectId,
  ) {
    await this.routineService.updateCtaOrdering(
      steps,
      updateCtaOrderFrom,
      clientId,
    );
    await this.rs.updateCtaOrdering(steps, updateCtaOrderFrom, clientId);
    await this.cs.updateCtaOrdering(steps, updateCtaOrderFrom, clientId);
  }
  async addClientsThemeConfigData() {
    const total = await this.ClientModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const clients = await this.ClientModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(clients, async client => {
          await this.addClientThemeConfigData(client);
        });
      });
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e,
      };
    }
  }

  getThemeDefaultConfig() {
    const themeConfig = new ThemeConfigDto();
    themeConfig.home = CLIENT_THEMES.PARTY_TIME;
    themeConfig.onboarding = CLIENT_THEMES.PARTY_TIME;
    themeConfig.setting = CLIENT_THEMES.CLASSIC;
    themeConfig.daySchedule = CLIENT_THEMES.CLASSIC;
    themeConfig.routine = CLIENT_THEMES.CLASSIC;
    themeConfig.checklist = CLIENT_THEMES.CLASSIC;
    themeConfig.reminder = CLIENT_THEMES.CLASSIC;
    themeConfig.talker = CLIENT_THEMES.CLASSIC;
    themeConfig.puzzle = CLIENT_THEMES.PARTY_TIME;
    themeConfig.behavior = CLIENT_THEMES.CLASSIC;
    themeConfig.reward = CLIENT_THEMES.CLASSIC;
    themeConfig.weather = CLIENT_THEMES.PARTY_TIME;
    themeConfig.timer = CLIENT_THEMES.CLASSIC;
    themeConfig.wordLab = CLIENT_THEMES.CLASSIC;
    themeConfig.balloon = CLIENT_THEMES.CLASSIC;
    themeConfig.gameGarage = CLIENT_THEMES.CLASSIC;
    themeConfig.help = CLIENT_THEMES.CLASSIC;
    themeConfig.bst = CLIENT_THEMES.CLASSIC;
    return themeConfig;
  }
  async addClientThemeConfigData(client: Client) {
    client.themeConfig = this.getThemeDefaultConfig();
    const savedClient = await this.ClientModel.findByIdAndUpdate(
      client._id,
      client,
      { new: true },
    );
    return savedClient;
  }
}
