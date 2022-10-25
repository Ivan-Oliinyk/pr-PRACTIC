import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Device } from '../devices/schemas';
import { CreateAppVersionDto } from './dto/CreateAppVersion.dto';
import { AppVersion } from './schema/app-version.shema';

@Injectable()
export class AppVersionsService {
  constructor(
    @InjectModel(AppVersion.name) private AppVersion: Model<AppVersion>,
  ) {}
  async checkUpgrade(device: Device) {
    const appLatestVersion = device.desiredVersion
      ? await this.getDesiredVersion(device)
      : await this.getLastVersion(device);

    const isLatestVersionUsed = device.appVersion >= appLatestVersion.version;
    return {
      deviceAppVersion: device.appVersion,
      deviceDesiredVersion: device.desiredVersion,
      isLatestVersionUsed,
      appLatestVersion,
    };
  }
  create(body: CreateAppVersionDto) {
    const newAppVersion = new this.AppVersion(body);
    return newAppVersion.save();
  }

  async getDesiredVersion(device: Device) {
    const appLatestVersion = await this.AppVersion.findOne({
      appId: device.appId,
      version: device.desiredVersion,
    }).sort({
      createdAt: -1,
    });

    if (!appLatestVersion) {
      console.log(device.desiredVersion);
      return await this.getLastVersion(device);
    }

    return appLatestVersion;
  }

  async getLastVersion(device: Device) {
    const appLatestVersion = await this.AppVersion.findOne({
      appId: device.appId,
      isNotForPublic: { $ne: true },
    }).sort({
      version: -1,
    });
    if (!appLatestVersion)
      throw new BadRequestException('Please upload at least one app version');

    return appLatestVersion;
  }
}
