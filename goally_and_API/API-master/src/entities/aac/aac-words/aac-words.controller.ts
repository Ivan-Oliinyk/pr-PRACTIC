import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseFloatPipe,
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
import { CreateChildFolder } from '../aac-folders/dto/CreateChildFolder';
import { CreateChildSubFolder } from '../aac-folders/dto/CreateChildSubFolder';
import { AacWordsService } from './aac-words.service';
import { AddWordsDto } from './dto/AddWords.dto';
import { CopyWord } from './dto/CopyWord';
import { CreateChildGrouping } from './dto/CreateChildGrouping';
import { CreateChildWord } from './dto/CreateChildWord';
import { CreateWord } from './dto/CreateWord';
import { DeleteWordsDto } from './dto/DeleteWords';
import { UpdateWord } from './dto/UpdateWord';
import { UpdateWordsDto } from './dto/UpdateWords.dto';

@Controller('aac-words')
@UseGuards(AuthGuard)
export class AacWordsController {
  constructor(private aacWordsService: AacWordsService) {}

  @Post('library')
  create(@Body() body: CreateWord, @UserFromReq() user: User) {
    return this.aacWordsService.create(body, user);
  }

  @Post('child-library/word')
  @UseGuards(UserAccessToTheClient)
  createWordForChild(@Body() body: CreateChildWord, @UserFromReq() user: User) {
    return this.aacWordsService.createWordForChild(body, user);
  }

  @Post('child-library/folder')
  @UseGuards(UserAccessToTheClient)
  createFolderForChild(
    @Body() body: CreateChildFolder,
    @UserFromReq() user: User,
  ) {
    return this.aacWordsService.createFolderForChild(body, user);
  }

  @Post('child-library/subFolder')
  @UseGuards(UserAccessToTheClient)
  createSubFolderForChild(
    @Body() body: CreateChildSubFolder,
    @UserFromReq() user: User,
  ) {
    return this.aacWordsService.createSubFolderForChild(body, user);
  }

  @Post('child-library/grouping')
  @UseGuards(UserAccessToTheClient)
  createGroupingForChild(
    @Body() body: CreateChildGrouping,
    @UserFromReq() user: User,
  ) {
    return this.aacWordsService.createGroupingForChild(body, user);
  }

  @Get('library')
  async getUserWords(
    @Query('folderId', ParseObjectIdPipe) folderId,
    @UserFromReq() user: User,
  ) {
    return await this.aacWordsService.getUserWords(folderId, user);
  }

  @Get('library/search')
  async getUserSearchWords(
    @Query('search', new DefaultValuePipe('')) search: string,
    @UserFromReq() user: User,
  ) {
    return this.aacWordsService.getUserSearchWords(search, user);
  }

  @Get('child-library/:clientId')
  @UseGuards(UserAccessToTheClient)
  getChildWords(
    @Query('folderId', ParseObjectIdPipe) folderId,
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
  ) {
    return this.aacWordsService.getChildWords(folderId, clientId, user);
  }

  @Get('child-library/parent-folder/:clientId')
  @UseGuards(UserAccessToTheClient)
  getParentFolderWords(
    @Query('folderId', ParseObjectIdPipe) folderId,
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
  ) {
    return this.aacWordsService.getParentFolderWords(folderId, clientId, user);
  }

  @Get('child-library/search/:clientId')
  @UseGuards(UserAccessToTheClient)
  getChildSearchWords(
    @Query('search', new DefaultValuePipe('')) search: string,
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
  ) {
    return this.aacWordsService.getChildSearchWords(search, clientId, user);
  }

  @Put(':id')
  update(
    @Body() body: UpdateWord,
    @Param('id', ParseObjectIdPipe) id,
    @UserFromReq() user: User,
  ) {
    return this.aacWordsService.update(body, id, user);
  }

  @Post('delete-list/:clientId')
  @UseGuards(UserAccessToTheClient)
  deleteList(
    @Body() body: DeleteWordsDto,
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
  ) {
    return this.aacWordsService.deleteList(body, clientId, user);
  }

  @Delete(':id')
  deleteById(
    @Param('id', ParseObjectIdPipe) wordId,
    @UserFromReq() user: User,
  ) {
    return this.aacWordsService.deleteById(wordId, user);
  }

  @Get('child-library/:wordId/model')
  modelWordForChild(
    @Param('wordId', ParseObjectIdPipe) wordId,
    @UserFromReq() user: User,
  ) {
    return this.aacWordsService.modelChildWord(wordId, user);
  }

  @UseGuards(UserAccessToTheClient)
  @Get('child-library/:wordId/hide')
  hideWordForChild(
    @Param('wordId', ParseObjectIdPipe) wordId,
    @UserFromReq() user: User,
  ) {
    return this.aacWordsService.hideChildWord(wordId, user);
  }

  @Get('child-library/:wordId/pin')
  pinWordForChild(
    @Param('wordId', ParseObjectIdPipe) wordId,
    @UserFromReq() user: User,
  ) {
    return this.aacWordsService.pinChildWord(wordId, user);
  }

  @Put('update-pins/:folderId')
  updatePins(
    @Param('folderId', ParseObjectIdPipe) folderId,
    @UserFromReq() user: User,
  ) {
    return this.aacWordsService.updatePins(folderId, user);
  }

  @Get('reset/:clientId')
  @UseGuards(UserAccessToTheClient)
  async resetAac(
    @Param('clientId', ParseObjectIdPipe) clientId,
    @UserFromReq() user: User,
  ) {
    const response = await this.aacWordsService.resetAac(clientId, user);
    return response;
  }

  @Get('child-library-and-template/search/:clientId')
  @UseGuards(UserAccessToTheClient)
  getChildAndTemplateSearchWords(
    @Query('search', new DefaultValuePipe('')) search: string,
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
  ) {
    return this.aacWordsService.getChildAndTemplateSearchWords(
      search,
      clientId,
      user,
    );
  }

  @Get('all/:clientId')
  @UseGuards(UserAccessToTheClient)
  getAllWords(
    @Query('folderDisplayId', ParseFloatPipe) folderDisplayId,
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
  ) {
    return this.aacWordsService.getAllWords(folderDisplayId, clientId, user);
  }

  @Post('list/:clientId')
  @UseGuards(UserAccessToTheClient)
  addList(
    @Body() body: AddWordsDto,
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
  ) {
    return this.aacWordsService.addList(body, clientId, user);
  }

  @Put('list/:clientId')
  @UseGuards(UserAccessToTheClient)
  updateList(
    @Body() body: UpdateWordsDto,
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
  ) {
    return this.aacWordsService.updateList(body, clientId, user);
  }

  @Post('child-library/copy/:clientId')
  @UseGuards(UserAccessToTheClient)
  copyWord(
    @Body() body: CopyWord,
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
  ) {
    return this.aacWordsService.copyWord(body, clientId, user);
  }
  @Get('folders/:clientId')
  @UseGuards(UserAccessToTheClient)
  getFolders(
    @Query('displayId', new DefaultValuePipe('')) displayId,
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
  ) {
    return this.aacWordsService.getFolders(displayId, clientId, user);
  }

  @Delete(':clientId/:folderId/:wordDisplayId')
  removeFromFolder(
    @Param('clientId', ParseObjectIdPipe) clientId,
    @Param('folderId', ParseObjectIdPipe) folderId,
    @Param('wordDisplayId', new DefaultValuePipe('')) wordDisplayId,
    @UserFromReq() user: User,
  ) {
    return this.aacWordsService.removeFromFolder(
      clientId,
      folderId,
      wordDisplayId,
      user,
    );
  }
}
