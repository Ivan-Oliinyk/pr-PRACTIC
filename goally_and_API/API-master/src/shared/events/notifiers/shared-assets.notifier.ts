import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { AwsUploadService } from 'src/shared/transformer/AwsUpload.service';
import { SocketBase } from 'src/socket/socket-base.gateway';
import { GoallyEventEmitter } from '../const';

@Injectable()
export class SharedAssetNotifier implements OnModuleInit {
  constructor(
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private baseSocket: SocketBase,
    private aws: AwsUploadService,
  ) {}

  onModuleInit() {
    this.emitter.on('AssetShared', async url => await this.assetShared(url));
  }
  assetShared(url) {
    this.aws.shareFileToGoally(url);
  }
}
