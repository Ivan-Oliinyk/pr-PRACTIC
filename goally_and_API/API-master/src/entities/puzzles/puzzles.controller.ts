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
import { UserFromReq } from 'src/shared/decorators';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { UserAccessToTheClient } from 'src/shared/guards/user-access-client.guard';
import { ParseObjectIdPipe } from 'src/shared/pipes/ObjectId.pipe';
import { User } from '../users/schema';
import { CreateCategoryDto } from './dto/CreateCategoryDto';
import { CreatePuzzleDto } from './dto/CreatePuzzleDto';
import { HidePuzzleDto } from './dto/HidePuzzleDto';
import { ResetPuzzleDto } from './dto/ResetPuzzleDto';
import { PuzzlesService } from './puzzles.service';

@Controller('puzzles')
@UseGuards(AuthGuard)
export class PuzzlesController {
  constructor(private puzzleService: PuzzlesService) {}

  @UseGuards(UserAccessToTheClient)
  @Get('all/:clientId')
  async getPuzzlesWithCategories(
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
  ) {
    return this.puzzleService.getAllPuzzles(clientId, user);
  }

  @Get('get-by-category/:clientId')
  async getPuzzlesByCategories(
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
    @Query('category', new DefaultValuePipe('')) category: string,
  ) {
    return this.puzzleService.getPuzzlesByCategories(clientId, category, user);
  }

  @UseGuards(UserAccessToTheClient)
  @Get('v2-category/:clientId')
  async getPuzzlesCategoryV2(
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
  ) {
    return this.puzzleService.getPuzzlesCategoriesV2(clientId, user);
  }

  @UseGuards(UserAccessToTheClient)
  @Put('/hide')
  hidePuzzle(@UserFromReq() user: User, @Body() puzzleDto: HidePuzzleDto) {
    return this.puzzleService.hidePuzzle(puzzleDto, user);
  }

  @UseGuards(UserAccessToTheClient)
  @Put('/reset')
  resetPuzzle(@UserFromReq() user: User, @Body() puzzleDto: ResetPuzzleDto) {
    return this.puzzleService.resetPuzzle(puzzleDto);
  }

  @UseGuards(UserAccessToTheClient)
  @Put('/reset-all/:clientId')
  resetAllPuzzles(
    @Param('clientId', ParseObjectIdPipe) clientId,
    @UserFromReq() user: User,
  ) {
    return this.puzzleService.resetAllPuzzles(clientId, user);
  }

  @UseGuards(UserAccessToTheClient)
  @Put('/reset-category/:clientId')
  resetCategoryPuzzles(
    @Param('clientId', ParseObjectIdPipe) clientId,
    @Query('category', new DefaultValuePipe('')) category: string,
    @UserFromReq() user: User,
  ) {
    return this.puzzleService.resetCategoryPuzzles(category, clientId, user);
  }

  @UseGuards(UserAccessToTheClient)
  @Post('/create-category')
  createCategory(
    @UserFromReq() user: User,
    @Body() createCategory: CreateCategoryDto,
  ) {
    return this.puzzleService.createCategory(createCategory, user);
  }

  @UseGuards(UserAccessToTheClient)
  @Post('/create')
  addPuzzleInCategory(
    @UserFromReq() user: User,
    @Body() createPuzzle: CreatePuzzleDto,
  ) {
    return this.puzzleService.createPuzzle(createPuzzle, user);
  }

  @Delete('/:id')
  delete(@Param('id', ParseObjectIdPipe) id, @UserFromReq() user: User) {
    return this.puzzleService.deleteById(id, user);
  }

  @UseGuards(UserAccessToTheClient)
  @Delete('/:clientId/:category')
  deleteCategoryByName(
    @Param('clientId', ParseObjectIdPipe) clientId,
    @Param('category', new DefaultValuePipe('')) category,
    @UserFromReq() user: User,
  ) {
    return this.puzzleService.deleteCategoryByName(clientId, category, user);
  }
}
