import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as BB from 'bluebird';
import { flatMap, omit } from 'lodash';
import { Model, Types } from 'mongoose';
import { LoginDto } from 'src/auth/dto';
import { ADMIN_ROLE_TYPES } from 'src/shared/const';
import { USER_PLANS } from 'src/shared/const/user-plans';
import { Hasher } from 'src/shared/helper/Hasher';
import { AacFoldersService } from '../aac/aac-folders/aac-folders.service';
import { AacSheetsService } from '../aac/aac-sheets/aac-sheets.service';
import { AacWordsService } from '../aac/aac-words/aac-words.service';
import { AdminSessionService } from '../admin-session/admin-session.service';
import { AppLogsService } from '../app-logs/app-logs.service';
import { ClientFeatureAccessService } from '../client-feature-access/client-feature-access.service';
import { CreateClientFeatureAccessDto } from '../client-feature-access/dto/create-client-feature.dto';
import { ClientFeatureAccess } from '../client-feature-access/schema/client-feature-access.schema';
import { ClientsService } from '../clients/clients.service';
import { Client } from '../clients/schema/client.schema';
import { DevicesService } from '../devices/devices.service';
import { GameConfigsService } from '../game-configs/game-configs.service';
import { LabWordsService } from '../lab-words/lab-words.service';
import { PlayedRoutineService } from '../played-routine/played-routine.service';
import { ReferralsService } from '../referrals/referrals.service';
import { SessionsService } from '../sessions/sessions.service';
import { SleepModeService } from '../sleep-mode/sleep-mode.service';
import { SoundsService } from '../sounds/sounds.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { User } from '../users/schema';
import { UsersService } from '../users/users.service';
import { UpdateVisAidDto } from '../visual-aids/dto/UpdateVisAidDto';
import { VisAidDto } from '../visual-aids/dto/VisAidDto';
import { VisualAidsService } from '../visual-aids/visual-aids.service';
import { GetAllClientsDto } from './dto/GetAllClientsDto';
import { GetAllCompletedRoutinesDto } from './dto/GetAllCompletedRoutinesDto';
import { GetAllUsersDto } from './dto/GetAllUsersDto';
import { PartialUpgradeDto } from './dto/partial-upgrade-dto';
import { UpdateAdminDto } from './dto/UpdateAdminDto';
import { Admin } from './schema/admin.schema';
@Injectable()
export class AdminService {
  create(email: string, password: string, role: string) {
    const admin = new this.AdminModel({
      email,
      password,
      role,
    });
    return admin.save();
  }

  async update(adminId: string, updatedAdmin: UpdateAdminDto) {
    try {
      const { email, password, role } = updatedAdmin;
      const admin = await this.AdminModel.findById(adminId);
      if (!admin) throw new BadRequestException('admin not found');
      if (password) {
        const hashedPassword = await Hasher.generateHash(password);
        return await this.AdminModel.findByIdAndUpdate(adminId, {
          email,
          password: hashedPassword,
          role,
        });
      } else {
        return await this.AdminModel.findByIdAndUpdate(adminId, {
          email,
          role,
        });
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async delete(adminId: Types.ObjectId, user: Admin) {
    try {
      if (adminId.toString() === user.id)
        throw new BadRequestException('admin Cannot remove himself');
      await this.AdminModel.findByIdAndDelete(adminId);
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getAllAdminUsers() {
    const allAdmins = await this.AdminModel.find().lean();
    allAdmins.forEach(admin => {
      delete admin.password;
    });
    return allAdmins;
  }

  constructor(
    @InjectModel(Admin.name) private AdminModel: Model<Admin>,
    private adminSessionService: AdminSessionService,
    private userService: UsersService,
    private deviceService: DevicesService,
    private clientService: ClientsService,
    private sessionService: SessionsService,
    private logsService: AppLogsService,
    private clientFeatureService: ClientFeatureAccessService,
    private soundsService: SoundsService,
    private playedRoutineService: PlayedRoutineService,
    private visualAidService: VisualAidsService,
    private aacSheetsService: AacSheetsService,
    private aacFoldersService: AacFoldersService,
    private aacWordsService: AacWordsService,
    private referralService: ReferralsService,
    private sleepModeService: SleepModeService,
    private subscriptionService: SubscriptionService,
    private gcs: GameConfigsService,
    private lws: LabWordsService,
  ) {}

  async getClientFeatureAccess(clientId: Types.ObjectId) {
    console.log(clientId);
    const feature = await this.clientFeatureService.findByClientId(clientId);
    console.log(feature);
    if (!feature)
      return this.clientFeatureService.create(clientId, USER_PLANS.FREE);
    return feature;
  }
  async updateClientFeatureAccess(
    clientId: Types.ObjectId,
    clientAccessId: Types.ObjectId,
    body: CreateClientFeatureAccessDto,
  ) {
    const updated = await this.clientFeatureService.update(
      clientAccessId,
      body as Partial<ClientFeatureAccess>,
    );
    return updated;
  }
  async login(loginData: LoginDto) {
    console.log(loginData);
    const admin = await this.AdminModel.findOne({
      email: loginData.email,
    });

    if (!admin) throw new BadRequestException('admin not found');
    const isPasswordMatch = await admin.comparePasswords(loginData.password);

    if (!isPasswordMatch)
      throw new BadRequestException('Incorrect password or email');

    const { token } = await this.adminSessionService.create(admin._id);
    const adminData = omit(admin.toObject(), 'password');
    return { ...adminData, token };
  }
  async adminExist(email: string) {
    const admin = await this.AdminModel.count({ email });
    return Boolean(admin);
  }
  async logout(token: string) {
    const tokenFromDb = await this.adminSessionService.delete(token);
    return tokenFromDb;
  }

  async getUsers(code: string, email: string) {
    if (email) {
      const user = await this.userService.findByEmail(email);
      return user ? [user] : [];
    }
    if (code) {
      code = code.replace('-', '').toUpperCase();
      const device = await this.deviceService.find({ code });
      if (!device) return [];
      const client = await this.clientService.getClientByDevice(device._id);
      if (!client) return [];
      const users = await this.userService.findByClientId(client._id);
      return users;
    }
  }

  async getVersions() {
    const versions = await this.deviceService.getVersions();
    return versions;
  }

  async addAacData() {
    const response = await this.aacSheetsService.addAacData();
    return response;
  }

  async addReferralCodes() {
    const response = await this.referralService.addReferralCodes();
    return response;
  }

  async assignCodeToUser() {
    const response = await this.userService.assignCodeToUsers();
    return response;
  }

  async getGoallyGrantsReport() {
    const response = await this.referralService.getGoallyGrantsReport();
    return response;
  }

  async loginAs(userId: Types.ObjectId, admin: Admin) {
    const user = await this.userService.findById(userId);
    if (!user) return new NotFoundException(`User with ${userId} not found`);
    const userSession = await this.sessionService.create(user._id, admin._id);
    return { token: Buffer.from(userSession.token).toString('base64') };
  }
  async getLogs(userId: Types.ObjectId, page: number) {
    const logs = await this.logsService.getLogsByUser(userId, page);
    return logs;
  }

  async getClientBillingInfo(clientId: Types.ObjectId) {
    const goallySub = await this.clientService.getClientBillingInfo(clientId);
    const stripeSub = null;
    if (goallySub.stripeToken) {
      // stripeSub = await this.stripeService.getCustomerSubscription(
      //   goallySub.stripeToken,
      // );
    }
    return { goallySub, stripeSub };
  }

  async updateUser(userId: Types.ObjectId, userData: Partial<User>) {
    const user = this.userService.update(userId, userData);
    return user;
  }

  async partialUpgrade(body: PartialUpgradeDto) {
    const updatedDevices = {
      updatedByEmail: {},
      updatedByDeviceCode: {},
    };
    if (body.emails && body.emails.length) {
      const users = await this.userService.UserModel.find({
        email: { $in: body.emails },
      }).populate({ path: 'clients', model: 'Client' });

      console.log(users);
      const clients: Client[] = flatMap(users, e => e.clients as Client[]);

      console.log(clients);
      const devices = clients.map(e => e.device).filter(e => e);

      console.log(devices);

      const resultOfDeviceUpdated = await this.deviceService.DeviceModel.updateMany(
        { _id: { $in: devices } },
        { desiredVersion: body.desiredAppVersion },
        { multi: true },
      );
      updatedDevices.updatedByEmail = resultOfDeviceUpdated;
    }
    if (body.deviceCodes && body.deviceCodes.length) {
      const resultOfDeviceUpdated = await this.deviceService.DeviceModel.updateMany(
        { code: { $in: body.deviceCodes } },
        { desiredVersion: body.desiredAppVersion },
        { multi: true },
      );
      updatedDevices.updatedByDeviceCode = resultOfDeviceUpdated;
    }

    return updatedDevices;
  }

  async createClientSounds() {
    return this.soundsService.createClientSounds();
  }

  ///////////////////////////////////////////////// ADMIN PORTAL USAGE REPORTS //////////////////////////////////////
  async getAllUsers(paginationQuery: GetAllUsersDto) {
    const users = await this.userService.getAllUsers(
      paginationQuery.from,
      paginationQuery.to,
      paginationQuery.searchField,
      paginationQuery.searchText,
      paginationQuery.sortBy,
      paginationQuery.page,
      paginationQuery.limit,
    );
    return users;
  }

  async getAllClients(paginationQuery: GetAllClientsDto) {
    const users = await this.clientService.getAllClients(
      paginationQuery.from,
      paginationQuery.to,
      paginationQuery.searchField,
      paginationQuery.searchText,
      paginationQuery.sortBy,
      paginationQuery.page,
      paginationQuery.limit,
    );
    return users;
  }

  async getAllCompletedRoutines(paginationQuery: GetAllCompletedRoutinesDto) {
    const users = await this.playedRoutineService.getAllCompletedRoutines(
      paginationQuery.from,
      paginationQuery.to,
      paginationQuery.searchField,
      paginationQuery.searchText,
      paginationQuery.sortBy,
      paginationQuery.page,
      paginationQuery.limit,
    );
    return users;
  }

  async addClientsDigitalClockField() {
    return this.clientService.addClientsDigitalClockField();
  }

  async addClientsDayScheduleField() {
    return this.clientService.addClientsDayScheduleField();
  }

  async addClientsAacConfigData() {
    return this.clientService.addClientsAacConfigData();
  }

  async addClientsBalloonConfigData() {
    return this.clientService.addClientsBalloonConfigData();
  }

  async addUsersStateField() {
    return this.userService.addUsersStateField();
  }

  async addVisualAidSymbols() {
    const res = await this.visualAidService.initSymbols();
    return res;
  }

  async addVisualAid(visAidData: VisAidDto) {
    const res = await this.visualAidService.addVisualAid(visAidData);
    return res;
  }

  async getVisualAids(page: number, limit: number, aidType: string, search?) {
    const res = await this.visualAidService.getUrls(
      page,
      limit,
      aidType,
      search,
    );
    return res;
  }

  async getAllVisualAids(page: number, limit: number, search?) {
    const res = await this.visualAidService.getAllUrls(
      page,
      limit,
      null,
      search,
    );
    return res;
  }

  async getVisualAidsCategories() {
    const res = await this.visualAidService.getCategories();
    return res;
  }

  async updateVisualAid(aidId, aidData: UpdateVisAidDto) {
    const aid = await this.visualAidService.update(aidId, aidData, null);
    return aid;
  }

  async deleteVisualAidById(id: Types.ObjectId) {
    const res = await this.visualAidService.deleteById(id);
    return res;
  }

  async getWordsByFolderId(folderId: Types.ObjectId) {
    const res = await this.aacWordsService.getAdminWordsByFolderId(folderId);
    return res;
  }

  async getFolders() {
    const res = await this.aacFoldersService.getAdminFolders();
    return res;
  }

  async updateWord(wordData, wordId: Types.ObjectId) {
    const res = await this.aacWordsService.adminUpdateWord(wordData, wordId);
    return res;
  }

  async addClientsPuzzles() {
    const res = await this.clientService.addClientsPuzzles();
    return res;
  }

  async addClientsPuzzlesPieces() {
    const res = await this.clientService.addClientsPuzzlesPieces();
    return res;
  }

  async addClientsTempUnit() {
    const res = await this.clientService.addClientsTempUnit();
    return res;
  }

  async addClientsBstApp() {
    const res = await this.clientService.addClientsBstApp();
    return res;
  }

  async addAdminRoles() {
    const total = await this.AdminModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const admins = await this.AdminModel.find({})
          .select('-password')
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(admins, async admin => {
          await this.addAdminRole(admin);
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

  async addAdminRole(admin: Admin) {
    admin.role = ADMIN_ROLE_TYPES.SUPER_ADMIN;
    const savedAdmin = await new this.AdminModel(admin).save();
    return savedAdmin;
  }

  async updateGeneralSounds() {
    return this.soundsService.updateGeneralSounds();
  }

  async resetTiles(userId: Types.ObjectId) {
    const response = await this.userService.resetTiles(userId);
    return response;
  }

  async addClientsAacEnableSubWords() {
    return this.clientService.addClientsAacEnableSubWords();
  }

  async addClientsAndUserFields() {
    return this.deviceService.addClientsAndUserFields();
  }

  async addClientsReminderAndChecklistField() {
    return this.clientService.addClientsReminderAndChecklistField();
  }

  async updateWakeUpVideoFields() {
    return this.sleepModeService.updateWakeUpVideoFields();
  }

  async addAacPngImages() {
    const response = await this.aacWordsService.addAacPngImages();
    return response;
  }

  async addVisualAidAacSymbols() {
    const res = await this.visualAidService.initAacSymbols();
    return res;
  }

  async shippoOrder(invoiceNumber: string) {
    try {
      const subscription = await this.subscriptionService.getGoallySubscriptionByInvoiceNumber(
        invoiceNumber,
      );
      const userId = subscription.payer;
      const user = await this.userService.findById(userId);
      const email = user.email;
      const phoneNumber = user.phoneNumber;
      const shippoOrderResponse = await this.subscriptionService.sendDataToShippo(
        email,
        phoneNumber,
        invoiceNumber,
      );
      return shippoOrderResponse;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async addGameConfigs() {
    return this.gcs.addGameConfigs();
  }

  async addIndepndtLevelFields() {
    return this.playedRoutineService.addIndepndtLevelFields();
  }

  async syncUserAppLogs(code: string) {
    return await this.deviceService.syncUserAppLogs(code);
  }

  async getLastMonthRoutines() {
    return this.playedRoutineService.getLastMonthRoutines();
  }

  async addHasSubFoldersField() {
    return this.aacFoldersService.addHasSubFoldersField();
  }

  async getUsersEngagementReport(paginationQuery: GetAllUsersDto) {
    return await this.userService.getUsersEngagementReport(
      paginationQuery.sortBy,
      paginationQuery.page,
      paginationQuery.limit,
    );
  }

  async addNewSounds() {
    return this.soundsService.addNewSounds();
  }

  async addHighProcessingFields() {
    return this.gcs.addHighProcessingFields();
  }

  async addLabWords() {
    return this.lws.addLabWords();
  }

  async addVisualAidVideos() {
    const res = await this.visualAidService.addVideos();
    return res;
  }

  async addClientsThemeConfigData() {
    return this.clientService.addClientsThemeConfigData();
  }

  async reValidateDevicesGameProcessings() {
    return this.deviceService.reValidateDevicesGameProcessings();
  }

  async addBrightnessLevelFields() {
    return this.deviceService.addBrightnessLevelFields();
  }

  async unsetNullPhoneNumbers() {
    const response = await this.userService.unsetNullPhoneNumbers();
    return response;
  }
}
