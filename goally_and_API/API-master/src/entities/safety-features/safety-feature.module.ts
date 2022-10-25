import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from '../clients/clients.module';
import { SafetyFeatureController } from './safety-feature.controller';
import { SafetyFeatureService } from './safety-feature.service';
import {
  SafetyFeature,
  SafetyFeatureSchema,
} from './schema/safety-feature.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SafetyFeature.name, schema: SafetyFeatureSchema },
    ]),
    forwardRef(() => ClientsModule),
  ],
  controllers: [SafetyFeatureController],
  providers: [SafetyFeatureService],
  exports: [SafetyFeatureService],
})
export class SafetyFeatureModule {}
