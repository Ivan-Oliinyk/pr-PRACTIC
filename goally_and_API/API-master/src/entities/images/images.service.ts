import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as BB from 'bluebird';
import * as csv from 'fast-csv';
import * as fs from 'fs';
import { flatten, keyBy, map, mapValues } from 'lodash';
import { Model } from 'mongoose';
import * as path from 'path';
import { AIDS_TYPES } from 'src/shared/const/visual-aid-types';
import { Images } from './schema/image.schema';
@Injectable()
export class ImagesService {
  constructor(@InjectModel(Images.name) private ImageModel: Model<Images>) {}
  private basePath: string = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'static',
  );
  private iconPath = path.resolve(this.basePath, 'icons');
  private puzzlePath: string = path.resolve(this.basePath, 'puzzles');
  private puzzlesWithCategoriesPath: string = path.resolve(
    this.basePath,
    'puzzlesWithCategories',
  );

  puzzlesCategories: Array<string> = [];
  puzzlesBasic: { url: string; name: string }[] = [];
  puzzlesPremium: { url: string; name: string }[] = [];
  puzzlesWithCategories: {
    [key: string]: { url: string; name: string }[];
  } = {};

  private CSV_FILE_WITH_TAGS = 'icon-tags.csv';
  async getCategories(): Promise<string[]> {
    const categories = await this.ImageModel.distinct('category');
    return categories;
  }
  async getImageUrl(search?): Promise<{ tags: string[]; url: string }[]> {
    let images = [];
    if (!search) {
      images = await this.ImageModel.find();
    } else {
      const searchRegex = { $regex: new RegExp(search, 'i') };

      images = await this.ImageModel.find({
        $or: [
          { name: searchRegex },
          { tags: searchRegex },
          { category: searchRegex },
        ],
      });
    }
    const urls = images.map(e => ({
      url: `static/icons/${e.category}/${e.name}.png`,
      tags: e.tags,
    }));
    return urls;
  }
  readDirAsync(pathToRead): Promise<string[]> {
    return new Promise((res, rej) => {
      fs.readdir(path.resolve(pathToRead), (err, files) => {
        if (err) rej(err);
        else res(files as string[]);
      });
    });
  }

  async initImagesAndTags() {
    try {
      const categories = await this.readDirAsync(this.iconPath);

      const images = await BB.map(categories, async category => {
        let images: any[] = await this.readCsvAsync(
          path.resolve(this.iconPath, category, this.CSV_FILE_WITH_TAGS),
        );
        images = images.map(e => {
          const [name, ...tags] = Object.values(e);
          const tagsFiltered = tags ? tags.filter(e => e) : [];
          return {
            name,
            tags: tagsFiltered,
            category,
            aidType: AIDS_TYPES.SYMBOL,
          };
        });
        return images;
      });
      await this.ImageModel.remove({});
      const imagesFromDb = await this.ImageModel.insertMany(flatten(images));
      this.puzzlesBasic = await this.initPuzzles('basic');

      const premiumPuzzles = await this.initPuzzles('premium');
      this.puzzlesPremium = [...this.puzzlesBasic, ...premiumPuzzles];
    } catch (e) {
      console.log(e);
    }
  }

  async initPuzzlesAndCategories() {
    try {
      this.puzzlesCategories = await this.readDirAsync(
        this.puzzlesWithCategoriesPath,
      );
      const puzzles = await BB.map(this.puzzlesCategories, async category => {
        let puzzles: any[] = await this.readDirAsync(
          path.resolve(this.puzzlesWithCategoriesPath, category),
        );
        puzzles = puzzles.map(puzzle => {
          return {
            name: puzzle.split('.')[0],
            url: `static/${this.puzzlesWithCategoriesPath}/${category}/${puzzle}`,
          };
        });
        const puzzlesWithCategories = {
          category,
          puzzles,
        };
        return puzzlesWithCategories;
      });

      this.puzzlesWithCategories = mapValues(
        keyBy(puzzles, 'category'),
        'puzzles',
      );
    } catch (e) {
      console.log(e);
    }
  }

  async initPuzzles(folder: string) {
    const puzzles = await this.readDirAsync(
      path.resolve(this.puzzlePath, folder),
    );
    return map(puzzles, puzzle => ({
      url: `static/puzzles/${folder}/${puzzle}`,
      name: puzzle.split('.')[0],
    }));
  }

  getPuzzlesCategories() {
    return this.puzzlesCategories;
  }

  getPuzzlesWithCategories() {
    ///TODO: change to basicPuzzle depends on plan
    return this.puzzlesWithCategories;
  }

  getPuzzles() {
    ///TODO: change to basicPuzzle depends on plan
    return this.puzzlesPremium;
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
}
