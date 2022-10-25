/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as P from 'path';
import { EnvironmentVariables } from 'src/config';
import { AwsUploadService } from 'src/shared/transformer/AwsUpload.service';
import { AidUploadDto } from './dto/AidUploadDto';

@Controller('upload')
export class UploadController {
  bucket: string;
  region: string;

  constructor(
    private transform: AwsUploadService,
    private config: ConfigService<EnvironmentVariables>,
  ) {
    this.bucket = this.config.get('AWS_BUCKET');
    this.region = this.config.get('AWS_REGION');
  }
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './static/uploads',
        filename: function(req, file, cb) {
          console.log(file);
          console.log(req.body);
          cb(null, Date.now() + file.originalname.replace(/\s/g, '')); //Appending .jpg
        },
      }),

      dest: './static/uploads',
    }),
  )
  @Post()
  async upload(
    @UploadedFile('file') file,
    @Body() body: { assetType: string },
  ) {
    const assetType = body.assetType || 'asset';
    const path = P.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'static',
      'uploads',
      file.filename,
    );

    let link;

    const ROUTINE_ACTIVITY_TRANSFORM_SETTING = {
      width: 400,
      height: 240,
      fps: 15,
    };

    try {
      switch (true) {
        case file.mimetype.includes('video'): {
          const job = await this.transform.transformUsingApi(
            file.path,
            assetType,
            'gif',
            ROUTINE_ACTIVITY_TRANSFORM_SETTING,
          );
          console.log(job);
          (link = this.generateLink(job)), assetType;
          break;
        }
        case file.mimetype.includes('image'): {
          link = await this.transform.uploadToS3(
            file.path,
            file.mimetype,
            assetType,
          );
          break;
        }
        case file.mimetype.includes('audio'): {
          const job = await this.transform.transformUsingApi(
            file.path,
            assetType,
            'mp3',
          );
          link = this.generateLink(job);
          break;
        }
      }
    } catch (e) {
      console.log(e.response);
      return e;
    } finally {
      // fs.unlink(path, console.log);
    }
    console.log(link);
    return { link };
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './static/uploads',
        filename: function(req, file, cb) {
          console.log(file);
          console.log(req.body);
          cb(null, Date.now() + file.originalname.replace(/\s/g, ''));
        },
      }),

      dest: './static/uploads',
    }),
  )
  @Post('/compress')
  async uploadAndCompress(
    @UploadedFile('file') file,
    @Body() body: { assetType: string },
  ) {
    const assetType = body.assetType || 'asset';
    const path = P.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'static',
      'uploads',
      file.filename,
    );

    let link;
    const VIDEO_COMPRESS_SETTING = {
      crf: 35,
      fps: 20,
      // width: 400,
      // height: 400,
      preset: 'ultrafast',
    };

    const IMAGE_COMPRESS_SETTING = {
      width: 600,
      height: 600,
      quality: 50,
    };

    try {
      switch (true) {
        case file.mimetype.includes('video'): {
          const info = await this.transform.getVideoHeightAndWidth(file.path);
          console.log(info.width);
          console.log(info.height);
          Object.assign(VIDEO_COMPRESS_SETTING, {
            width: info.width / 2,
            height: info.height / 2,
          });
          console.log(VIDEO_COMPRESS_SETTING);

          const job = await this.transform.transformUsingApi(
            file.path,
            assetType,
            'mp4',
            VIDEO_COMPRESS_SETTING,
          );
          console.log(job);
          link = this.generateLink(job);
          break;
        }
        case file.mimetype.includes('image'): {
          const job = await this.transform.transformUsingApi(
            file.path,
            assetType,
            'jpg',
            IMAGE_COMPRESS_SETTING,
          );
          console.log(job);
          link = this.generateLink(job);
          break;
        }
      }
    } catch (e) {
      console.log(e.response);
      return e;
    }
    console.log(link);
    return { link };
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './static/uploads',
        filename: function(req, file, cb) {
          console.log(file);
          console.log(req.body);
          cb(null, Date.now() + file.originalname.replace(/\s/g, ''));
        },
      }),

      dest: './static/uploads',
    }),
  )
  @Post('/visual-aids/compress')
  async visualAidUploadAndCompress(
    @UploadedFile('file') file,
    @Body() body: AidUploadDto,
  ) {
    const path = P.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'static',
      'uploads',
      file.filename,
    );

    let link;
    let filePath;
    let size;
    const key = `visualaids/${body.type.toLowerCase()}/${body.category.toLowerCase()}/${Date.now()}`;
    const imageExt = 'jpg';
    const videoExt = 'mp4';
    const VIDEO_COMPRESS_SETTING_HIGH_RES = {
      crf: 35,
      fps: 25,
      width: 960,
      height: 540,
      preset: 'ultrafast',
    };
    const VIDEO_COMPRESS_SETTING_LOW_RES = {
      crf: 45,
      fps: 5,
      width: 402,
      height: 226,
      preset: 'ultrafast',
    };
    const IMAGE_COMPRESS_SETTING = {
      width: 600,
      height: 600,
      quality: 50,
    };

    try {
      switch (true) {
        case file.mimetype.includes('video'): {
          if (body.w && body.h && body.x && body.y) {
            //video is coming from CTA
            const ext = P.extname(file.path);
            console.log(ext);
            await this.transform.cropVideo(
              file.path,
              ext,
              body.w,
              body.h,
              body.x,
              body.y,
            );
            filePath = `${file.path.replace(ext, '')}_cropped_video.mp4`;
          } else filePath = file.path;

          const info = await this.transform.getVideoHeightAndWidth(filePath);
          console.log('video is', info.width, 'x', info.height);
          if (info.height > info.width) {
            //video is portrait
            Object.assign(VIDEO_COMPRESS_SETTING_HIGH_RES, {
              height: VIDEO_COMPRESS_SETTING_HIGH_RES.width,
              width: VIDEO_COMPRESS_SETTING_HIGH_RES.height,
            });
            Object.assign(VIDEO_COMPRESS_SETTING_LOW_RES, {
              height: VIDEO_COMPRESS_SETTING_LOW_RES.width,
              width: VIDEO_COMPRESS_SETTING_LOW_RES.height,
            });
          }
          console.log(`filePath is: ${filePath}`);
          console.log(VIDEO_COMPRESS_SETTING_HIGH_RES);
          const job = await this.transform.transformUsingApi(
            filePath,
            '',
            videoExt,
            VIDEO_COMPRESS_SETTING_HIGH_RES,
            `${key}_high_res.${videoExt}`,
          );
          console.log(job);
          link = this.generateLink(job);
          size = await this.getFileSize(job);

          this.transform.transformUsingApi(
            filePath,
            '',
            videoExt,
            VIDEO_COMPRESS_SETTING_LOW_RES,
            `${key}_low_res.${videoExt}`,
          );
          break;
        }
        case file.mimetype.includes('image'): {
          const job = await this.transform.transformUsingApi(
            file.path,
            '',
            imageExt,
            IMAGE_COMPRESS_SETTING,
            `${key}.${imageExt}`,
          );
          console.log(job);
          link = this.generateLink(job);
          size = await this.getFileSize(job);
          break;
        }
      }
    } catch (e) {
      console.log(e.response);
      return e;
    }
    console.log(link, size);
    return { link, size };
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './static/uploads',
        filename: function(req, file, cb) {
          console.log(file);
          console.log(req.body);
          cb(null, Date.now() + file.originalname.replace(/\s/g, ''));
        },
      }),

      dest: './static/uploads',
    }),
  )
  @Post('/aac/compress')
  async aacUploadAndCompress(@UploadedFile('file') file) {
    const path = P.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'static',
      'uploads',
      file.filename,
    );

    let link;

    const imageKey = `aac/images/${Date.now()}`;
    const audioKey = `aac/sounds/${Date.now()}`;

    const imageExt = 'jpg';
    const audioExt = 'mp3';

    const IMAGE_COMPRESS_SETTING = {
      width: 600,
      height: 600,
      quality: 50,
    };

    try {
      switch (true) {
        case file.mimetype.includes('image'): {
          const job = await this.transform.transformUsingApi(
            file.path,
            '',
            imageExt,
            IMAGE_COMPRESS_SETTING,
            `${imageKey}.${imageExt}`,
          );
          console.log(job);
          link = this.generateLink(job);
          break;
        }
        case file.mimetype.includes('audio'): {
          const job = await this.transform.transformUsingApi(
            file.path,
            '',
            audioExt,
            {},
            `${audioKey}.${audioExt}`,
          );
          link = this.generateLink(job);
          break;
        }
      }
    } catch (e) {
      console.log(e.response);
      return e;
    }
    console.log(link);
    return { link };
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './static/uploads',
        filename: function(req, file, cb) {
          console.log(file);
          console.log(req.body);
          cb(null, Date.now() + file.originalname.replace(/\s/g, ''));
        },
      }),

      dest: './static/uploads',
    }),
  )
  @Post('/puzzle/compress')
  async puzzleUploadAndCompress(@UploadedFile('file') file) {
    const path = P.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'static',
      'uploads',
      file.filename,
    );

    let link;

    const imageKey = `puzzles/userimages/${Date.now()}`;
    const imageExt = 'jpg';

    const IMAGE_COMPRESS_SETTING = {
      width: 1041,
      height: 841,
      quality: 80,
    };

    try {
      switch (true) {
        case file.mimetype.includes('image'): {
          const job = await this.transform.transformUsingApi(
            file.path,
            '',
            imageExt,
            IMAGE_COMPRESS_SETTING,
            `${imageKey}.${imageExt}`,
          );
          console.log(job);
          link = this.generateLink(job);
          break;
        }
      }
    } catch (e) {
      console.log(e.response);
      return e;
    }
    console.log(link);
    return { link };
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './static/uploads',
        filename: function(req, file, cb) {
          console.log(file);
          console.log(req.body);
          cb(null, Date.now() + file.originalname.replace(/\s/g, ''));
        },
      }),

      dest: './static/uploads',
    }),
  )
  @Post('/onboarding-video')
  async onBoardUploadAndCompress(@UploadedFile('file') file) {
    const path = P.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'static',
      'uploads',
      file.filename,
    );

    let data;
    let size;

    const key = `onboarding/device/${Date.now()}`;

    try {
      switch (true) {
        case file.mimetype.includes('video'): {
          data = await this.transform.uploadToS3CustomPath(
            file.path,
            file.mimetype,
            key,
          );
          size = await this.transform.getFileSize(data.Key);
          break;
        }
      }
    } catch (e) {
      console.log(e.response);
      return e;
    }
    console.log(data);
    return { link: data.Location, size };
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './static/uploads',
        filename: function(req, file, cb) {
          console.log(file);
          console.log(req.body);
          cb(null, Date.now() + file.originalname.replace(/\s/g, ''));
        },
      }),

      dest: './static/uploads',
    }),
  )
  @Post('/reminders/compress')
  async reminderUploadAndCompress(@UploadedFile('file') file) {
    const path = P.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'static',
      'uploads',
      file.filename,
    );

    let link;

    const imageKey = `reminders/images/${Date.now()}`;
    const audioKey = `reminders/sounds/${Date.now()}`;

    const imageExt = 'jpg';
    const audioExt = 'mp3';

    const IMAGE_COMPRESS_SETTING = {
      width: 600,
      height: 600,
      quality: 50,
    };

    try {
      switch (true) {
        case file.mimetype.includes('image'): {
          const job = await this.transform.transformUsingApi(
            file.path,
            '',
            imageExt,
            IMAGE_COMPRESS_SETTING,
            `${imageKey}.${imageExt}`,
          );
          console.log(job);
          link = this.generateLink(job);
          break;
        }
        case file.mimetype.includes('audio'): {
          const job = await this.transform.transformUsingApi(
            file.path,
            '',
            audioExt,
            {},
            `${audioKey}.${audioExt}`,
          );
          link = this.generateLink(job);
          break;
        }
      }
    } catch (e) {
      console.log(e.response);
      return e;
    }
    console.log(link);
    return { link };
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './static/uploads',
        filename: function(req, file, cb) {
          console.log(file);
          console.log(req.body);
          cb(null, Date.now() + file.originalname.replace(/\s/g, ''));
        },
      }),

      dest: './static/uploads',
    }),
  )
  @Post('/sleep-mode')
  async sleepUpload(@UploadedFile('file') file) {
    const path = P.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'static',
      'uploads',
      file.filename,
    );

    let data;
    let size;

    const imageKey = `sleep_mode/images/${Date.now()}`;
    const audioKey = `sleep_mode/sounds/${Date.now()}`;
    const videoKey = `sleep_mode/videos/${Date.now()}`;

    try {
      switch (true) {
        case file.mimetype.includes('audio'): {
          data = await this.transform.uploadToS3CustomPath(
            file.path,
            file.mimeType,
            audioKey,
          );
          size = await this.transform.getFileSize(data.Key);
          break;
        }
        case file.mimetype.includes('video'): {
          data = await this.transform.uploadToS3CustomPath(
            file.path,
            file.mimeType,
            videoKey,
          );
          size = await this.transform.getFileSize(data.Key);
          break;
        }
        case file.mimetype.includes('image'): {
          data = await this.transform.uploadToS3CustomPath(
            file.path,
            file.mimetype,
            imageKey,
          );
          size = await this.transform.getFileSize(data.Key);
          break;
        }
      }
    } catch (e) {
      console.log(e.response);
      return e;
    }
    return { link: data.Location, size };
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './static/uploads',
        filename: function(req, file, cb) {
          console.log(file);
          console.log(req.body);
          cb(null, Date.now() + file.originalname.replace(/\s/g, ''));
        },
      }),

      dest: './static/uploads',
    }),
  )
  @Post('/sleep-mode/compress')
  async sleepUploadAndCompress(@UploadedFile('file') file) {
    const path = P.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'static',
      'uploads',
      file.filename,
    );

    let link;

    const audioKey = `sleep_mode/usersounds/${Date.now()}`;
    const audioExt = 'mp3';

    try {
      switch (true) {
        case file.mimetype.includes('audio'): {
          const job = await this.transform.transformUsingApi(
            file.path,
            '',
            audioExt,
            {},
            `${audioKey}.${audioExt}`,
          );
          link = this.generateLink(job);
          break;
        }
      }
    } catch (e) {
      console.log(e.response);
      return e;
    }
    console.log(link);
    return { link };
  }

  generateLink(job: { filename: string; dir: string }) {
    return `https://${this.bucket}.s3.amazonaws.com/${job.dir}${job.filename}`;
  }

  async getFileSize(job: { filename: string; dir: string }) {
    const size = await this.transform.getFileSize(`${job.dir}${job.filename}`);
    return size;
  }

  // @Get('/device-onboarding-videos')
  // getDeviceOnBoardingVideos() {
  //   return this.transform.getDeviceOnBoardingVideos();
  // }
}
