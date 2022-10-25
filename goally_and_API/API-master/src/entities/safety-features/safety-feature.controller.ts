import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserFromReq } from 'src/shared/decorators';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { UserAccessToTheClient } from 'src/shared/guards/user-access-client.guard';
import { ParseObjectIdPipe } from 'src/shared/pipes/ObjectId.pipe';
import { User } from '../users/schema';
import { CreateSafetyFeature } from './dto/CreateSafetyFeature';
import { SafetyFeatureService } from './safety-feature.service';

@Controller('safety-features')
@UseGuards(AuthGuard)
export class SafetyFeatureController {
  constructor(private sfs: SafetyFeatureService) {}

  @Post('create')
  @UseGuards(UserAccessToTheClient)
  create(@Body() body: CreateSafetyFeature, @UserFromReq() user: User) {
    return this.sfs.create(body, user);
  }

  @Get('get/:clientId')
  @UseGuards(UserAccessToTheClient)
  getClientSafety(
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
  ) {
    return this.sfs.getSafety(clientId, user);
  }

  @Get('learner-types')
  getLearnerTypes(
    @UserFromReq() user: User,
  ) {
    return this.sfs.getLearnerTypes(user);
  }

  @Put('update/:id')
  @UseGuards(UserAccessToTheClient)
  update(
    @Body() body: CreateSafetyFeature,
    @Param('id', ParseObjectIdPipe) id,
    @UserFromReq() user: User,
  ) {
    return this.sfs.update(body, id, user);
  }
}
