import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as BB from 'bluebird';
import { Model, Types } from 'mongoose';
import { SleepModeService } from '../sleep-mode/sleep-mode.service';
import { CreateSleepAid } from './dto/CreateSleepAid';
import { CreateTileDto } from './dto/CreateTileDto';
import { CreateVideoDto } from './dto/CreateVideoDto';
import { UpdateSleepAid } from './dto/UpdateSleepAid';
import { UpdateTileDto } from './dto/UpdateTileDto';
import { UpdateVideoDto } from './dto/UpdateVideoDto';
import { AdminConfig } from './schema/admin-config.schema';

@Injectable()
export class AdminConfigService {
  constructor(
    @InjectModel(AdminConfig.name) private AdminConfigModel: Model<AdminConfig>,
    @Inject(forwardRef(() => SleepModeService))
    private sleepModeService: SleepModeService,
  ) {}

  async createOnBoardVideo(createVideoData: CreateVideoDto) {
    const existingObject = await this.AdminConfigModel.findOne({});
    let adminConfig;

    if (existingObject) {
      existingObject.deviceVideos.unshift({
        appName: createVideoData.appName.toLowerCase(),
        fileSize: createVideoData.fileSize,
        updatedAt: new Date(),
        url: createVideoData.url,
      });
      adminConfig = existingObject.save();
    } else {
      const deviceVideos = [];
      createVideoData.updatedAt = new Date();
      createVideoData.appName = createVideoData.appName.toLowerCase();
      deviceVideos.push(createVideoData);

      adminConfig = new this.AdminConfigModel({
        deviceVideos,
      });
      adminConfig.save();
    }
    return adminConfig;
  }

  async updateOnBoardVideo(
    id: Types.ObjectId,
    updateVideoData: UpdateVideoDto,
  ) {
    const adminConfig = await this.AdminConfigModel.findOne();
    adminConfig.deviceVideos.forEach(video => {
      if (video._id.toString() == id.toString()) {
        video.appName = updateVideoData.appName.toLowerCase();
        video.fileSize = updateVideoData.fileSize;
        video.url = updateVideoData.url;
        video.updatedAt = new Date();
      }
    });
    return adminConfig.save();
  }

  async getOnBoardVideos() {
    const adminConfig = await this.AdminConfigModel.findOne().lean();
    return adminConfig.deviceVideos.reverse();
  }

  async createOnBoardTile(createTileData: CreateTileDto) {
    const existingObject = await this.AdminConfigModel.findOne();
    let adminConfig;

    if (existingObject) {
      const duplicatePosition = existingObject.careGiverTiles.find(
        tile =>
          tile.position == createTileData.position &&
          tile.category == createTileData.category,
      );
      if (duplicatePosition)
        throw new BadRequestException(
          `position ${createTileData.position} already exists`,
        );

      existingObject.careGiverTiles.unshift({
        headline: createTileData.headline,
        description: createTileData.description,
        category: createTileData.category,
        detailsDescription: createTileData.detailsDescription,
        url: createTileData.url,
        detailUrl: createTileData.detailUrl,
        appearAfterDays: createTileData.appearAfterDays,
        position: createTileData.position,
        updatedAt: new Date(),
      });
      adminConfig = existingObject.save();
    } else {
      const careGiverTiles = [];
      createTileData.updatedAt = new Date();
      createTileData.headline = createTileData.headline.toLowerCase();
      careGiverTiles.push(createTileData);

      adminConfig = new this.AdminConfigModel({
        careGiverTiles,
      });
      adminConfig.save();
    }
    return adminConfig;
  }

  async updateOnBoardTile(id: Types.ObjectId, updateTileData: UpdateTileDto) {
    const adminConfig = await this.AdminConfigModel.findOne();

    if (!adminConfig)
      throw new BadRequestException(`admin config does not exists`);

    const duplicatePosition = adminConfig.careGiverTiles.find(
      tile =>
        tile.position == updateTileData.position &&
        tile.category == updateTileData.category &&
        tile._id.toString() != id.toString(),
    );
    if (duplicatePosition)
      throw new BadRequestException(
        `position ${updateTileData.position} already exists for another tile`,
      );

    adminConfig.careGiverTiles.forEach(tile => {
      if (tile._id.toString() == id.toString()) {
        (tile.headline = updateTileData.headline),
          (tile.description = updateTileData.description),
          (tile.category = updateTileData.category),
          (tile.url = updateTileData.url),
          (tile.detailsDescription = updateTileData.detailsDescription),
          (tile.detailUrl = updateTileData.detailUrl),
          (tile.appearAfterDays = updateTileData.appearAfterDays),
          (tile.position = updateTileData.position),
          (tile.updatedAt = new Date());
      }
    });
    return adminConfig.save();
  }

  async getOnBoardTiles() {
    const adminConfig = await this.AdminConfigModel.findOne().lean();
    if (!adminConfig) throw new BadRequestException(`no admin config exists`);
    return adminConfig.careGiverTiles;
  }

  async getOnBoardingTileById(tileId: Types.ObjectId) {
    const adminConfig = await this.AdminConfigModel.findOne(
      { careGiverTiles: { $elemMatch: { _id: tileId } } },
      { _id: 0, 'careGiverTiles.$': 1 },
    ).lean();

    return adminConfig.careGiverTiles[0];
  }

  async deleteOnBoardTile(id: Types.ObjectId) {
    const adminConfig = await this.AdminConfigModel.findOne().lean();

    const updatedAdminConfig = await this.AdminConfigModel.findByIdAndUpdate(
      { _id: adminConfig._id },
      { $pull: { careGiverTiles: { _id: id } } },
      { new: true },
    );
    return updatedAdminConfig.careGiverTiles;
  }

  async createSleepAid(data: CreateSleepAid) {
    const adminConfig = await this.AdminConfigModel.findOne();
    if (!adminConfig) {
      const sleepAids = [];
      sleepAids.push(data);
      const adminConfig = await new this.AdminConfigModel({
        sleepAids,
      }).save();
      return adminConfig.sleepAids;
    } else {
      adminConfig.sleepAids.push(data);
      adminConfig.save();
      return adminConfig.sleepAids;
    }
  }

  async updateSleepAid(id: Types.ObjectId, data: UpdateSleepAid) {
    const adminConfig = await this.AdminConfigModel.findOne();
    adminConfig.sleepAids.forEach(aid => {
      if (aid._id.toString() == id.toString()) {
        aid.videos = data.videos;
      }
    });
    adminConfig.save();
    return adminConfig.sleepAids;
  }

  async getSleepAids() {
    const adminConfig = await this.AdminConfigModel.findOne().lean();
    await BB.map(adminConfig.sleepAids, async sleepMode => {
      sleepMode.soundUserCount = await this.sleepModeService.getAudioCount(
        sleepMode.audioUrl,
      );
      await BB.map(sleepMode.videos, async video => {
        video.videoUserCount = await this.sleepModeService.getVideoCount(
          video.videoUrl,
        );
      });
    });
    return adminConfig.sleepAids;
  }

  async deleteSleepAid(id: Types.ObjectId) {
    const adminConfig = await this.AdminConfigModel.findOne().lean();

    const updatedAdminConfig = await this.AdminConfigModel.findByIdAndUpdate(
      { _id: adminConfig._id },
      { $pull: { sleepAids: { _id: id } } },
      { new: true },
    );
    return updatedAdminConfig.sleepAids;
  }
}
