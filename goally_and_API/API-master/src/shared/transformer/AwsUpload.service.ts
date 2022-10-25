import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import * as ffprobeInstaller from '@ffprobe-installer/ffprobe';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as P from 'path';
import { EnvironmentVariables } from 'src/config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CloudConvert = require('cloudconvert');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const AWS = require('aws-sdk');

@Injectable()
export class AwsUploadService {
  cloudConvert;
  API_KEY: string;
  access_key_id: string;
  secret_access_key: string;
  bucket: string;
  region: string;
  s3: S3;
  DEFAULT_AWS_FOLDER = 'aws';
  SHARED_FOLDER = 'shared';

  constructor(private config: ConfigService<EnvironmentVariables>) {
    this.API_KEY = this.config.get('CLOUD_CONVERT_TOKEN');
    this.cloudConvert = new CloudConvert(this.API_KEY);
    this.access_key_id = this.config.get('AWS_ACCESS_KEY');
    this.secret_access_key = this.config.get('AWS_SECRET_KEY');
    this.bucket = this.config.get('AWS_BUCKET');
    this.region = this.config.get('AWS_REGION');
    this.s3 = new S3({
      accessKeyId: this.config.get('AWS_ACCESS_KEY'),
      secretAccessKey: this.config.get('AWS_SECRET_KEY'),
    });
    this.bucket = this.config.get('AWS_BUCKET');
    this.region = this.config.get('AWS_REGION');

    ffmpeg.setFfprobePath(ffprobeInstaller.path);
    ffmpeg.setFfmpegPath(ffmpegInstaller.path);
  }

  transformAudio(initialFilePath: string) {
    return new Promise((resolve, reject) => {
      const inFilename = initialFilePath;

      const outFilename = `${initialFilePath}.mp3`;
      ffmpeg(inFilename)
        .format('mp3')
        .output(outFilename)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });
  }

  async getVideoHeightAndWidth(file: string): Promise<ffmpeg.FfprobeStream> {
    return new Promise((resolve, reject) => {
      ffmpeg(file).ffprobe((err, metadata) => {
        if (err) {
          reject(err);
        }
        resolve(metadata.streams[0]);
      });
    });
  }

  cropVideo(
    fileName: string,
    extension: string,
    w: number,
    h: number,
    x: number,
    y: number,
  ) {
    ffmpeg.setFfmpegPath(ffmpegInstaller.path);
    return new Promise((resolve, reject) => {
      const inFilename = fileName;

      const outFilename = `${fileName.replace(
        extension,
        '',
      )}_cropped_video.mp4`;

      ffmpeg(inFilename)
        .outputOption('-filter:v', `crop=${w}:${h}:${x}:${y}:keep_aspect=1`)
        .format('mp4')
        .output(outFilename)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });
  }

  async transformUsingApi(
    path: string,
    assetType: string,
    outputFormat: string,
    transformSettings: object = {},
    key?: string,
  ) {
    const url = this.config.get('API_BASE_URL') + path;

    let job = await this.cloudConvert.jobs.create({
      tasks: {
        'import-my-file': {
          operation: 'import/url',
          url,
        },
        'convert-my-file': {
          operation: 'convert',
          input: ['import-my-file'],
          output_format: outputFormat,
          ...transformSettings,
        },
        'export-my-file': {
          operation: 'export/s3',
          input: ['convert-my-file'],
          bucket: this.bucket,
          region: this.region,
          access_key_id: this.access_key_id,
          secret_access_key: this.secret_access_key,
          key:
            key ||
            `${
              this.DEFAULT_AWS_FOLDER
            }/${assetType}_${Date.now()}.${outputFormat}`,
          acl: 'public-read-write',
        },
      },
    });
    job = await this.cloudConvert.jobs.wait(job.id); // Wait for job completion
    const exportTask = job.tasks.filter(
      task => task.operation === 'export/s3' && task.status === 'finished',
    )[0];
    const file = exportTask.result.files[0];
    return file;
  }

  async shareFileToGoally(url: string) {
    // console.log('Sentry Fixes OnGoing: shareFileToGoally -> url:', url);
    // const source = url.split('com')[1];
    // const fileName = source.split(`${this.DEFAULT_AWS_FOLDER}/`)[1];
    // const copyTo = `${this.SHARED_FOLDER}/${Date.now()}_${fileName}`;
    // const params = {
    //   Bucket: this.bucket,
    //   CopySource: `/${this.bucket}${source}`,
    //   Key: copyTo,
    //   ACL: 'public-read-write',
    // };
    // try {
    //   const copyData = await this.s3.copyObject(params).promise();
    //   console.log('file copied', copyData);
    // } catch (e) {
    //   console.trace('file not copied', e);
    // }
  }
  async uploadToS3(path, type, assetType) {
    const fileContent = await this.readFile(path);
    const ext = P.extname(path);
    const params = {
      Bucket: this.bucket,
      Key: `aws/${assetType}_${Date.now()}${ext}`,
      Body: fileContent,
      ACL: 'public-read-write',
      ContentType: type,
    };
    return new Promise(async (res, rej) => {
      this.s3.upload(params, function(err, data) {
        if (err) {
          rej(err);
        }
        console.log(data);
        res(data.Location);
      });
    });
  }

  async uploadToS3CustomPath(localPath, contentType, key) {
    const fileContent = await this.readFile(localPath);
    const ext = P.extname(localPath);
    const params = {
      Bucket: this.bucket,
      Key: `${key}${ext}`,
      Body: fileContent,
      ACL: 'public-read-write',
      ContentType: contentType,
    };
    return new Promise(async (res, rej) => {
      this.s3.upload(params, function(err, data) {
        if (err) {
          rej(err);
        }
        console.log(data);
        res(data);
      });
    });
  }
  async uploadPdfFiletoS3(localPath, contentType, key) {
    const fileContent = fs.readFileSync(localPath);
    const ext = P.extname(localPath);
    const params = {
      Bucket: this.bucket,
      Key: `${key}${ext}`,
      Body: fileContent,
      ACL: 'public-read',
      ContentType: contentType,
      ContentDisposition: 'attachment',
    };
    return new Promise(async (res, rej) => {
      this.s3.upload(params, function(err, data) {
        if (err) {
          rej(err);
        }
        console.log(data);
        res(data);
      });
    });
  }
  readFile(path) {
    return new Promise((res, rej) => {
      fs.readFile(path, (err, data) => {
        if (err) rej(err);
        res(data);
      });
    });
  }

  async getFileSize(link: string) {
    const params = {
      Bucket: this.bucket,
      Key: link,
    };
    return new Promise(async (res, rej) => {
      this.s3.headObject(params, function(err, data) {
        if (err) {
          rej(err);
        }
        console.log(data);
        res(data.ContentLength);
      });
    });
  }

  async getDeviceOnBoardingVideos() {
    const params = {
      Bucket: `${this.bucket}`,
      Delimiter: '/',
      Prefix: 'onboarding/device/',
    };

    try {
      const data = await this.s3.listObjects(params).promise();
      const response = [];
      if (data && data['Contents'] && data['Contents'].length > 1) {
        for (let index = 1; index < data['Contents'].length; index++) {
          response.push({
            name: data['Contents'][index]['Key'],
            url: `https://${data.Name}.s3.amazonaws.com/${data['Contents'][index]['Key']}`,
            size: data['Contents'][index]['Size'],
          });
        }
      }
      return response;
    } catch (e) {
      return { error: e.message };
    }
  }

  async ffmpegGetVideoFrame(url: string, outFilename: string) {
    return new Promise((res, rej) => {
      ffmpeg(url)
        .on('error', function(err) {
          rej(err);
        })
        .on('end', function() {
          res(`./static/pdf/${outFilename}`);
        })
        .screenshots({
          count: 1,
          folder: './static/pdf/',
          filename: outFilename,
          size: '100x100',
        });
    });
  }
}
