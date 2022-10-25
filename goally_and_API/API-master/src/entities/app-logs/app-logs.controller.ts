import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { UserAccessToTheClient } from 'src/shared/guards/user-access-client.guard';
import { ParseObjectIdPipe } from 'src/shared/pipes/ObjectId.pipe';
import { AppLogsService } from './app-logs.service';

@Controller('app-logs')
@UseGuards(AuthGuard)
export class AppLogsController {
  constructor(private appLogs: AppLogsService) {}

  @Get('client/:clientId/users/:userId')
  @UseGuards(UserAccessToTheClient)
  getLogs(
    @Param('clientId', ParseObjectIdPipe) clientId,
    @Param('userId', ParseObjectIdPipe) userId,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.appLogs.getLogsByClient(clientId, userId, page);
  }
}
