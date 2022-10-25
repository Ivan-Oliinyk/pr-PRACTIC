import {
  Body,
  Controller,
  DefaultValuePipe,
  forwardRef,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { DeviceFromReq } from 'src/shared/decorators';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { DeviceGuard } from 'src/shared/guards/device.guard';
import { ParseObjectIdPipe } from 'src/shared/pipes/ObjectId.pipe';
import { AacFoldersService } from '../aac/aac-folders/aac-folders.service';
import { AacPlayedService } from '../aac/aac-played/aac-played.service';
import { ChildAacPlayedWord } from '../aac/aac-played/dto/ChildAacPlayedWord.dto';
import { AacWordsService } from '../aac/aac-words/aac-words.service';
import { AdminConfigService } from '../admin-config/admin-config.service';
import { AppVersionsService } from '../app-versions/app-versions.service';
import { BehaviorTrainingsService } from '../behavior-trainings/behavior-trainings.service';
import { BehaviorService } from '../behavior/behavior.service';
import { ChecklistsService } from '../checklists/checklists.service';
import { AacVolumeDto } from '../clients/dto/AacVolumeDto';
import { CompletedChecklistsService } from '../completed-checklists/completed-checklists.service';
import { SaveOfflineCompletedChecklist } from '../completed-checklists/dto/CreateCompletedChecklistOffline.dto';
import { CompletedQuizletService } from '../completed-quizlet/completed-quizlet.service';
import { ChildCompleteQuizlet } from '../completed-quizlet/dto/ChildCompleteQuizlet.dto';
import { CompletedRemindersService } from '../completed-reminders/completed-reminders.service';
import { CompleteReminderDto } from '../completed-reminders/dto/CompleteReminder.dto';
import { CompletedTrainingsService } from '../completed-trainings/completed-trainings.service';
import { ChildCompleteGeneralTraining } from '../completed-trainings/dto/ChildCompleteGeneralTraining.dto';
import { ChildCompleteRehearsalTraining } from '../completed-trainings/dto/ChildCompleteRehearsalTraining.dto';
import { UpdatePointsDto } from '../game-configs/dto/UpdateGameConfig.dto';
import { SaveOfflinePlayedRoutine } from '../played-routine/dto/CreatePlayedRoutineOffline.dto';
import { PlayedRoutineService } from '../played-routine/played-routine.service';
import { QuizletService } from '../quizlet/quizlet.service';
import { ChildRedeemReward } from '../redeemed-rewards/dto/ChildRedeemReward.dto';
import { RedeemRewardsService } from '../redeemed-rewards/redeemed-rewards.service';
import { RemindersService } from '../reminders/reminders.service';
import { RewardsService } from '../rewards/rewards.service';
import { RoutinesService } from '../routines/routines.service';
import { SafetyFeatureService } from '../safety-features/safety-feature.service';
import { CreateSoundDto } from '../sounds/dto/CreateSound';
import { SoundsService } from '../sounds/sounds.service';
import { DevicesService } from './devices.service';
import {
  CompletePuzzleDto,
  InitDeviceDto,
  MigratePuzzleDto,
  UpdateDeviceDto,
  UpdatePuzzleDto,
} from './dto';
import { Device } from './schemas';
@Controller('devices')
export class DevicesController {
  constructor(
    private deviceService: DevicesService,
    @Inject(forwardRef(() => RoutinesService))
    private routineService: RoutinesService,

    @Inject(forwardRef(() => RewardsService))
    private rewardService: RewardsService,

    private cqs: CompletedQuizletService,
    private qs: QuizletService,

    @Inject(forwardRef(() => RedeemRewardsService))
    private rrs: RedeemRewardsService,
    @Inject(forwardRef(() => BehaviorService))
    private bs: BehaviorService,

    private pr: PlayedRoutineService,

    private appVersion: AppVersionsService,

    private cts: CompletedTrainingsService,
    private bts: BehaviorTrainingsService,
    private ss: SoundsService,

    @Inject(forwardRef(() => AacWordsService))
    private aacWordsService: AacWordsService,
    @Inject(forwardRef(() => AacFoldersService))
    private aacFoldersService: AacFoldersService,
    @Inject(forwardRef(() => AacPlayedService))
    private aacPlayedService: AacPlayedService,
    private sfs: SafetyFeatureService,
    private acService: AdminConfigService,
    private rs: RemindersService,
    private crs: CompletedRemindersService,
    private checklistsService: ChecklistsService,
    private ccs: CompletedChecklistsService,
  ) {}
  @Post('/init')
  async init(@Body() initDeviceBody: InitDeviceDto) {
    const device = await this.deviceService.init(initDeviceBody);
    return device;
  }

  @Get('/me')
  @UseGuards(DeviceGuard)
  me(@DeviceFromReq() device: Device) {
    return device;
  }

  @Put()
  @UseGuards(DeviceGuard)
  async update(
    @DeviceFromReq() curDevice: Device,
    @Body() body: UpdateDeviceDto,
  ) {
    const device = await this.deviceService.update({
      ...body,
      uniqIdentifier: curDevice.uniqIdentifier,
    });
    return device;
  }

  @Get('/exist/:deviceCode')
  @UseGuards(AuthGuard)
  async isExist(@Param('deviceCode') deviceCode: string) {
    const { isExist, isChildConnected } = await this.deviceService.isExist(
      deviceCode,
    );
    return { isExist, isChildConnected };
  }

  @Put('update/:deviceId')
  @UseGuards(AuthGuard)
  async updateDevice(
    @Param('deviceId', ParseObjectIdPipe) deviceId,
    @Body() body: UpdateDeviceDto,
  ) {
    const device = await this.deviceService.updateDevice(deviceId, body);
    return device;
  }

  @Get('/routines')
  @UseGuards(DeviceGuard)
  async getRoutines(@DeviceFromReq() device: Device) {
    const routines = await this.routineService.getClientRoutinesByDeviceId(
      device._id,
    );
    return routines;
  }

  @Post('/played-routine')
  @UseGuards(DeviceGuard)
  async savePlayedRoutineOffline(
    @DeviceFromReq() device: Device,
    @Body() body: SaveOfflinePlayedRoutine,
  ) {
    const routine = await this.pr.savePlayedOffline(body, device);
    return routine;
  }
  @Put('/played-routine/:routineId')
  @UseGuards(DeviceGuard)
  async updatedPlayedRoutineOffline(
    @DeviceFromReq() device: Device,
    @Param('routineId', ParseObjectIdPipe)
    routineId,
    @Body() body: SaveOfflinePlayedRoutine,
  ) {
    const routine = await this.pr.updatePlayedOffline(routineId, body, device);
    return routine;
  }

  @Get('/routines/:id')
  @UseGuards(DeviceGuard)
  async getRoutineById(
    @DeviceFromReq() device: Device,

    @Param('id', ParseObjectIdPipe) routineId,
  ) {
    const routines = await this.routineService.getClientRoutineByDeviceAndId(
      device._id,
      routineId as Types.ObjectId,
    );
    return routines;
  }

  @Get('/behaviors')
  @UseGuards(DeviceGuard)
  async getBehaviors(@DeviceFromReq() device: Device) {
    const behaviors = await this.bs.getClientBehaviorsByDeviceId(device._id);
    return behaviors;
  }
  @Get('/behaviors/:id')
  @UseGuards(DeviceGuard)
  async getBehaviorsById(
    @DeviceFromReq() device: Device,
    @Param('id', ParseObjectIdPipe) behaviorId,
  ) {
    const behaviors = await this.bs.getClientBehaviorByDeviceIdAndId(
      device._id,
      behaviorId as Types.ObjectId,
    );
    return behaviors;
  }

  @Get('/rewards')
  @UseGuards(DeviceGuard)
  getRewards(@DeviceFromReq() device: Device) {
    const rewards = this.rewardService.getClientRewardsByDeviceId(device._id);
    return rewards;
  }
  @Get('/redeemed-rewards')
  @UseGuards(DeviceGuard)
  getRedeemedRewards(@DeviceFromReq() device: Device) {
    const rewards = this.rrs.getChildRedeemRewardsByDeviceId(device._id);
    return rewards;
  }
  @Get('/rewards/:id')
  @UseGuards(DeviceGuard)
  getRewardsById(
    @DeviceFromReq() device: Device,
    @Param('id', ParseObjectIdPipe) rewardId,
  ) {
    const rewards = this.rewardService.getClientRewardByDeviceIdAndId(
      device._id,
      rewardId as Types.ObjectId,
    );
    return rewards;
  }

  @Post('/redeemed-rewards')
  @UseGuards(DeviceGuard)
  childRedeemReward(
    @DeviceFromReq() device: Device,
    @Body() body: ChildRedeemReward,
  ) {
    const rewards = this.rrs.childRedeemRewardByDeviceId(body, device);
    return rewards;
  }

  @Get('/puzzles')
  @UseGuards(DeviceGuard)
  getPuzzle(@DeviceFromReq() device: Device) {
    return this.deviceService.getPuzzles(device._id);
  }

  @Put('/update-puzzle-progress/:puzzleId')
  @UseGuards(DeviceGuard)
  updatePuzzleProgress(
    @DeviceFromReq() device: Device,
    @Param('puzzleId', ParseObjectIdPipe) puzzleId,
    @Body() body: UpdatePuzzleDto,
  ) {
    return this.deviceService.updatePuzzleProgress(device, puzzleId, body);
  }

  @Put('/migrate-puzzle-progress')
  @UseGuards(DeviceGuard)
  migratePuzzleProgress(
    @DeviceFromReq() device: Device,
    @Body() body: MigratePuzzleDto,
  ) {
    return this.deviceService.migratePuzzleProgress(device, body);
  }

  @Post('/puzzle/complete')
  @UseGuards(DeviceGuard)
  competePuzzle(
    @DeviceFromReq() device: Device,
    @Body() body: CompletePuzzleDto,
  ) {
    return this.deviceService.completePuzzle(device, body);
  }

  @Get('/quizlets/')
  @UseGuards(DeviceGuard)
  childQuizlets(@DeviceFromReq() device: Device) {
    return this.qs.getClientQuizletByDeviceId(device._id);
  }
  @Post('/quizlets/complete')
  @UseGuards(DeviceGuard)
  competeQuizlet(
    @DeviceFromReq() device: Device,
    @Body() body: ChildCompleteQuizlet,
  ) {
    return this.cqs.complete(body, device);
  }

  @Get('/check-upgrade/')
  @UseGuards(DeviceGuard)
  checkUpgrade(@DeviceFromReq() device: Device) {
    return this.appVersion.checkUpgrade(device);
  }

  @Get('/behavior-trainings')
  @UseGuards(DeviceGuard)
  getTrainings(@DeviceFromReq() device: Device) {
    return this.bts.getClientBehaviorTrainingsByDeviceId(device._id);
  }

  @Get('/behavior-trainings/:id')
  @UseGuards(DeviceGuard)
  getTrainingsById(
    @DeviceFromReq() device: Device,
    @Param('id', ParseObjectIdPipe) behaviorTrainingId,
  ) {
    const behaviorTrainings = this.bts.getClientBehaviorTrainingsByDeviceIdAndId(
      device._id,
      behaviorTrainingId as Types.ObjectId,
    );
    return behaviorTrainings;
  }

  @Post('/behavior-trainings/complete')
  @UseGuards(DeviceGuard)
  completeGeneralTraining(
    @DeviceFromReq() device: Device,
    @Body() body: ChildCompleteGeneralTraining,
  ) {
    return this.cts.completeGeneral(body, device);
  }

  @Post('/behavior-rehearsal/complete')
  @UseGuards(DeviceGuard)
  completeRehearsalTraining(
    @DeviceFromReq() device: Device,
    @Body() body: ChildCompleteRehearsalTraining,
  ) {
    return this.cts.completeRehearsal(body, device);
  }

  @Get('/sounds')
  @UseGuards(DeviceGuard)
  getSounds(@DeviceFromReq() device: Device) {
    return this.ss.getClientSoundByDeviceId(device._id);
  }

  @Put('/sounds/update/:id')
  @UseGuards(DeviceGuard)
  updateSounds(
    @Body() body: CreateSoundDto,
    @Param('id', ParseObjectIdPipe) id,
    @DeviceFromReq() device: Device,
  ) {
    return this.ss.update(body, id, device._id);
  }

  @Get('/aac/words')
  @UseGuards(DeviceGuard)
  async getWords(@DeviceFromReq() device: Device) {
    const words = await this.aacWordsService.getClientWordsByDeviceId(
      device._id,
    );
    return words;
  }
  @Get('/aac/words/:id')
  @UseGuards(DeviceGuard)
  async getWordById(
    @DeviceFromReq() device: Device,
    @Param('id', ParseObjectIdPipe) wordId,
  ) {
    const words = await this.aacWordsService.getClientWordByDeviceIdAndId(
      device._id,
      wordId as Types.ObjectId,
    );
    return words;
  }
  @Get('/aac/sentence')
  @UseGuards(DeviceGuard)
  async getAacSentenceMp3(
    @DeviceFromReq() device: Device,
    @Query('sentence', new DefaultValuePipe('')) sentence: string,
  ) {
    const mp3 = await this.deviceService.getSentenceMp3(
      device._id,
      sentence,
      true,
    );
    return mp3;
  }
  @Get('/aac/folders')
  @UseGuards(DeviceGuard)
  async getFolders(@DeviceFromReq() device: Device) {
    const folders = await this.aacFoldersService.getClientFoldersByDeviceId(
      device._id,
    );
    return folders;
  }
  @Get('/aac/folders/:id')
  @UseGuards(DeviceGuard)
  async getFolderById(
    @DeviceFromReq() device: Device,
    @Param('id', ParseObjectIdPipe) folderId,
  ) {
    const folder = await this.aacFoldersService.getClientFolderByDeviceIdAndId(
      device._id,
      folderId as Types.ObjectId,
    );
    return folder;
  }

  @Post('/aac-played')
  @UseGuards(DeviceGuard)
  childAacPlayed(
    @DeviceFromReq() device: Device,
    @Body() body: ChildAacPlayedWord,
  ) {
    const aacPlayed = this.aacPlayedService.childAacPlayedByDeviceId(
      body,
      device,
    );
    return aacPlayed;
  }

  @Get('/safety-feature')
  @UseGuards(DeviceGuard)
  getClientSafety(@DeviceFromReq() device: Device) {
    return this.sfs.getClientSafetyByDeviceId(device._id);
  }

  @Get('/onboarding-videos')
  getDeviceOnBoardingVideos() {
    return this.acService.getOnBoardVideos();
  }

  @Get('/reminders')
  @UseGuards(DeviceGuard)
  async getReminders(@DeviceFromReq() device: Device) {
    const reminders = await this.rs.getClientRemindersByDeviceId(device._id);
    return reminders;
  }

  @Get('/reminders/:id')
  @UseGuards(DeviceGuard)
  async getReminderById(
    @DeviceFromReq() device: Device,
    @Param('id', ParseObjectIdPipe) reminderId,
  ) {
    const reminder = await this.rs.getClientReminderByDeviceAndId(
      device._id,
      reminderId as Types.ObjectId,
    );
    return reminder;
  }

  @Get('/sentence-mp3')
  @UseGuards(DeviceGuard)
  async getSentenceMp3(
    @DeviceFromReq() device: Device,
    @Query('sentence', new DefaultValuePipe('')) sentence: string,
  ) {
    const mp3 = await this.deviceService.getSentenceMp3(
      device._id,
      sentence,
      false,
    );
    return mp3;
  }

  @Post('/completed-reminder')
  @UseGuards(DeviceGuard)
  childCompletedReminder(
    @DeviceFromReq() device: Device,
    @Body() body: CompleteReminderDto,
  ) {
    const reminder = this.crs.childCompletedReminderByDeviceId(body, device);
    return reminder;
  }

  @Get('/checklists')
  @UseGuards(DeviceGuard)
  async getChecklists(@DeviceFromReq() device: Device) {
    const checklists = await this.checklistsService.getClientChecklistsByDeviceId(
      device._id,
    );
    return checklists;
  }

  @Get('/checklists/:id')
  @UseGuards(DeviceGuard)
  async getChecklistById(
    @DeviceFromReq() device: Device,
    @Param('id', ParseObjectIdPipe) checklistId,
  ) {
    const checklist = await this.checklistsService.getClientChecklistByDeviceAndId(
      device._id,
      checklistId as Types.ObjectId,
    );
    return checklist;
  }

  @Post('/completed-checklist')
  @UseGuards(DeviceGuard)
  async saveChecklistOffline(
    @DeviceFromReq() device: Device,
    @Body() body: SaveOfflineCompletedChecklist,
  ) {
    const checklist = await this.ccs.saveOffline(body, device);
    return checklist;
  }
  @Put('/completed-checklist/:completedChecklistId')
  @UseGuards(DeviceGuard)
  async updatedChecklistOffline(
    @DeviceFromReq() device: Device,
    @Param('completedChecklistId', ParseObjectIdPipe)
    completedChecklistId,
    @Body() body: SaveOfflineCompletedChecklist,
  ) {
    const checklist = await this.ccs.updateOffline(
      completedChecklistId,
      body,
      device,
    );
    return checklist;
  }

  @UseGuards(DeviceGuard)
  @Get('/clients')
  getClientsByDevice(@DeviceFromReq() device: Device) {
    return this.deviceService.getClientsByDevice(device);
  }

  @UseGuards(DeviceGuard)
  @Put('/switch-client/:switchedClientId')
  switchClientByDevice(
    @DeviceFromReq() device: Device,
    @Param('switchedClientId', ParseObjectIdPipe) switchedClientId,
  ) {
    return this.deviceService.switchClientByDevice(device, switchedClientId);
  }

  @Get('/sleep-mode')
  @UseGuards(DeviceGuard)
  async getSleepModeByDevice(@DeviceFromReq() device: Device) {
    const sleepMode = await this.deviceService.getSleepModeByDevice(device);
    return sleepMode;
  }

  @Get('/game-configs')
  @UseGuards(DeviceGuard)
  async getGameConfigByDevice(@DeviceFromReq() device: Device) {
    const gameConfig = await this.deviceService.getGameConfigByDevice(device);
    return gameConfig;
  }

  @Put('/game-configs/update-points')
  @UseGuards(DeviceGuard)
  async updatePoints(
    @DeviceFromReq() device: Device,
    @Body() body: UpdatePointsDto,
  ) {
    const updatedClient = await this.deviceService.updatePoints(
      device,
      body.minutesPlayed,
    );
    return updatedClient;
  }

  @Get('/time-by-timezone')
  getTimeByTimeZone() {
    return this.deviceService.getTimeByTimeZone();
  }

  @Put('/aac/update-talker-volume')
  @UseGuards(DeviceGuard)
  aacUpdateTalkerVolume(
    @DeviceFromReq() device: Device,
    @Body() body: AacVolumeDto,
  ) {
    const client = this.deviceService.aacUpdateTalkerVolume(
      device,
      body.talkerVolume,
    );
    return client;
  }

  @Get('/lab-words')
  @UseGuards(DeviceGuard)
  getLabWords(@DeviceFromReq() device: Device) {
    return this.deviceService.getLabWords(device);
  }

  @Get('/aac/template-words')
  @UseGuards(DeviceGuard)
  async getTemplateWords(@DeviceFromReq() device: Device) {
    const words = await this.aacWordsService.getTemplateWordsByDeviceId(
      device._id,
    );
    return words;
  }

  @Put('/reset-puzzle/:puzzleId')
  @UseGuards(DeviceGuard)
  resetPuzzle(
    @DeviceFromReq() device: Device,
    @Param('puzzleId', ParseObjectIdPipe) puzzleId,
  ) {
    return this.deviceService.resetPuzzle(device, puzzleId);
  }
}
