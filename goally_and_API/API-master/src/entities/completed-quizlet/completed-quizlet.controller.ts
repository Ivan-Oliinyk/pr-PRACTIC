import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserFromReq } from 'src/shared/decorators';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { UserAccessToTheClient } from 'src/shared/guards/user-access-client.guard';
import { ParseObjectIdPipe } from 'src/shared/pipes/ObjectId.pipe';
import { User } from '../users/schema';
import { CompletedQuizletService } from './completed-quizlet.service';

@Controller('completed-quizlet')
@UseGuards(AuthGuard)
export class CompletedQuizletController {
  constructor(private completedQuizService: CompletedQuizletService) { }

  @Get('/all')
  @UseGuards(UserAccessToTheClient)
  async getAllCompletedQuizlet(
    @UserFromReq() user: User,
    @Query('daysBefore', new DefaultValuePipe(1), ParseIntPipe)
    daysBefore: number,
  ) {
    const quizlets = await this.completedQuizService.getAllCompletedQuiz(
      user,
      daysBefore,
    );
    return quizlets;
  }

  @Get('/:clientId')
  @UseGuards(UserAccessToTheClient)
  async getChildCompletedQuizlet(
    @Param('clientId', ParseObjectIdPipe) clientId,
    @UserFromReq() user: User,
    @Query('daysBefore', new DefaultValuePipe(1), ParseIntPipe)
    daysBefore: number,
  ) {
    const quizlets = await this.completedQuizService.getChildCompletedQuiz(
      clientId,
      user,
      daysBefore,
    );
    return quizlets;
  }
}
