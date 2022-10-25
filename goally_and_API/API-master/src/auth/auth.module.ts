import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BehaviorModule } from 'src/entities/behavior/behavior.module';
import { ClientsModule } from 'src/entities/clients/clients.module';
import { DevicesModule } from 'src/entities/devices/devices.module';
import { InvitationModule } from 'src/entities/invitation/invitation.module';
import { QuizletModule } from 'src/entities/quizlet/quizlet.module';
import { ReferralsModule } from 'src/entities/referrals/referrals.module';
import { RewardsModule } from 'src/entities/rewards/rewards.module';
import { RoutinesModule } from 'src/entities/routines/routines.module';
import { SessionsModule } from 'src/entities/sessions/sessions.module';
import { SubscriptionModule } from 'src/entities/subscription/subscription.module';
import { UsersModule } from 'src/entities/users/users.module';
import { RedisModule } from 'src/redis/redis.module';
import { RecurlyModule } from 'src/shared/recurly/recurly.module';
import { SharedModule } from 'src/shared/shared.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ForgotPwdRequest, ForgotPwdRequestSchema } from './forgot-pwd.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ForgotPwdRequest.name, schema: ForgotPwdRequestSchema },
    ]),
    UsersModule,
    SharedModule,
    RedisModule,
    InvitationModule,
    DevicesModule,
    SessionsModule,
    RoutinesModule,
    SubscriptionModule,
    forwardRef(() => RewardsModule),
    forwardRef(() => BehaviorModule),
    forwardRef(() => QuizletModule),
    ReferralsModule,
    ClientsModule,
    RecurlyModule,
    HttpModule,
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
