import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserFromReq } from 'src/shared/decorators';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { User } from '../users/schema';
import { ReferralsService } from './referrals.service';

@Controller('referrals')
export class ReferralsController {
  constructor(private referralService: ReferralsService) {}

  @UseGuards(AuthGuard)
  @Get('/code')
  getUserReferralCode(@UserFromReq() user: User) {
    return this.referralService.getUserReferralCode(user);
  }

  @UseGuards(AuthGuard)
  @Get('/redeemed-details')
  getRedeemedDetails(@UserFromReq() user: User) {
    return this.referralService.getRedeemedDetails(user);
  }

  @Get('/user/:code')
  getUserDetailsByReferralCode(
    @UserFromReq() user: User,
    @Param('code', new DefaultValuePipe('')) code: string,
  ) {
    return this.referralService.getUserDetailsByReferralCode(user, code);
  }
}
