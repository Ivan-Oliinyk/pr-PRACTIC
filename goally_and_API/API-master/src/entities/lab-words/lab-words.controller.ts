import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { UserAccessToTheClient } from 'src/shared/guards/user-access-client.guard';
import { ParseObjectIdPipe } from 'src/shared/pipes/ObjectId.pipe';
import { LabWordsService } from './lab-words.service';

@Controller('lab-words')
@UseGuards(AuthGuard)
export class LabWordsController {
  constructor(private lws: LabWordsService) {}

  @Get('get/:clientId')
  @UseGuards(UserAccessToTheClient)
  async get(@Param('clientId', ParseObjectIdPipe) clientId) {
    const labWords = await this.lws.getClientLabWords(clientId);
    return labWords;
  }
}
