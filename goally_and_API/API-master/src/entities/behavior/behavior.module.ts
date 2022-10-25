import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from '../clients/clients.module';
import { DevicesModule } from '../devices/devices.module';
import { UsersModule } from '../users/users.module';
import { BehaviorController } from './behavior.controller';
import { BehaviorService } from './behavior.service';
import { Behavior, BehaviorSchema } from './schema/behavior.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Behavior.name, schema: BehaviorSchema },
    ]),
    ClientsModule,
    UsersModule,
    forwardRef(() => DevicesModule),
  ],
  controllers: [BehaviorController],
  providers: [BehaviorService],
  exports: [BehaviorService],
})
export class BehaviorModule {}
