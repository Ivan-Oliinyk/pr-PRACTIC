import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/entities/users/schema';
import { UserFromReq } from 'src/shared/decorators';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { UserAccessToTheClient } from 'src/shared/guards/user-access-client.guard';
import { ParseObjectIdPipe } from 'src/shared/pipes/ObjectId.pipe';
import { AacFoldersService } from './aac-folders.service';
import { CreateFolder } from './dto/CreateFolder';
import { UpdateFolder } from './dto/UpdateFolder';

@Controller('aac-folders')
@UseGuards(AuthGuard)
export class AacFoldersController {
  constructor(private aacFoldersService: AacFoldersService) {}

  @Post('/library')
  create(@Body() body: CreateFolder, @UserFromReq() user: User) {
    return this.aacFoldersService.create(body, user);
  }

  @Put(':id')
  update(
    @Body() body: UpdateFolder,
    @Param('id', ParseObjectIdPipe) id,
    @UserFromReq() user: User,
  ) {
    return this.aacFoldersService.update(body, id, user);
  }

  @Delete(':id')
  deleteById(
    @Param('id', ParseObjectIdPipe) folderId,
    @UserFromReq() user: User,
  ) {
    return this.aacFoldersService.deleteById(folderId, user);
  }

  @Get('library')
  async getUserFolders(@UserFromReq() user: User) {
    return this.aacFoldersService.getUserFolders(user);
  }

  @Get('child-library/:clientId')
  @UseGuards(UserAccessToTheClient)
  getChildFolders(
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
  ) {
    return this.aacFoldersService.getChildFolders(clientId, user);
  }

  @Get('icons/:folderId')
  getUserFolderIcons(
    @Param('folderId', ParseObjectIdPipe) folderId,
    @UserFromReq() user: User,
  ) {
    return this.aacFoldersService.getUserFolderIcons(folderId, user);
  }

  @UseGuards(UserAccessToTheClient)
  @Get('v2-icons/:clientId')
  getUserFolderIconsV2(
    @Param('clientId', ParseObjectIdPipe) clientId,
    @Query('folderId', new DefaultValuePipe(0)) folderId: number,
    @UserFromReq() user: User,
  ) {
    return this.aacFoldersService.getUserFolderIconsV2(
      clientId,
      folderId,
      user,
    );
  }

  @Get(':folderId')
  getFolderById(
    @Param('folderId', ParseObjectIdPipe) folderId,
    @UserFromReq() user: User,
  ) {
    return this.aacFoldersService.findById(folderId);
  }

  @Get('library/folder-search')
  async searchUserFoldersToAddWords(
    @Query('search', new DefaultValuePipe('')) search: string,
    @UserFromReq() user: User,
  ) {
    return this.aacFoldersService.searchUserFoldersToAddWords(search, user);
  }

  @Get('child-library/folder-search/:clientId')
  @UseGuards(UserAccessToTheClient)
  async searchChildFoldersToAddWords(
    @Param('clientId', ParseObjectIdPipe) clientId,
    @Query('search', new DefaultValuePipe('')) search: string,
    @UserFromReq() user: User,
  ) {
    return this.aacFoldersService.searchChildFoldersToAddWords(
      clientId,
      search,
      user,
    );
  }

  @Get('count/:clientId')
  @UseGuards(UserAccessToTheClient)
  async getFolderCount(
    @Param('clientId', ParseObjectIdPipe) clientId,
    @Query('folderId', ParseObjectIdPipe) folderId,
    @UserFromReq() user: User,
  ) {
    return this.aacFoldersService.getFolderCount(clientId, folderId, user);
  }

  @Get('search/:clientId/not-associated/:displayId')
  @UseGuards(UserAccessToTheClient)
  searchNotAssociatedChildFolders(
    @Query('search', new DefaultValuePipe('')) search: string,
    @Param('clientId', ParseObjectIdPipe) clientId,
    @Param('displayId', new DefaultValuePipe('')) displayId,

    @UserFromReq() user: User,
  ) {
    return this.aacFoldersService.searchChildFolders(
      search,
      clientId,
      displayId,
      user,
    );
  }
}
