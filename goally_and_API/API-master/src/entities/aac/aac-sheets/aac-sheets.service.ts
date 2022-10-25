import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as BB from 'bluebird';
import * as csv from 'fast-csv';
import * as fs from 'fs';
import { flatten } from 'lodash';
import * as path from 'path';
import { EnvironmentVariables } from 'src/config';
import { PollyService } from 'src/entities/polly/polly.service';
import { LIBRARY_TYPES } from 'src/shared/const';
import { AAC_VISUAL_AID_TYPES } from 'src/shared/const/aac-visual-aids';
import { aacUrlRegex } from 'src/shared/validation/regexp';
import { AacFoldersService } from '../aac-folders/aac-folders.service';
import { AacFolder } from '../aac-folders/schema/aac-folder.schema';
import { AacWordsService } from '../aac-words/aac-words.service';

@Injectable()
export class AacSheetsService {
  bucket: string;

  constructor(
    private config: ConfigService<EnvironmentVariables>,
    private aacWordsService: AacWordsService,
    private aacFoldersService: AacFoldersService,
    private pollyService: PollyService,
  ) {
    this.bucket = this.config.get('AWS_BUCKET');
  }
  private basePath: string = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    'static',
  );
  private aacPath = path.resolve(this.basePath, 'aac');
  private WORD_LIST = 'aac-words-list.csv';
  private FOLDER_LIST = 'aac-folders-list.csv';

  async addAacData() {
    try {
      const folders = await this.saveFoldersFromCsv();
      const words = await this.saveWordsFromCsv();

      await BB.mapSeries(words, async word => {
        // await this.pollyService.initSpeechFile(VOICE_NAMES, word.text);
      });
      return { success: true };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        error: e,
      };
    }
  }

  async saveFoldersFromCsv(): Promise<AacFolder[]> {
    try {
      let folders: any[] = await this.readCsvAsync(
        path.resolve(this.aacPath, this.FOLDER_LIST),
      );
      folders = folders.map(e => {
        const [
          parentFolderId,
          subFolderId,
          folderId,
          parentFolderName,
          subFolderName,
          gridPosition,
          qty,
          type,
        ] = Object.values(e);
        return {
          parentFolderId,
          subFolderId,
          folderId,
          parentFolderName,
          subFolderName,
          gridPosition,
          qty,
          type: type.toUpperCase().trim(),
          isDictionary: true,
          libraryType: LIBRARY_TYPES.ADULT,
        };
      });
      await this.aacFoldersService.deleteAll();
      const foldersFromDb = await this.aacFoldersService.addAll(
        flatten(folders),
      );

      return foldersFromDb;
    } catch (e) {
      console.log(e);
    }
  }

  async saveWordsFromCsv() {
    try {
      const folders = await this.aacFoldersService.getAllFolders();

      let words = await this.readCsvAsync(
        path.resolve(this.aacPath, this.WORD_LIST),
      );
      words = words.map(e => {
        const [
          grouping,
          alphabet,
          serial,
          subSerial,
          gridPosition,
          displayId,
          partOfSpeech,
          color,
          folderDisplayId,
          folderName,
          text,
          imageId,
          image,
          imageName,
        ] = Object.values(e);

        let visualAidType = AAC_VISUAL_AID_TYPES.TEXT;
        let visualAid = imageId;

        if (aacUrlRegex.test(imageId)) {
          visualAidType = AAC_VISUAL_AID_TYPES.IMAGE;
          visualAid = this.getImgLink(imageName);
        } else if (
          imageId &&
          imageId.charAt(0) == 'U' &&
          imageId.charAt(1) == '+'
        ) {
          visualAidType = AAC_VISUAL_AID_TYPES.EMOJI;
          visualAid = imageId;
        }

        const folder = folders.filter(
          folder => folder.folderId == folderDisplayId,
        )[0];

        return {
          grouping,
          alphabet,
          serial,
          subSerial,
          gridPosition: gridPosition ? gridPosition : 0,
          displayId,
          partOfSpeech: partOfSpeech.toLowerCase().trim(),
          color,
          folderId: folder._id,
          folderDisplayId,
          parentFolderDisplayId: folder.parentFolderId,
          text: text.trim(),
          label: text.trim(),
          visualAid,
          libraryType: LIBRARY_TYPES.ADULT,
          isDictionary: true,
          visualAidType,
          textType: 'WORD',
        };
      });
      await this.aacWordsService.deleteAll();
      const wordsFromDb = await this.aacWordsService.addAll(flatten(words));
      return wordsFromDb;
    } catch (e) {
      console.log(e);
    }
  }

  private readCsvAsync(path): Promise<Array<any>> {
    return new Promise((res, rej) => {
      const data = [];
      const rs = fs.createReadStream(path);
      rs.on('error', () => res([]));
      rs.pipe(csv.parse({ headers: true }))
        .on('error', () => res([]))
        .on('data', row => {
          data.push(row);
        })
        .on('end', () => res(data));
    });
  }

  getImgLink(fileNameWithExtension: string): string {
    return `https://${this.bucket}.s3.amazonaws.com/aac/images/${fileNameWithExtension}`;
  }
}
