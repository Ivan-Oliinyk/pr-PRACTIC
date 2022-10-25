import {
  Body,
  Controller,
  DefaultValuePipe,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/entities/users/schema';
import { UserFromReq } from 'src/shared/decorators';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { NewCheckoutDto } from 'src/shared/recurly/dto/NewCheckoutDto';
import { AuthService } from './auth.service';
import { ForgotPwdDto, LoginDto, RegistrationDto, ResetPwdDto } from './dto/';
import { GetAccessTokenDto } from './dto/GetAccessTokenDto';
import { SendOtpDto } from './dto/SendOtpDto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginData: LoginDto) {
    try {
      const userFromDb = await this.authService.login(loginData);
      return userFromDb;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.FORBIDDEN);
    }
  }

  @Post('/sign-up')
  async signUp(@Body() signUpData: RegistrationDto) {
    try {
      const userFromDb = await this.authService.signUp(signUpData);
      return userFromDb;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  // @Post('/sign-up-with-payment')
  // async signUpWithPayment(@Body() signUpData: RegistrationWithPaymentDto) {
  //   try {
  //     const userFromDb = await this.authService.signUpWithPayment(signUpData);
  //     return userFromDb;
  //   } catch (e) {
  //     throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  @Post('/reset-pwd')
  async resetPwd(@Body() resetPwdData: ResetPwdDto) {
    try {
      const request = await this.authService.resetPwd(resetPwdData);
      return request;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Post('/forgot-pwd')
  async forgotPwd(@Body() forgotPwdData: ForgotPwdDto) {
    try {
      const { idOfRequest, email } = await this.authService.forgotPwd(
        forgotPwdData,
      );
      return {
        idOfRequest,
        email,
        message: 'Mail was sent to your email',
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  async logout(@UserFromReq() user: User) {
    try {
      const result = await this.authService.logout(user.token, user);
      return result;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Post('/new-checkout-with-recurly')
  async checkoutWithRecurly(@Body() newCheckoutDto: NewCheckoutDto) {
    try {
      const userFromDb = await this.authService.newCheckoutWithRecurly(
        newCheckoutDto,
      );
      return userFromDb;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/send-otp')
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    try {
      return await this.authService.sendOtp(sendOtpDto);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/get-access-token')
  async getAccessToken(@Body() getAccessToken: GetAccessTokenDto) {
    try {
      return await this.authService.getAccessToken(getAccessToken);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/accept-invite-by-code/:code')
  async acceptInviteByCode(
    @UserFromReq() user: User,
    @Param('code', new DefaultValuePipe('')) code: string,
  ) {
    const userFromDb = await this.authService.acceptInviteByCode(user, code);
    return userFromDb;
  }
}
