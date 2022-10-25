import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AppVersionsService } from './app-versions.service';
import { CreateAppVersionDto } from './dto/CreateAppVersion.dto';

@UseGuards(AuthGuard)
@Controller('app-versions')
export class AppVersionsController {
  constructor(private appVersionService: AppVersionsService) {}
  @Post('')
  create(@Body() body: CreateAppVersionDto) {
    return this.appVersionService.create(body);
  }
}
