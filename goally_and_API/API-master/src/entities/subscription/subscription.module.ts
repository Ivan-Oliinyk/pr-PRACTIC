import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'src/config';
import { UsersModule } from 'src/entities/users/users.module';
import { RecurlyModule } from 'src/shared/recurly/recurly.module';
import { SharedModule } from 'src/shared/shared.module';
import { ShippoModule } from 'src/shared/shippo/shippo.module';
import { Subscription, SubscriptionSchema } from './schema/subscription';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
    forwardRef(() => SharedModule),
    HttpModule.register({
      baseURL: config().REFERSION_API_URL,
      headers: {
        'Refersion-Secret-Key': config().REFERSION_PRIVATE_KEY,
        'Refersion-Public-Key': config().REFERSION_PUBLIC_KEY,
      },
    }),
    ConfigModule,
    RecurlyModule,
    ShippoModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
