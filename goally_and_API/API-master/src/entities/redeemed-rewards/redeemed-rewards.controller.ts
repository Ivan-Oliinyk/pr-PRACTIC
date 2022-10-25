import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserFromReq } from 'src/shared/decorators';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ParseObjectIdPipe } from 'src/shared/pipes/ObjectId.pipe';
import { User } from '../users/schema';
import { CreateRedeemReward } from './dto/CreateChildReddemReward.dto';
import { RedeemRewardsService } from './redeemed-rewards.service';
import { Types } from 'mongoose';
import { UserAccessToTheClient } from 'src/shared/guards/user-access-client.guard';
@Controller('redeemed-rewards')
@UseGuards(AuthGuard)
export class RedeemRewardsController {
  constructor(private rrs: RedeemRewardsService) {}

  @Post('')
  async createChildRedeemRewards(
    @Body() rewardData: CreateRedeemReward,
    @UserFromReq() user: User,
  ) {
    const reward = await this.rrs.create(rewardData, user);
    return reward;
  }

  @Delete('/:id')
  async removeChildRedeemRewards(
    @Param('id', ParseObjectIdPipe) id,
    @UserFromReq() user: User,
  ) {
    const reward = await this.rrs.deleteById(id as Types.ObjectId, user);
    return reward;
  }

  @Get('child-library/:clientId')
  @UseGuards(UserAccessToTheClient)
  async getChildRedeemRewards(
    @Param('clientId', ParseObjectIdPipe) clientId,
    @UserFromReq() user: User,
    @Query('daysBefore', new DefaultValuePipe(1), ParseIntPipe)
    daysBefore: number,
  ) {
    const reward = await this.rrs.getChildRedeemRewards(
      clientId as Types.ObjectId,
      user,
      daysBefore,
    );
    return reward;
  }


  @Get('child-library/')
  async getAllRedeemRewards(
    @UserFromReq() user: User,
    @Query('daysBefore', new DefaultValuePipe(1), ParseIntPipe)
    daysBefore: number,
  ) {
    const behaviors = await this.rrs.getAllRedeemRewards(
      user,
      daysBefore,
    );
    return behaviors;
  }
}
