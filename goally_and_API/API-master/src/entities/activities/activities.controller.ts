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
import { User } from 'src/entities/users/schema';
import { UserFromReq } from 'src/shared/decorators';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto, ReorderActivity, UpdateActivityDto } from './dto';

@Controller('activities')
@UseGuards(AuthGuard)
export class ActivitiesController {
  constructor(private activityService: ActivitiesService) {}
  @Post()
  create(@Body() createActivity: CreateActivityDto, @UserFromReq() user: User) {
    return this.activityService.create(user, createActivity);
  }
  @Post()
  reorderActivity(@Body() data: ReorderActivity) {
    return this.activityService.reorderActivityInsideRoutine(data);
  }

  @Get()
  getUsersActivities(@UserFromReq() user: User) {
    return this.activityService.getActivitiesForUser(user);
  }
  @Get('/:id')
  getUsersActivityById(@Param('id') activityId, @UserFromReq() user: User) {
    return this.activityService.getByIdWithCreatedBy(activityId, user);
  }

  @Put('/:id')
  update(
    @Param('id') activityId,
    @UserFromReq() user: User,
    @Body() updateActivity: UpdateActivityDto,
  ) {
    return this.activityService.update(activityId, user, updateActivity);
  }

  @Delete('/:id')
  delete(@Param('id') activityId, @UserFromReq() user: User) {
    return this.activityService.deleteById(activityId, user);
  }
}
