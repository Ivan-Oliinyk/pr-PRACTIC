import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dto';
import { UserFromReq } from 'src/shared/decorators';
import { AdminGuard } from 'src/shared/guards/admin.guard';
import { SuperAdminGuard } from 'src/shared/guards/adminACLGuards/super-admin.guard';
import { ParseObjectIdPipe } from 'src/shared/pipes/ObjectId.pipe';
import { UpdateWord } from '../aac/aac-words/dto/UpdateWord';
import { BehaviorTrainingsService } from '../behavior-trainings/behavior-trainings.service';
import { BehaviorService } from '../behavior/behavior.service';
import { ChecklistsService } from '../checklists/checklists.service';
import { CreateClientFeatureAccessDto } from '../client-feature-access/dto/create-client-feature.dto';
import { QuizletService } from '../quizlet/quizlet.service';
import { RemindersService } from '../reminders/reminders.service';
import { CreateReward, UpdateReward } from '../rewards/dto';
import { RewardsService } from '../rewards/rewards.service';
import { CreateRoutineDto, UpdateRoutineDto } from '../routines/dto';
import { RoutinesService } from '../routines/routines.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { UpdateUserDto } from '../users/dto';
import { UpdateVisAidDto } from '../visual-aids/dto/UpdateVisAidDto';
import { VisAidDto } from '../visual-aids/dto/VisAidDto';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/CreateAdminDto';
import { GetAllClientsDto } from './dto/GetAllClientsDto';
import { GetAllCompletedRoutinesDto } from './dto/GetAllCompletedRoutinesDto';
import { GetAllUsersDto } from './dto/GetAllUsersDto';
import { MissingSubscriptionDto } from './dto/MissingSubscriptionDto';
import { PartialUpgradeDto } from './dto/partial-upgrade-dto';
import { UpdateAdminDto } from './dto/UpdateAdminDto';
import { Admin } from './schema/admin.schema';

@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private routineService: RoutinesService,
    private rewardService: RewardsService,
    private behaviorService: BehaviorService,
    private quizletService: QuizletService,
    private behaviorTrainingService: BehaviorTrainingsService,
    private subscriptionService: SubscriptionService,
    private checklistService: ChecklistsService,
    private reminderService: RemindersService,
    private authService: AuthService,
  ) {}
  @Post('/login')
  async login(@Body() loginData: LoginDto) {
    const admin = await this.adminService.login(loginData);
    return admin;
  }
  @UseGuards(AdminGuard)
  @Post('/logout')
  async logout(@UserFromReq() user: Admin) {
    const result = await this.adminService.logout(user.token);
    return result;
  }

  @UseGuards(AdminGuard, SuperAdminGuard)
  @Post('/create')
  async createAdmin(@UserFromReq() user: Admin, @Body() data: CreateAdminDto) {
    const createdAdmin = await this.adminService.create(
      data.email,
      data.password,
      data.role,
    );
    return createdAdmin;
  }

  @UseGuards(AdminGuard, SuperAdminGuard)
  @Get('/all-admin-users')
  async getAllAdminUsers(@UserFromReq() user: Admin) {
    const allAdminUsers = await this.adminService.getAllAdminUsers();
    return allAdminUsers;
  }

  @UseGuards(AdminGuard, SuperAdminGuard)
  @Post('/update/:adminId')
  async updateAdmin(
    @Body() data: UpdateAdminDto,
    @Param('adminId', ParseObjectIdPipe) adminId,
  ) {
    return await this.adminService.update(adminId, data);
  }

  @UseGuards(AdminGuard, SuperAdminGuard)
  @Delete('/:adminId')
  async deleteAdmin(
    @Param('adminId', ParseObjectIdPipe) adminId,
    @UserFromReq() user: Admin,
  ) {
    return this.adminService.delete(adminId, user);
  }

  @UseGuards(AdminGuard)
  @Get('/clients/:clientId/user-feature-access/')
  async getUserAccess(@Param('clientId', ParseObjectIdPipe) clientId) {
    const result = await this.adminService.getClientFeatureAccess(clientId);
    return result;
  }

  @UseGuards(AdminGuard)
  @Get('/clients/:clientId/billing/')
  async getClientBillingInfo(@Param('clientId', ParseObjectIdPipe) clientId) {
    const logs = await this.adminService.getClientBillingInfo(clientId);
    return logs;
  }

  @UseGuards(AdminGuard)
  @Put('/clients/:clientId/user-feature-access/:clientAccessId')
  async updateUserAccess(
    @Body() accessData: CreateClientFeatureAccessDto,
    @Param('clientId', ParseObjectIdPipe) clientId,
    @Param('clientAccessId', ParseObjectIdPipe) clientAccessId,
  ) {
    const result = await this.adminService.updateClientFeatureAccess(
      clientId,
      clientAccessId,
      accessData,
    );
    return result;
  }

  @UseGuards(AdminGuard)
  @Get('/users/:userId/logs/')
  async getUserLogs(
    @Param('userId', ParseObjectIdPipe) userId,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    const logs = await this.adminService.getLogs(userId, page);
    return logs;
  }

  @UseGuards(AdminGuard)
  @Post('/users/:userId/login/')
  async loginAs(
    @Param('userId', ParseObjectIdPipe) userId,
    @UserFromReq() admin: Admin,
  ) {
    const loginAsData = await this.adminService.loginAs(userId, admin._id);
    return loginAsData;
  }

  @UseGuards(AdminGuard)
  @Get('/users')
  async getUsers(
    @Query('deviceCode', new DefaultValuePipe('')) code: string,
    @Query('email', new DefaultValuePipe('')) email: string,
  ) {
    const users = await this.adminService.getUsers(code, email);
    return users;
  }

  @UseGuards(AdminGuard)
  @Get('/versions')
  async getVersions() {
    const versions = await this.adminService.getVersions();
    return versions;
  }

  @UseGuards(AdminGuard)
  @Put('/users/:userId')
  updateUser(
    @Param('userId', ParseObjectIdPipe) userId,
    @Body() userData: UpdateUserDto,
  ) {
    return this.adminService.updateUser(userId, userData);
  }

  @UseGuards(AdminGuard)
  @Get('/migrate/routine')
  migrateRoutine() {
    return this.routineService.migrateOldRoutineForNewCheckBox();
  }

  @UseGuards(AdminGuard)
  @Get('/add-new-routine')
  addNewRoutines() {
    return this.routineService.addNewRoutines();
  }

  @UseGuards(AdminGuard)
  @Get('/remove-new-routine')
  removeNewRoutines() {
    return this.routineService.removeNewRoutines();
  }

  @UseGuards(AdminGuard)
  @Get('/remove-old-routine-in-adult')
  removeOldRoutinesInAdultLibrary() {
    return this.routineService.removeOldRoutinesInAdultLibrary();
  }

  @UseGuards(AdminGuard)
  @Get('/remove-new-routine-in-adult')
  removeNewRoutinesInAdultLibrary() {
    return this.routineService.removeNewRoutinesInAdultLibrary();
  }

  @UseGuards(AdminGuard)
  @Get('/update-new-routine-in-child')
  updateNewRoutinesInChildLibrary() {
    return this.routineService.updateNewRoutinesInChildLibrary();
  }

  @UseGuards(AdminGuard)
  @Get('/add-new-reward')
  addNewRewards() {
    return this.rewardService.addNewRewards();
  }

  @UseGuards(AdminGuard)
  @Get('/remove-new-reward')
  removeNewRewards() {
    return this.rewardService.removeNewRewards();
  }

  @UseGuards(AdminGuard)
  @Get('/remove-new-reward-in-adult')
  removeNewRewardsInAdultLibrary() {
    return this.rewardService.removeNewRewardsInAdultLibrary();
  }

  @UseGuards(AdminGuard)
  @Get('/add-new-behavior')
  addNewBehaviors() {
    return this.behaviorService.addNewBehaviors();
  }

  @UseGuards(AdminGuard)
  @Get('/remove-new-behavior')
  removeNewBehaviors() {
    return this.behaviorService.removeNewBehaviors();
  }

  @UseGuards(AdminGuard)
  @Get('/remove-new-behavior-in-adult')
  removeNewBehaviorsInAdultLibrary() {
    return this.behaviorService.removeNewBehaviorsInAdultLibrary();
  }

  @UseGuards(AdminGuard)
  @Get('/add-new-quizlet')
  addNewQuizlets() {
    return this.quizletService.addNewQuizlets();
  }

  @UseGuards(AdminGuard)
  @Get('/remove-new-quizlet')
  removeNewQuizlets() {
    return this.quizletService.removeNewQuizlets();
  }

  @UseGuards(AdminGuard)
  @Get('/remove-new-quizlet-in-adult')
  removeNewQuizletsInAdultLibrary() {
    return this.quizletService.removeNewQuizletsInAdultLibrary();
  }

  @UseGuards(AdminGuard)
  @Post('/partial-upgrade/')
  partialUpgrade(@Body() body: PartialUpgradeDto) {
    return this.adminService.partialUpgrade(body);
  }

  @UseGuards(AdminGuard)
  @Get('/create-new-sounds')
  createNewSounds() {
    return this.adminService.createClientSounds();
  }

  @UseGuards(AdminGuard)
  @Get('/add-adult-behavior-ordering')
  addAdultsBehaviorLibOrdering() {
    return this.behaviorService.addAdultsLibOrdering();
  }

  @UseGuards(AdminGuard)
  @Get('/add-adult-behavior-training-ordering')
  addAdultsBehaviorTrainingLibOrdering() {
    return this.behaviorTrainingService.addAdultsLibOrdering();
  }

  @UseGuards(AdminGuard)
  @Get('/add-adult-quizlet-ordering')
  addAdultsQuizletLibOrdering() {
    return this.quizletService.addAdultsLibOrdering();
  }

  @UseGuards(AdminGuard)
  @Get('/add-adult-reward-ordering')
  addAdultsRewardLibOrdering() {
    return this.rewardService.addAdultsLibOrdering();
  }

  @UseGuards(AdminGuard)
  @Get('/add-adult-routine-ordering')
  addAdultsRoutineLibOrdering() {
    return this.routineService.addAdultsLibOrdering();
  }

  ///////////////////////////////////////////////// ADMIN PORTAL USAGE REPORTS //////////////////////////////////////
  @UseGuards(AdminGuard)
  @Get('/statistics/users')
  async getAllUsers(@Query() paginationQuery: GetAllUsersDto) {
    const users = await this.adminService.getAllUsers(paginationQuery);
    return users;
  }

  @UseGuards(AdminGuard)
  @Get('/statistics/clients')
  async getAllClients(@Query() paginationQuery: GetAllClientsDto) {
    const clients = await this.adminService.getAllClients(paginationQuery);
    return clients;
  }

  @UseGuards(AdminGuard)
  @Get('/statistics/completed-routines')
  async getAllCompletedRoutines(
    @Query() paginationQuery: GetAllCompletedRoutinesDto,
  ) {
    const routines = await this.adminService.getAllCompletedRoutines(
      paginationQuery,
    );
    return routines;
  }

  @UseGuards(AdminGuard)
  @Get('/add-client-digital-clock-field')
  addClientsDigitalClockField() {
    return this.adminService.addClientsDigitalClockField();
  }

  @UseGuards(AdminGuard)
  @Get('/add-client-day-schedule-field')
  addClientsDayScheduleField() {
    return this.adminService.addClientsDayScheduleField();
  }

  @UseGuards(AdminGuard)
  @Get('/add-user-state-field')
  addUsersStateField() {
    return this.adminService.addUsersStateField();
  }

  @UseGuards(AdminGuard)
  @Get('/add-aac-data')
  addAacData() {
    return this.adminService.addAacData();
  }

  @UseGuards(AdminGuard)
  @Get('/visual-aids/symbols/add')
  async addVisualAidSymbols() {
    return await this.adminService.addVisualAidSymbols();
  }

  @UseGuards(AdminGuard)
  @Post('/visual-aids/add')
  async addVisualAidSymbol(@Body() body: VisAidDto) {
    return this.adminService.addVisualAid(body);
  }

  @UseGuards(AdminGuard)
  @Get('/visual-aids')
  async getVisualAids(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('aidType', new DefaultValuePipe('')) aidType: string,
  ) {
    return this.adminService.getVisualAids(page, limit, aidType, search);
  }

  @UseGuards(AdminGuard)
  @Get('/visual-aids/all')
  async getAllVisualAid(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string,
  ) {
    return this.adminService.getAllVisualAids(page, limit, search);
  }

  @UseGuards(AdminGuard)
  @Get('/visual-aids/categories')
  async getVisualAidsCategories() {
    return this.adminService.getVisualAidsCategories();
  }

  @UseGuards(AdminGuard)
  @Put('visual-aids/:id')
  async updateVisualAid(
    @Param('id', ParseObjectIdPipe) aidId,
    @Body() aidData: UpdateVisAidDto,
  ) {
    const aid = await this.adminService.updateVisualAid(
      aidId as Types.ObjectId,
      aidData,
    );
    return aid;
  }

  @UseGuards(AdminGuard)
  @Delete('visual-aids/:id')
  deleteVisualAidById(@Param('id', ParseObjectIdPipe) id) {
    return this.adminService.deleteVisualAidById(id);
  }

  @UseGuards(AdminGuard)
  @Get('/active-routines')
  async getActiveRoutines() {
    const routines = await this.routineService.getActiveAdminRoutines();
    return routines;
  }

  @UseGuards(AdminGuard)
  @Get('/inactive-routines')
  async getInactiveRoutines() {
    const routines = await this.routineService.getInActiveAdminRoutines();
    return routines;
  }

  @UseGuards(AdminGuard)
  @Get('/user-routines')
  async getUserRoutines() {
    const routines = await this.routineService.getUserAdminRoutines();
    return routines;
  }

  @UseGuards(AdminGuard)
  @Get('/client-routines')
  async getClientRoutines() {
    const routines = await this.routineService.getClientAdminRoutines();
    return routines;
  }

  @UseGuards(AdminGuard)
  @Post('/routines/add')
  async addRoutine(@Body() body: CreateRoutineDto) {
    const routine = await this.routineService.createAdminRoutine(body);
    return routine;
  }

  @UseGuards(AdminGuard)
  @Put('/routine/:id')
  async update(
    @Param('id', ParseObjectIdPipe) routineId,
    @Body() body: UpdateRoutineDto,
  ) {
    const routine = await this.routineService.updateAdminRoutine(
      routineId as Types.ObjectId,
      body,
    );
    return routine;
  }
  @UseGuards(AdminGuard)
  @Delete('/routine/:id')
  deleteRoutineById(@Param('id', ParseObjectIdPipe) id) {
    return this.routineService.deleteAdminRoutine(id);
  }

  @UseGuards(AdminGuard)
  @Get('/routine/:id')
  async getById(@Param('id', ParseObjectIdPipe) routineId) {
    const routine = await this.routineService.getById(
      routineId as Types.ObjectId,
    );
    return routine;
  }

  @UseGuards(AdminGuard)
  @Get('/add-new-active-routine')
  addNewActiveRoutines() {
    return this.routineService.createAdminActiveRoutines();
  }

  @UseGuards(AdminGuard)
  @Get('/add-missing-createdBy')
  addCreatedByForMissingActivities() {
    return this.routineService.addCreatedByForMissingActivities();
  }

  @UseGuards(AdminGuard)
  @Get('/add-client-aac-config')
  addClientsAacConfigData() {
    return this.adminService.addClientsAacConfigData();
  }

  @UseGuards(AdminGuard)
  @Get('/add-client-balloon-config')
  addClientsBalloonConfigData() {
    return this.adminService.addClientsBalloonConfigData();
  }

  @UseGuards(AdminGuard)
  @Get('/aac/get-folder-words/:folderId')
  getWordsByFolderId(@Param('folderId', ParseObjectIdPipe) folderId) {
    return this.adminService.getWordsByFolderId(folderId);
  }

  @UseGuards(AdminGuard)
  @Get('/aac/get-folders')
  getFolders() {
    return this.adminService.getFolders();
  }

  @UseGuards(AdminGuard)
  @Put('/aac/update-word/:wordId')
  updateWord(
    @Body() body: UpdateWord,
    @Param('wordId', ParseObjectIdPipe) wordId,
  ) {
    return this.adminService.updateWord(body, wordId);
  }

  @UseGuards(AdminGuard)
  @Get('/add-referral-codes')
  addReferralCodes() {
    return this.adminService.addReferralCodes();
  }

  @UseGuards(AdminGuard)
  @Get('/assign-codes-to-user')
  assignCodeToUser() {
    return this.adminService.assignCodeToUser();
  }

  @UseGuards(AdminGuard)
  @Get('/get-goally-grants-report')
  getGoallyGrantsReport() {
    return this.adminService.getGoallyGrantsReport();
  }

  @UseGuards(AdminGuard)
  @Get('/add-clients-puzzles')
  addClientsPuzzles() {
    return this.adminService.addClientsPuzzles();
  }

  @UseGuards(AdminGuard)
  @Get('/add-puzzles-pieces')
  addClientsPuzzlesPieces() {
    return this.adminService.addClientsPuzzlesPieces();
  }

  @UseGuards(AdminGuard)
  @Get('/add-temp-unit')
  addClientsTempUnit() {
    return this.adminService.addClientsTempUnit();
  }

  @UseGuards(AdminGuard)
  @Get('/client-rewards')
  async getClientRewards() {
    const rewards = await this.rewardService.getClientAdminRewards();
    return rewards;
  }

  @UseGuards(AdminGuard)
  @Get('/user-rewards')
  async getUserRewards() {
    const rewards = await this.rewardService.getUserAdminRewards();
    return rewards;
  }

  @UseGuards(AdminGuard)
  @Get('/active-rewards')
  async getActiveRewards() {
    const rewards = await this.rewardService.getActiveAdminRewards();
    return rewards;
  }

  @UseGuards(AdminGuard)
  @Get('/inactive-rewards')
  async getInactiveRewards() {
    const rewards = await this.rewardService.getInActiveAdminRewards();
    return rewards;
  }

  @UseGuards(AdminGuard)
  @Post('/reward/add')
  async addReward(@Body() body: CreateReward) {
    const reward = await this.rewardService.createAdminReward(body);
    return reward;
  }

  @UseGuards(AdminGuard)
  @Put('/reward/:id')
  async updateReward(
    @Param('id', ParseObjectIdPipe) rewardId,
    @Body() body: UpdateReward,
  ) {
    const reward = await this.rewardService.updateAdminReward(
      rewardId as Types.ObjectId,
      body,
    );
    return reward;
  }

  @UseGuards(AdminGuard)
  @Delete('/reward/:id')
  deleteRewardById(@Param('id', ParseObjectIdPipe) id) {
    return this.rewardService.deleteAdminReward(id);
  }

  @UseGuards(AdminGuard)
  @Get('/add-bst-app')
  addClientsBstApp() {
    return this.adminService.addClientsBstApp();
  }

  @UseGuards(AdminGuard)
  @Get('/add-admin-role')
  addAdminRole() {
    return this.adminService.addAdminRoles();
  }

  @UseGuards(AdminGuard)
  @Get('/update-general-sounds')
  updateGeneralSounds() {
    return this.adminService.updateGeneralSounds();
  }

  @UseGuards(AdminGuard)
  @Put('reset-tiles/:userId')
  async resetTiles(@Param('userId', ParseObjectIdPipe) userId) {
    const result = await this.adminService.resetTiles(userId);
    return result;
  }

  @UseGuards(AdminGuard)
  @Get('/add-aac-enable-subword')
  addClientsAacEnableSubWords() {
    return this.adminService.addClientsAacEnableSubWords();
  }

  @UseGuards(AdminGuard)
  @Get('/add-clients-and-user-field')
  addClientsAndUserFields() {
    return this.adminService.addClientsAndUserFields();
  }

  @UseGuards(AdminGuard)
  @Get('/add-show-timer-field')
  addShowTimerField() {
    return this.routineService.addShowTimerFields();
  }

  @UseGuards(AdminGuard)
  @Get('/add-auto-complete-field')
  addAutoCompleteField() {
    return this.routineService.addAutoCompleteFields();
  }

  @UseGuards(AdminGuard)
  @Get('/add-subscription-uuid-field')
  addSubscriptionsUuidField() {
    return this.subscriptionService.addSubscriptionsUuidField();
  }

  @UseGuards(AdminGuard)
  @Get('/add-clients-reminder-checklist-field')
  addClientsReminderAndChecklistField() {
    return this.adminService.addClientsReminderAndChecklistField();
  }

  @UseGuards(AdminGuard)
  @Get('/update-wake-up-video')
  updateWakeUpVideoFields() {
    return this.adminService.updateWakeUpVideoFields();
  }

  @UseGuards(AdminGuard)
  @Get('/add-aac-png-images')
  addAacPngImages() {
    return this.adminService.addAacPngImages();
  }

  @UseGuards(AdminGuard)
  @Get('/visual-aids/aac-symbols/add')
  async addVisualAidAacSymbols() {
    return await this.adminService.addVisualAidAacSymbols();
  }

  @Post('/shippo-order/:invoiceNumber')
  async shippoOrder(@Param('invoiceNumber') invoiceNumber) {
    const shippoOrderResponse = await this.adminService.shippoOrder(
      invoiceNumber,
    );
    return shippoOrderResponse;
  }

  @UseGuards(AdminGuard)
  @Get('/add-routine-devices-fields')
  addRoutineDevicesFields() {
    return this.routineService.addDevicesFields();
  }

  @UseGuards(AdminGuard)
  @Get('/add-game-configs')
  addGameConfigs() {
    return this.adminService.addGameConfigs();
  }

  @UseGuards(AdminGuard)
  @Get('/add-checklist-devices-fields')
  addChecklistDevicesFields() {
    return this.checklistService.addDevicesFields();
  }

  @UseGuards(AdminGuard)
  @Get('/add-reminder-devices-fields')
  addReminderDevicesFields() {
    return this.reminderService.addDevicesFields();
  }

  @UseGuards(AdminGuard)
  @Get('/add-indepndt-level-fields')
  addIndepndtLevelFields() {
    return this.adminService.addIndepndtLevelFields();
  }

  @UseGuards(AdminGuard)
  @Get('/add-quizlet-type-field')
  addQuizletsTypeFiled() {
    return this.quizletService.addQuizletsTypeFiled();
  }

  @UseGuards(AdminGuard)
  @Get('/add-cta-orderings')
  async addCtaOrderings() {
    try {
      await this.routineService.addCtaOrderings();
      await this.checklistService.addCtaOrderings();
      await this.reminderService.addCtaOrderings();
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }

  @UseGuards(AdminGuard)
  @Get('/sync-user-app-logs')
  async syncUserAppLogs(
    @Query('deviceCode', new DefaultValuePipe('')) code: string,
  ) {
    return await this.adminService.syncUserAppLogs(code);
  }

  @UseGuards(AdminGuard)
  @Get('/add-routine-category')
  async addRoutineCategory() {
    try {
      await this.routineService.addCategory();
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }

  @UseGuards(AdminGuard)
  @Get('/last-month-routines')
  getLastMonthRoutines() {
    return this.adminService.getLastMonthRoutines();
  }

  @UseGuards(AdminGuard)
  @Get('/rearrange-routines-ordering')
  reArrangeRoutineOrdering() {
    return this.routineService.reArrangeRoutinesOrdering();
  }

  @UseGuards(AdminGuard)
  @Get('/rearrange-checklists-ordering')
  reArrangeChecklistsOrdering() {
    return this.checklistService.reArrangeChecklistsOrdering();
  }

  @Get('/add-has-subfolders-field')
  addHasSubFoldersField() {
    return this.adminService.addHasSubFoldersField();
  }

  @UseGuards(AdminGuard)
  @Get('/users-engagement-report')
  async getUsersEngagementReport(@Query() paginationQuery: GetAllUsersDto) {
    return await this.adminService.getUsersEngagementReport(paginationQuery);
  }

  @UseGuards(AdminGuard)
  @Get('/add-new-sounds')
  addNewSounds() {
    return this.adminService.addNewSounds();
  }

  @UseGuards(AdminGuard)
  @Get('/add-high-processing-fields')
  addHighProcessingFields() {
    return this.adminService.addHighProcessingFields();
  }

  @UseGuards(AdminGuard)
  @Get('/add-lab-words')
  addLabWords() {
    return this.adminService.addLabWords();
  }

  @Get('/visual-aids/videos/add')
  async addVisualAidVideos() {
    return await this.adminService.addVisualAidVideos();
  }

  @Post('/add-missing-subscription')
  async addMissingSubscription(@Body() missingSubDto: MissingSubscriptionDto) {
    return await this.authService.addMissingSubscription(missingSubDto);
  }

  @UseGuards(AdminGuard)
  @Get('/add-client-theme-config')
  addClientsThemeConfigData() {
    return this.adminService.addClientsThemeConfigData();
  }

  @UseGuards(AdminGuard)
  @Get('/re-validate-device-game-processing')
  reValidateDevicesGameProcessings() {
    return this.adminService.reValidateDevicesGameProcessings();
  }

  @UseGuards(AdminGuard)
  @Get('/add-brightness-level-field')
  addBrightnessLevelFields() {
    return this.adminService.addBrightnessLevelFields();
  }

  @UseGuards(AdminGuard)
  @Get('/unset-null-phone-numbers')
  unsetNullPhoneNumbers() {
    return this.adminService.unsetNullPhoneNumbers();
  }
}
