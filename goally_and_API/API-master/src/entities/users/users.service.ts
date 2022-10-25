import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bb from 'bluebird';
import { isEmail, isPhoneNumber } from 'class-validator';
import { omit } from 'lodash';
import * as moment from 'moment';
import { Model, Types } from 'mongoose';
import * as PaginateModel from 'mongoose-aggregate-paginate-v2';
import { InjectEventEmitter } from 'nest-emitter';
import {
  TEN_DAYS_SMS_TEMPLATE,
  THREE_DAYS_SMS_TEMPLATE,
} from 'src/shared/const/coaching-sms';
import { EMAIL_ACTION } from 'src/shared/const/email-actions';
import { USER_SEARCH_FIELDS } from 'src/shared/const/stat-search-fields';
import { USER_SORT_FIELDS } from 'src/shared/const/stat-sort-fields';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { isDuplicateMongoError } from 'src/shared/helper';
import { Hasher } from 'src/shared/helper/Hasher';
import { MailerService } from 'src/shared/mailer/mailer.service';
import { MessangerService } from 'src/shared/messanger/messanger.service';
import { getStateByAddress } from 'src/utils/getStateByAddress';
import { AdminConfigService } from '../admin-config/admin-config.service';
import { ReferralsService } from '../referrals/referrals.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { CreateOrgDto, UpdateOrgDto } from './dto/';
import { AddRemoveEmailDto } from './dto/AddRemoveEmailDto';
import { UpdateFcmTokenDto } from './dto/UpdateFcmTokenDto';
import { UpdatePayPalDto } from './dto/UpdatePayPalDto';
import { Organization, User } from './schema';

@Injectable()
export class UsersService {
  clientPopulate: {
    path: string;
    model: string;
    populate: { path: string; model: string };
  };
  organizationPopulate: { path: string; model: string };
  clientPopulateWithoutDevice: {
    path: string;
    model: string;
  };
  constructor(
    @InjectModel(User.name) public UserModel: Model<User>,
    @InjectModel(Organization.name) private Organization: Model<Organization>,
    private subscriptionService: SubscriptionService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    @InjectModel(User.name) private PaginatedModel: PaginateModel<User>,
    private referralService: ReferralsService,
    private acService: AdminConfigService,
    private messagingService: MessangerService,
    private mailService: MailerService,
  ) {
    this.clientPopulate = {
      path: 'clients',
      model: 'Client',
      populate: {
        path: 'device',
        model: 'Device',
      },
    };
    this.clientPopulateWithoutDevice = {
      path: 'clients',
      model: 'Client',
    };
    this.organizationPopulate = {
      path: 'organization',
      model: 'Organization',
    };
  }
  async create(user: Partial<User>): Promise<User> {
    const createdUser = new this.UserModel(user);
    const savedUser = await createdUser.save();
    return savedUser;
  }
  findByClientId(clientId: Types.ObjectId) {
    return this.UserModel.find({ clients: { $in: [clientId] } })
      .populate(this.organizationPopulate)
      .populate(this.clientPopulate);
  }
  findByClientIdForMigration(clientId: Types.ObjectId) {
    return this.UserModel.find({ clients: { $in: [clientId] } }).sort({
      createdAt: 1,
    });
  }
  async isUserExist(emails: string[]): Promise<User[]> {
    const users = await this.UserModel.find({
      email: {
        $in: emails.map(email => email.toLowerCase()),
      },
    })
      .populate(this.organizationPopulate)
      .populate(this.clientPopulate);
    return users;
  }
  async isUserExistByPhoneNumber(phoneNumber: string): Promise<User> {
    const user = await this.UserModel.findOne({
      phoneNumber,
    })
      .populate(this.organizationPopulate)
      .populate(this.clientPopulate);
    return user;
  }

  async createOrganization(org: CreateOrgDto, owner: User) {
    const createdOrg = new this.Organization({ ...org, owner: owner._id });
    const organization = await createdOrg.save();
    const user = await this.update(owner._id, {
      organization: organization._id,
    });
    return organization;
  }

  async updateOrg(orgId: Types.ObjectId, orgData: UpdateOrgDto, owner: User) {
    const createdOrg = await this.Organization.findOne({
      _id: orgId,
      owner: owner._id,
    });
    if (!createdOrg) throw new NotFoundException(`org with ${orgId} not found`);
    return this.Organization.findByIdAndUpdate(createdOrg._id, orgData, {
      new: true,
    });
  }
  async findByEmail(email: string) {
    //IF wants to remove to regexp : { $regex: new RegExp(`^${regexEscape(email)}$`, 'i') },
    return this.UserModel.findOne({
      email: email.toLowerCase(),
    })
      .populate(this.organizationPopulate)
      .populate(this.clientPopulate);
  }
  async findByPhoneNumber(phoneNumber: string) {
    return this.UserModel.findOne({
      phoneNumber,
    })
      .populate(this.organizationPopulate)
      .populate(this.clientPopulate);
  }
  //hot fix for https://app.clickup.com/t/3j2qpt8
  async validateEmailAndPhoneNumber(email: string, phoneNumber: string) {
    if (email && !isEmail(email)) {
      if (!email.includes('+')) {
        email = '+' + email.trim();
      }
      if (isPhoneNumber(email)) {
        phoneNumber = email;
        email = null;
        return this.isEmailOrPhoneNumberExists(email, phoneNumber);
      }
    } else return this.isEmailOrPhoneNumberExists(email, phoneNumber);
  }
  async isEmailOrPhoneNumberExists(email: string, phoneNumber: string) {
    console.log('email', email);
    console.log('phoneNumber', phoneNumber);
    if (email) {
      const user = await this.UserModel.findOne({
        email: email.toLowerCase(),
      });
      if (user) return { isExists: true };
    } else if (phoneNumber) {
      if (!phoneNumber.includes('+')) {
        phoneNumber = '+' + phoneNumber.trim();
      }
      const user = await this.UserModel.findOne({
        phoneNumber,
      });
      if (user) return { isExists: true };
    }
    return { isExists: false };
  }
  async findById(id: any) {
    return this.UserModel.findById(id);
  }
  async findByIdFull(id: any) {
    return this.UserModel.findById(id)
      .populate(this.organizationPopulate)
      .populate(this.clientPopulate);
  }
  async getUserClients(id: Types.ObjectId) {
    const userWithClient = await this.UserModel.findById(id).populate(
      this.clientPopulateWithoutDevice,
    );
    return userWithClient.clients;
  }
  async findOrgById(id: Types.ObjectId) {
    const org = await this.Organization.findById(id).populate('owner');
    return org;
  }

  async update(id: Types.ObjectId, userData: Partial<User>) {
    try {
      const userFromDb = await this.UserModel.findById(id);

      if ('password' in userData) {
        userData.password = await Hasher.generateHash(userData.password);
      }
      if (
        userData.alternateEmail &&
        userData.alternateEmail.toLowerCase() === userFromDb.email.toLowerCase()
      ) {
        throw new BadRequestException(
          'Alternate email cannot be same as primary email',
        );
      }

      const user = await this.UserModel.findByIdAndUpdate(id, userData, {
        new: true,
      })
        .populate(this.organizationPopulate)
        .populate(this.clientPopulate);
      return user;
    } catch (e) {
      console.log(e.code);
      if (isDuplicateMongoError(e.code)) {
        throw new BadRequestException('Email already exist');
      } else {
        throw new BadRequestException(e);
      }
    }
  }
  async updateMe(id: Types.ObjectId, userData: Partial<User>) {
    const user = await this.update(id, userData);
    return user;
  }
  async joinToOrgByCode(code: string, user: User) {
    const org = await this.Organization.findOne({ code });
    if (!org) throw new BadRequestException(`Cant find Org with code ${code}`);

    return this.update(user._id, { organization: org._id });
  }
  async clean() {
    return this.UserModel.remove({});
  }

  async addClientToUser(clientId: Types.ObjectId, parentId: Types.ObjectId) {
    try {
      const user = await this.UserModel.findByIdAndUpdate(
        parentId,
        {
          $addToSet: {
            clients: clientId,
          },
        },
        { new: true },
      )
        .populate({
          path: 'clients',
          model: 'Client',
          populate: {
            path: 'device',
            model: 'Device',
          },
        })
        .populate({
          path: 'organization',
          model: 'Organization',
        });
      return user;
    } catch (e) {
      if (isDuplicateMongoError(e.code)) {
        throw new BadRequestException(
          `Client ${clientId} already connected to the parent`,
        );
      }
    }
  }

  async removeClientFromUser(
    clientId: Types.ObjectId,
    parentId: Types.ObjectId,
  ) {
    try {
      const user = await this.UserModel.findByIdAndUpdate(
        parentId,
        {
          $pull: {
            clients: clientId,
          },
        },
        { new: true },
      );
      return user;
    } catch (e) {
      if (isDuplicateMongoError(e.code)) {
        throw new BadRequestException(
          `Client ${clientId} already disconnected from the parent`,
        );
      }
    }
  }

  async usersWithAccessToTheChild(clientId: Types.ObjectId) {
    return this.UserModel.find({ clients: clientId }).populate(
      this.organizationPopulate,
    );
  }
  async removeAccessToChildForUser(
    clientId: Types.ObjectId,
    userId: Types.ObjectId,
  ) {
    return this.UserModel.findByIdAndUpdate(
      { _id: userId },
      { $pull: { clients: clientId } },
      { new: true },
    );
  }

  async getFriends(userId: string): Promise<string[]> {
    const user = await this.findById(userId);
    const friends = await this.UserModel.find({
      clients: { $in: user.clients },
    });
    const friendsList = friends
      .map(e => e._id.toString())
      .filter(e => e !== user._id.toString());
    return friendsList;
  }

  async getAllUsers(
    from: string,
    to: string,
    field: string,
    text: string,
    sortBy: string = USER_SORT_FIELDS.CREATED_AT_DESC,
    page = 1,
    limit = 10,
  ) {
    const fromMoment = moment(from || '2016-12-01');
    const toMoment = moment(to)
      .set('hour', 23)
      .set('minute', 59);

    switch (field) {
      case USER_SEARCH_FIELDS.SUBSCRIPTIONS:
        field = 'subscriptions.prices.priceId';
        break;
    }

    const selectedFields = {
      _id: 1,
      last4: 1,
      subscription: 1,
      paymentMethod: 1,
      stripeCustomerId: 1,
      status: 1,
      clients: 1,
      lastName: 1,
      email: 1,
      address: 1,
      country: 1,
      postalCode: 1,
      apt: 1,
      createdAt: 1,
      updatedAt: 1,
      firstName: 1,
      phoneNumber: 1,
      type: 1,
      state: 1,
      invitationsSent: `$invitationsSent`,
      invitationsReceived: `$invitationsReceived`,
      invitationsReceivedBy: `$invitationsReceivedBy`,
      subscriptions: '$subscriptions',
      numOfLearners: { $size: '$clients' },
      numOfInvitesSent: { $size: '$invitationsSent' },
      numOfInvitesReceived: { $size: '$invitationsReceived' },
      numOfSubscriptions: { $size: '$subscriptions' },
    };

    const subscriptionsLookup = {
      from: 'subscriptions',
      localField: '_id',
      foreignField: 'payer',
      as: 'subscriptions',
    };

    const invitesSentLookup = {
      from: 'invitations',
      localField: '_id',
      foreignField: 'invitedBy',
      as: 'invitationsSent',
    };

    const invitesReceivedLookup = {
      from: 'invitations',
      localField: 'email',
      foreignField: 'email',
      as: 'invitationsReceived',
    };

    const invitesReceivedByLookup = {
      from: 'users',
      localField: 'invitationsReceived.invitedBy',
      foreignField: '_id',
      as: 'invitationsReceivedBy',
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
        $lookup: invitesSentLookup,
      },
      {
        $lookup: invitesReceivedLookup,
      },
      {
        $lookup: invitesReceivedByLookup,
      },
      {
        $match: matchCriteria,
      },
      {
        $project: selectedFields,
      },
    ]);
    const users = await this.PaginatedModel.aggregatePaginate(aggregateQuery, {
      page,
      limit,
      sort: sortBy,
    });

    return users;
  }

  async updateFcmToken(id: Types.ObjectId, fcmTokenDto: UpdateFcmTokenDto) {
    const user = await this.UserModel.findByIdAndUpdate(
      id,
      { fcmToken: fcmTokenDto.fcmToken },
      { new: true },
    );
    return user;
  }

  async updatePayPalId(id: Types.ObjectId, payPalDto: UpdatePayPalDto) {
    const user = await this.UserModel.findByIdAndUpdate(
      id,
      { payPalId: payPalDto.payPalId },
      { new: true },
    );
    return user;
  }

  async addUsersStateField() {
    const total = await this.UserModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await bb.mapSeries(new Array(arrayLength), async (elem, index) => {
        const users = await this.UserModel.find({})
          .limit(series)
          .skip(series * index);
        await bb.mapSeries(users, async user => {
          await this.addUserStateField(user);
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

  async addUserStateField(user: User) {
    if (user.address && !user.state) {
      user.state = await getStateByAddress(user.address);
      const savedUser = await new this.UserModel(user).save();
      return savedUser;
    }
  }

  async assignCodeToUsers() {
    const total = await this.UserModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await bb.mapSeries(new Array(arrayLength), async (elem, index) => {
        const users = await this.UserModel.find({})
          .limit(series)
          .skip(series * index);
        await bb.mapSeries(users, async user => {
          await this.assignCodeToUser(user);
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

  async assignCodeToUser(user: User) {
    const savedUser = await this.referralService.assignCodeToUser(user);
    return savedUser;
  }

  async addCompletedTile(tileId: Types.ObjectId, user: User) {
    const tile = await this.acService.getOnBoardingTileById(tileId);

    const updatedUser = await this.UserModel.findByIdAndUpdate(
      user._id,
      {
        $addToSet: {
          completedTiles: tile,
        },
      },
      { new: true },
    );

    return updatedUser;
  }

  async resetTiles(userId: Types.ObjectId) {
    const updatedUser = await this.UserModel.findByIdAndUpdate(
      userId,
      {
        $unset: {
          completedTiles: 1,
        },
      },
      { new: true },
    );

    return updatedUser;
  }

  async sendCoachingSms() {
    //03 days sms handling
    const threeDaysAhead = moment()
      .add(3, 'days')
      .toDate();
    console.log(threeDaysAhead);

    const usersCreated3DaysAgo = await this.UserModel.find({
      $and: [
        { phoneNumber: { $exists: true } },
        { phoneNumber: { $ne: null } },
        { phoneNumber: { $ne: '' } },
        { coachingStatus: { $exists: true } },
        { 'coachingStatus.is3DaySmsSent': { $ne: true } },
        {
          createdAt: {
            $gte: threeDaysAhead,
          },
        },
      ],
    });

    console.log(usersCreated3DaysAgo.length);
    await bb.mapSeries(usersCreated3DaysAgo, async user => {
      await this.sendCoachingSmsToUser(user, THREE_DAYS_SMS_TEMPLATE);
      user.coachingStatus.is3DaySmsSent = true;
      await new this.UserModel(user).save();
    });

    //10 days sms handling
    const tenDaysAhead = moment()
      .add(10, 'days')
      .toDate();
    console.log(tenDaysAhead);
    const usersCreated10DaysAgo = await this.UserModel.find({
      $and: [
        { phoneNumber: { $exists: true } },
        { phoneNumber: { $ne: null } },
        { phoneNumber: { $ne: '' } },
        { coachingStatus: { $exists: true } },
        { 'coachingStatus.is3DaySmsSent': { $eq: true } },
        { 'coachingStatus.is10DaySmsSent': { $ne: true } },
        {
          createdAt: {
            $gte: tenDaysAhead,
          },
        },
      ],
    });

    console.log(usersCreated10DaysAgo.length);
    await bb.mapSeries(usersCreated10DaysAgo, async user => {
      await this.sendCoachingSmsToUser(user, TEN_DAYS_SMS_TEMPLATE);
      user.coachingStatus.is10DaySmsSent = true;
      await new this.UserModel(user).save();
    });
  }

  async sendCoachingSmsToUser(user: User, smsBody: string) {
    const { phoneNumber } = user;
    smsBody = smsBody.replace('[FIRST NAME]', user.firstName);
    if (smsBody.includes('[Date of 30 days]')) {
      smsBody = smsBody.replace(
        '[Date of 30 days]',
        moment(user.createdAt)
          .add(30, 'days')
          .format('MM/DD')
          .toString(),
      );
    }
    const smsResponse = await this.messagingService.sendSms(
      smsBody,
      phoneNumber,
    );
    return smsResponse;
  }

  async getUsersEngagementReport(
    sortBy: string = USER_SORT_FIELDS.CREATED_AT,
    page = 1,
    limit = 10,
  ) {
    const timePeriod = 180;
    const startFrom = moment()
      .startOf('day')
      .subtract(timePeriod, 'days')
      .toDate();
    const endAt = moment()
      .endOf('day')
      .toDate();

    const selectedFields = {
      _id: 1,
      firstName: '$firstName',
      lastName: '$lastName',
      email: '$email',
      phoneNumber: '$phoneNumber',
      createdAt: '$createdAt',
      subscriptions: '$subscriptions',
      playedRoutines: '$playedRoutines.createdAt',
      aacPlayedWords: '$aacPlayedWords.createdAt',
    };
    const subscriptionsLookup = {
      from: 'subscriptions',
      localField: '_id',
      foreignField: 'payer',
      as: 'subscriptions',
    };

    const playedRoutinesLookup = {
      from: 'playedroutines',
      let: { id: '$_id', createdAt: '$createdAt' },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$$id', '$routine.createdBy'] },
                { $gte: ['$createdAt', startFrom] },
                { $lte: ['$createdAt', endAt] },
              ],
            },
          },
        },
      ],
      as: 'playedRoutines',
    };

    const aacPlayedWordsLookup = {
      from: 'aacplayedwords',
      let: { id: '$_id', createdAt: '$createdAt' },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$$id', '$createdBy'] },
                { $gte: ['$$createdAt', startFrom] },
                { $lte: ['$$createdAt', endAt] },
              ],
            },
          },
        },
      ],
      as: 'aacPlayedWords',
    };

    const aggregateQuery = this.PaginatedModel.aggregate([
      {
        $lookup: subscriptionsLookup,
      },
      {
        $lookup: playedRoutinesLookup,
      },
      {
        $lookup: aacPlayedWordsLookup,
      },
      {
        $project: selectedFields,
      },
    ]);
    const users = await this.PaginatedModel.aggregatePaginate(aggregateQuery, {
      page,
      limit,
      sort: sortBy,
    });

    const usersEngagementReport = this.getUsersEngagementReportPeriodWise(
      users,
    );
    return usersEngagementReport;
  }

  async getUsersEngagementReportPeriodWise(users) {
    const startFrom = 180;
    const day0 = moment()
      .startOf('day')
      .subtract(startFrom - 0, 'days')
      .toDate();
    const day30 = moment()
      .endOf('day')
      .subtract(startFrom - 30, 'days')
      .toDate();
    const day31 = moment()
      .startOf('day')
      .subtract(startFrom - 31, 'days')
      .toDate();
    const day60 = moment()
      .endOf('day')
      .subtract(startFrom - 60, 'days')
      .toDate();
    const day61 = moment()
      .startOf('day')
      .subtract(startFrom - 61, 'days')
      .toDate();
    const day90 = moment()
      .endOf('day')
      .subtract(startFrom - 90, 'days')
      .toDate();
    const day91 = moment()
      .startOf('day')
      .subtract(startFrom - 91, 'days')
      .toDate();
    const day180 = moment()
      .endOf('day')
      .subtract(startFrom - 180, 'days')
      .toDate();

    //get count of each user for each time period both for routines and words
    const docs = users.docs.map(user => {
      const userEngagementReport = {
        ...user,
        playedRoutinesCount: {
          day0to30: 0,
          day31to60: 0,
          day61to90: 0,
          day91to180: 0,
          total: user.playedRoutines.length,
        },
        playedWordsCount: {
          day0to30: 0,
          day31to60: 0,
          day61to90: 0,
          day91to180: 0,
          total: user.aacPlayedWords.length,
        },
      };

      userEngagementReport.playedRoutinesCount.day0to30 = user.playedRoutines.filter(
        dateTime => {
          return moment(dateTime).isBetween(day0, day30, null, '[]');
        },
      ).length;

      userEngagementReport.playedRoutinesCount.day31to60 = user.playedRoutines.filter(
        dateTime => {
          return moment(dateTime).isBetween(day31, day60, null, '[]');
        },
      ).length;

      userEngagementReport.playedRoutinesCount.day61to90 = user.playedRoutines.filter(
        dateTime => {
          return moment(dateTime).isBetween(day61, day90, null, '[]');
        },
      ).length;

      userEngagementReport.playedRoutinesCount.day91to180 = user.playedRoutines.filter(
        dateTime => {
          return moment(dateTime).isBetween(day91, day180, null, '[]');
        },
      ).length;

      userEngagementReport.playedWordsCount.day0to30 = user.aacPlayedWords.filter(
        dateTime => {
          return moment(dateTime).isBetween(day0, day30, null, '[]');
        },
      ).length;

      userEngagementReport.playedWordsCount.day31to60 = user.aacPlayedWords.filter(
        dateTime => {
          return moment(dateTime).isBetween(day31, day60, null, '[]');
        },
      ).length;

      userEngagementReport.playedWordsCount.day61to90 = user.aacPlayedWords.filter(
        dateTime => {
          return moment(dateTime).isBetween(day61, day90, null, '[]');
        },
      ).length;

      userEngagementReport.playedWordsCount.day91to180 = user.aacPlayedWords.filter(
        dateTime => {
          return moment(dateTime).isBetween(day91, day180, null, '[]');
        },
      ).length;

      const userEngagmentReportTrimmed = omit(
        userEngagementReport,
        'playedRoutines',
        'aacPlayedWords',
      );
      return userEngagmentReportTrimmed;
    });

    const allUsersEngagementReport = {
      ...users,
      docs,
      timeRanges: {
        day0to30: {
          start: day0,
          end: day30,
        },
        day31to60: {
          start: day31,
          end: day60,
        },
        day61to90: {
          start: day61,
          end: day90,
        },
        day91to180: {
          start: day91,
          end: day180,
        },
      },
    };
    return allUsersEngagementReport;
  }

  async unsetNullPhoneNumbers() {
    const total = await this.UserModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await bb.mapSeries(new Array(arrayLength), async (elem, index) => {
        const users = await this.UserModel.find({})
          .limit(series)
          .skip(series * index);
        await bb.mapSeries(users, async user => {
          await this.unsetNullPhoneNumber(user);
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

  async unsetNullPhoneNumber(user: User) {
    if (user.phoneNumber === null) {
      const savedUser = await this.UserModel.findByIdAndUpdate(
        user._id,
        { $unset: { phoneNumber: '' } },
        { new: true },
      );
      return savedUser;
    }
  }

  async addRemoveFromList(body: AddRemoveEmailDto) {
    if (body.action == EMAIL_ACTION.ADD)
      return this.mailService.addProfileToList(body.email);
    else return this.mailService.removeProfileFromList(body.email);
  }
}
