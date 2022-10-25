import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserFromReq } from 'src/shared/decorators';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { User } from '../users/schema';
import { VisAidDto } from './dto/VisAidDto';
import { VisualAidsService } from './visual-aids.service';

@UseGuards(AuthGuard)
@Controller('visual-aids')
export class VisualAidsController {
  constructor(private is: VisualAidsService) {}

  @Get('/categories')
  async getAllCategories() {
    return this.is.getCategories();
  }

  @Get()
  async getUrls(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('aidType', new DefaultValuePipe('')) aidType: string,
  ) {
    return this.is.getUrls(page, limit, aidType, search);
  }

  @Get('/user')
  async getMyPictureUrls(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('aidType', new DefaultValuePipe('')) aidType: string,
    @UserFromReq() user: User,
  ) {
    return this.is.getUserUrls(page, limit, user, aidType, search);
  }

  @Post('/add')
  async add(@Body() body: VisAidDto, @UserFromReq() user: User) {
    return this.is.addUserVisualAid(body, user);
  }

  @Get('all')
  async getAllUrls(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string,
    @UserFromReq() user: User,
  ) {
    return this.is.getAllUrls(page, limit, user, search);
  }
}
