import {
  BadRequestException,
  Controller,
  DefaultValuePipe,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserFromReq } from 'src/shared/decorators/UserFromReq';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { User } from '../users/schema';
import { PollyService } from './polly.service';

@Controller('polly')
@UseGuards(AuthGuard)
export class PollyController {
  constructor(private pollyService: PollyService) {}

  @Get('/aac-voices')
  async getVoice(@UserFromReq() user: User) {
    return this.pollyService.getAacVoices(user);
  }

  @Get('/sentence-mp3')
  async getSentenceMp3(
    @Query('sentence', new DefaultValuePipe('')) sentence: string,
    @Query('voiceId', new DefaultValuePipe('')) voiceId: string,
    @UserFromReq() user: User,
  ) {
    if (!sentence) throw new BadRequestException(`sentence does not exists`);
    if (!voiceId) throw new BadRequestException(`voiceid does not exists`);
    const text = `<speak><prosody volume="loud">${sentence}</prosody></speak>`;

    const mp3 = await this.pollyService.getSentenceMp3(voiceId, text);
    return mp3;
  }

  @Get('/url-mp3')
  async getSentenceUrlMp3(
    @Query('sentence', new DefaultValuePipe('')) sentence: string,
    @Query('voiceId', new DefaultValuePipe('')) voiceId: string,
    @UserFromReq() user: User,
  ) {
    try {
      if (!sentence) throw new BadRequestException(`sentence does not exists`);
      if (!voiceId) throw new BadRequestException(`voiceid does not exists`);

      const voices = [];
      voices.push({ voiceId });
      const url = await this.pollyService.initSpeechFile(
        voices,
        sentence,
        false,
      );
      return { link: url[0] };
    } catch (e) {
      return {
        success: false,
        error: e,
      };
    }
  }
}
