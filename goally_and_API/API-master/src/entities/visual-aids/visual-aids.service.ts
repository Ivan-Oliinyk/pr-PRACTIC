import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as BB from 'bluebird';
import * as csv from 'fast-csv';
import * as fs from 'fs';
import { flatten } from 'lodash';
import { Model, PaginateModel, Types } from 'mongoose';
import * as P from 'path';
import * as path from 'path';
import { EnvironmentVariables } from 'src/config';
import { AIDS_CATEGORIES } from 'src/shared/const/visual-aid-categories';
import { AIDS_TYPES } from 'src/shared/const/visual-aid-types';
import { aacUrlRegex } from 'src/shared/validation/regexp';
import { AacWordsService } from '../aac/aac-words/aac-words.service';
import { User } from '../users/schema';
import { UpdateVisAidDto } from './dto/UpdateVisAidDto';
import { VisAidDto } from './dto/VisAidDto';
import { VisualAid } from './schema/visual-aids.schema';

@Injectable()
export class VisualAidsService {
  bucket: string;

  constructor(
    @InjectModel(VisualAid.name) private VisualAidModel: Model<VisualAid>,
    @InjectModel(VisualAid.name)
    private VisualAidPaginateModel: PaginateModel<VisualAid>,
    private config: ConfigService<EnvironmentVariables>,
    private aacWordsService: AacWordsService,
  ) {
    this.bucket = this.config.get('AWS_BUCKET');
  }
  private basePath: string = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'static',
  );
  private iconPath = path.resolve(this.basePath, 'icons');
  private ICON_CSV_FILE_WITH_TAGS = 'icon-tags.csv';
  private AAC_ICON_CSV_FILE_WITH_TAGS = 'visual_aid_selector_aac.csv';
  private VIDEO_CSV_FILE_WITH_TAGS = 'visual_aid_selector_videos.csv';

  async getCategories(): Promise<string[]> {
    const categories = await this.VisualAidModel.find({}).distinct('category');
    return categories;
  }

  async getUrls(page, limit, aidType, search?) {
    if (!aidType || !Object.values(AIDS_TYPES).includes(aidType))
      throw new BadRequestException(
        `aidType must be ${Object.values(AIDS_TYPES)}`,
      );

    let visAids: any = [];
    if (!search) {
      visAids = await this.VisualAidPaginateModel.paginate(
        {
          aidType,
        },
        {
          // sort: { createdAt: -1 },
          page,
          limit,
          offset: (page - 1) * limit,
          lean: true,
        },
      );
    } else {
      const searchRegex = { $regex: new RegExp(search, 'i') };

      visAids = await this.VisualAidPaginateModel.paginate(
        {
          aidType,
          $or: [
            { name: searchRegex },
            { tags: searchRegex },
            { category: searchRegex },
          ],
        },
        {
          // sort: { createdAt: -1, name: -1 },
          page,
          limit,
          offset: (page - 1) * limit,
          lean: true,
        },
      );
    }
    return visAids;
  }

  async getUserUrls(page, limit, user, aidType, search?) {
    if (!aidType || !Object.values(AIDS_TYPES).includes(aidType))
      throw new BadRequestException(
        `aidType must be ${Object.values(AIDS_TYPES)}`,
      );

    let visAids: any = [];
    if (!search) {
      visAids = await this.VisualAidPaginateModel.paginate(
        {
          aidType,
          createdBy: user._id,
        },
        {
          // sort: '-createdAt',
          page,
          limit,
          offset: (page - 1) * limit,
          lean: true,
        },
      );
    } else {
      const searchRegex = { $regex: new RegExp(search, 'i') };

      visAids = await this.VisualAidPaginateModel.paginate(
        {
          aidType,
          createdBy: user._id,
          $or: [
            { name: searchRegex },
            { tags: searchRegex },
            { category: searchRegex },
          ],
        },
        {
          // sort: '-createdAt',
          page,
          limit,
          offset: (page - 1) * limit,
          lean: true,
        },
      );
    }
    return visAids;
  }

  async addVisualAid(body: VisAidDto) {
    const resourceName = path.basename(body.url);
    if (body.aidType == AIDS_TYPES.VIDEO && !resourceName.includes('.mp4'))
      throw new BadRequestException(
        'Resource does not containt mp4 video extension',
      );

    if (
      (body.aidType == AIDS_TYPES.PICTURE ||
        body.aidType == AIDS_TYPES.SYMBOL) &&
      !resourceName.includes('.jpg')
    )
      throw new BadRequestException(
        'Resource does not containt jpg image extension',
      );

    const visualAid = new this.VisualAidModel(body);
    visualAid.aidType = body.aidType;

    const savedVisualAid = await visualAid.save();
    return savedVisualAid;
  }

  async addUserVisualAid(body: Partial<VisualAid>, user: User) {
    const resourceName = path.basename(body.url);
    if (body.aidType == AIDS_TYPES.USER_VIDEO && !resourceName.includes('.mp4'))
      throw new BadRequestException(
        'Resource does not containt mp4 video extension',
      );

    if (
      body.aidType == AIDS_TYPES.USER_PICTURE &&
      !resourceName.includes('.jpg')
    )
      throw new BadRequestException(
        'Resource does not containt jpg image extension',
      );

    if (body.url.includes('high_res')) {
      body.lowResUrl = body.url.replace('high_res', 'low_res');
    }

    const visualAid = new this.VisualAidModel(body);
    visualAid.aidType = body.aidType;
    visualAid.createdBy = user._id;

    const savedVisualAid = await visualAid.save();
    return savedVisualAid;
  }

  async getAllUrls(page: number, limit: number, user?: User, search?) {
    const symbols = await this.getUrls(page, limit, AIDS_TYPES.SYMBOL, search);
    const pictures = await this.getUrls(
      page,
      limit,
      AIDS_TYPES.PICTURE,
      search,
    );
    const videos = await this.getUrls(page, limit, AIDS_TYPES.VIDEO, search);

    if (user) {
      const userPictures = await this.getUserUrls(
        page,
        limit,
        user,
        AIDS_TYPES.USER_PICTURE,
        search,
      );
      const userVideos = await this.getUserUrls(
        page,
        limit,
        user,
        AIDS_TYPES.USER_VIDEO,
        search,
      );
      return { symbols, pictures, videos, userPictures, userVideos };
    }

    return { symbols, pictures, videos };
  }

  async update(
    aidId: Types.ObjectId,
    visualAidData: UpdateVisAidDto,
    user: User,
  ): Promise<VisualAid> {
    const aid = await this.VisualAidModel.findById(aidId);
    if (!aid) throw new NotFoundException(`Aid with id ${aidId} not found`);

    const savedAid = await this.VisualAidModel.findByIdAndUpdate(
      aid._id,
      visualAidData,
      {
        new: true,
      },
    );
    return savedAid;
  }

  async deleteById(id: Types.ObjectId): Promise<void> {
    const aid = await this.VisualAidModel.findById(id);
    if (!aid) throw new NotFoundException(`aid with id ${id} not found`);
    await aid.remove();
  }

  async initSymbols() {
    return await this.initSymbolsData(
      this.iconPath,
      this.ICON_CSV_FILE_WITH_TAGS,
      AIDS_TYPES.SYMBOL,
    );
  }
  async initSymbolsData(pathToRead, filename: string, aidType: string) {
    try {
      const categories = await this.readDirAsync(pathToRead);

      const result = await BB.map(categories, async category => {
        let result: any[] = await this.readCsvAsync(
          path.resolve(pathToRead, category, filename),
        );
        result = result.map(e => {
          const [name, ...tags] = Object.values(e);
          const tagsFiltered = tags ? tags.filter(e => e) : [];
          return {
            name,
            tags: tagsFiltered,
            category: category.toLowerCase(),
            aidType,
            url: `${this.getLink(aidType, category)}/${name}.png`,
          };
        });
        return result;
      });
      await this.VisualAidModel.remove({
        aidType,
      });
      const fromDb = await this.VisualAidModel.insertMany(flatten(result));
      return { success: true };
    } catch (e) {
      console.log(e);
      return { success: false };
    }
  }
  readDirAsync(pathToRead): Promise<string[]> {
    return new Promise((res, rej) => {
      fs.readdir(path.resolve(pathToRead), (err, files) => {
        if (err) rej(err);
        else res(files as string[]);
      });
    });
  }
  readCsvAsync(path): Promise<Array<any>> {
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

  getLink(type: string, category: string) {
    return `https://${
      this.bucket
    }.s3.amazonaws.com/visualaids/${type.toLowerCase()}/${category.toLowerCase()}`;
  }

  async initAacSymbols() {
    return await this.initAacSymbolsData(
      this.iconPath,
      this.AAC_ICON_CSV_FILE_WITH_TAGS,
      AIDS_TYPES.SYMBOL,
      AIDS_CATEGORIES.AAC,
    );
  }
  async initAacSymbolsData(
    pathToRead,
    filename: string,
    aidType: string,
    category: string,
  ) {
    try {
      let aacSymbols: any[] = await this.readCsvAsync(
        path.resolve(pathToRead, filename),
      );
      aacSymbols = await BB.map(aacSymbols, async aacSymbol => {
        const [
          unique_key,
          image_id,
          emoji,
          keyword_1,
          keyword_2,
          keyword_3,
          keyword_4,
          keyword_5,
          emoji_name,
        ] = Object.values(aacSymbol);
        return {
          name: keyword_1,
          tags: [keyword_2, keyword_3, keyword_4, keyword_5].filter(e => e),
          category,
          aidType,
          url: `${await this.getAacLink(
            aidType,
            category,
            unique_key,
            image_id,
            emoji_name,
          )}`,
        };
      });
      console.log(flatten(aacSymbols).length);
      await this.VisualAidModel.remove({
        aidType,
        category,
      });
      const fromDb = await this.VisualAidModel.insertMany(flatten(aacSymbols));
      return { success: true };
    } catch (e) {
      console.log(e);
    }
  }

  async getAacLink(
    type: string,
    category: string,
    uniqueKey: string,
    imageId: string,
    emojiName: string,
  ) {
    if (aacUrlRegex.test(imageId)) {
      const word = await this.aacWordsService.getWordByUniqueKey(uniqueKey);
      const ext = P.extname(word.visualAid);
      if (ext === '.svg') {
        return word.visualAidPng;
      }
      return word.visualAid;
    } else if (imageId.charAt(0) == 'U' && imageId.charAt(1) == '+') {
      return `https://${
        this.bucket
      }.s3.amazonaws.com/visualaids/${type.toLowerCase()}/${category.toLowerCase()}/${emojiName}.png`;
    }
  }

  async addVideos() {
    return await this.addVideosData(
      this.iconPath,
      this.VIDEO_CSV_FILE_WITH_TAGS,
      AIDS_TYPES.VIDEO,
    );
  }
  async addVideosData(pathToRead, filename: string, aidType: string) {
    try {
      let videos: any[] = await this.readCsvAsync(
        path.resolve(pathToRead, filename),
      );
      videos = await BB.map(videos, async video => {
        const [
          upload_to_admin,
          uploaded_to_drive,
          location,
          description,
          file_name,
          keyword_1,
          keyword_2,
          keyword_3,
          keyword_4,
          keyword_5,
        ] = Object.values(video);
        return {
          name: path.parse(file_name).name,
          tags: [keyword_1, keyword_2, keyword_3, keyword_4, keyword_5].filter(
            e => e,
          ),
          category: location.toLowerCase(),
          aidType,
          url: `https://${this.bucket}.s3.amazonaws.com/visualaids/video/${file_name}`,
        };
      });
      console.log(flatten(videos).length);
      const fromDb = await this.VisualAidModel.insertMany(flatten(videos));
      return { success: true };
    } catch (e) {
      console.log(e);
    }
  }
}
