import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from '../clients/clients.module';
import { UsersModule } from '../users/users.module';
import { AppLogsController } from './app-logs.controller';
import { AppLogsService } from './app-logs.service';
import { AppLogs, AppLogsSchema } from './schema/app-logs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AppLogs.name, schema: AppLogsSchema }]),
    forwardRef(() => ClientsModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [AppLogsController],
  providers: [AppLogsService],
  exports: [AppLogsService],
})
export class AppLogsModule {}
