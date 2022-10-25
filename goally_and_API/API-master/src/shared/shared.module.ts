import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppLogsModule } from 'src/entities/app-logs/app-logs.module';
import { ClientsModule } from 'src/entities/clients/clients.module';
import { DevicesModule } from 'src/entities/devices/devices.module';
import { UsersModule } from 'src/entities/users/users.module';
import { SocketModule } from 'src/socket/socket.module';
import { notifiers } from './events/notifiers';
import { FcmService } from './fcm/fcm.service';
import { MailerService } from './mailer/mailer.service';
import { MessangerService } from './messanger/messanger.service';
import { PdfService } from './pdf/pdf.service';
import { TinyUrlService } from './tiny-url/tiny-url.service';
import { AwsUploadService } from './transformer/AwsUpload.service';
@Module({
  imports: [
    HttpModule,
    ConfigModule,
    SocketModule,
    AppLogsModule,
    forwardRef(() => ClientsModule),
    forwardRef(() => DevicesModule),
    forwardRef(() => UsersModule),
  ],
  providers: [
    MailerService,
    MessangerService,
    TinyUrlService,
    AwsUploadService,
    FcmService,
    ...notifiers,
    PdfService,
  ],
  exports: [
    MailerService,
    MessangerService,
    TinyUrlService,
    AwsUploadService,
    FcmService,
    ...notifiers,
    PdfService,
  ],
})
export class SharedModule {}
