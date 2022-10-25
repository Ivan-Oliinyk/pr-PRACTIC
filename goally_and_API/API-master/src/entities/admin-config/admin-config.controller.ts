import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserFromReq } from 'src/shared/decorators';
import { AdminGuard } from 'src/shared/guards/admin.guard';
import { ParseObjectIdPipe } from 'src/shared/pipes/ObjectId.pipe';
import { Admin } from '../admin/schema/admin.schema';
import { AdminConfigService } from './admin-config.service';
import { CreateSleepAid } from './dto/CreateSleepAid';
import { CreateTileDto } from './dto/CreateTileDto';
import { CreateVideoDto } from './dto/CreateVideoDto';
import { UpdateSleepAid } from './dto/UpdateSleepAid';
import { UpdateTileDto } from './dto/UpdateTileDto';
import { UpdateVideoDto } from './dto/UpdateVideoDto';

@UseGuards(AdminGuard)
@Controller('admin-config')
export class AdminConfigController {
  constructor(private acService: AdminConfigService) {}

  @Post('create-device-video')
  async createOnBoardVideo(
    @UserFromReq() user: Admin,
    @Body() body: CreateVideoDto,
  ) {
    const result = await this.acService.createOnBoardVideo(body);
    return result;
  }

  @Put('update-device-video/:id')
  async updateOnBoardVideo(
    @UserFromReq() user: Admin,
    @Param('id', ParseObjectIdPipe) id,
    @Body() body: UpdateVideoDto,
  ) {
    const result = await this.acService.updateOnBoardVideo(id, body);
    return result;
  }

  @Get('device-videos')
  async getOnBoardVideos(@UserFromReq() user: Admin) {
    const result = await this.acService.getOnBoardVideos();
    return result;
  }

  @Post('create-caregiver-tile')
  async createOnBoardTile(
    @UserFromReq() user: Admin,
    @Body() body: CreateTileDto,
  ) {
    const result = await this.acService.createOnBoardTile(body);
    return result;
  }

  @Put('update-caregiver-tile/:id')
  async updateOnBoardTile(
    @UserFromReq() user: Admin,
    @Param('id', ParseObjectIdPipe) id,
    @Body() body: UpdateTileDto,
  ) {
    const result = await this.acService.updateOnBoardTile(id, body);
    return result;
  }

  @Get('caregiver-tiles')
  async getOnBoardTiles(@UserFromReq() user: Admin) {
    const result = await this.acService.getOnBoardTiles();
    return result;
  }

  @Delete('delete-caregiver-tile/:id')
  async deleteOnBoardTile(
    @UserFromReq() user: Admin,
    @Param('id', ParseObjectIdPipe) id,
  ) {
    const result = await this.acService.deleteOnBoardTile(id);
    return result;
  }

  @Post('create-sleep-aid')
  async createSleepAid(
    @UserFromReq() user: Admin,
    @Body() body: CreateSleepAid,
  ) {
    const result = await this.acService.createSleepAid(body);
    return result;
  }

  @Put('update-sleep-aid/:id')
  async updateSleepAid(
    @UserFromReq() user: Admin,
    @Param('id', ParseObjectIdPipe) id,
    @Body() body: UpdateSleepAid,
  ) {
    const result = await this.acService.updateSleepAid(id, body);
    return result;
  }

  @Get('sleep-aids')
  async getSleepAids(@UserFromReq() user: Admin) {
    const result = await this.acService.getSleepAids();
    return result;
  }

  @Delete('delete-sleep-aid/:id')
  async deleteSleepAid(
    @UserFromReq() user: Admin,
    @Param('id', ParseObjectIdPipe) id,
  ) {
    const result = await this.acService.deleteSleepAid(id);
    return result;
  }
}
