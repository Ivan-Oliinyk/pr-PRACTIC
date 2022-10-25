import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as BB from 'bluebird';
import * as fs from 'fs';
import { flatten, omit } from 'lodash';
import { Model, Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import * as path from 'path';
import { EnvironmentVariables } from 'src/config';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { ClientsService } from '../clients/clients.service';
import { Client } from '../clients/schema/client.schema';
import { UpdatePuzzleDto } from '../devices/dto';
import { User } from '../users/schema';
import { CreateCategoryDto } from './dto/CreateCategoryDto';
import { CreatePuzzleDto } from './dto/CreatePuzzleDto';
import { HidePuzzleDto } from './dto/HidePuzzleDto';
import { ResetPuzzleDto } from './dto/ResetPuzzleDto';
import { Puzzles } from './schema/puzzles.schema';

@Injectable()
export class PuzzlesService {
  bucket: string;

  constructor(
    @InjectModel(Puzzles.name) private PuzzleModel: Model<Puzzles>,
    @Inject(forwardRef(() => ClientsService))
    private clientService: ClientsService,
    private config: ConfigService<EnvironmentVariables>,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
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
  private puzzlesWithCategoriesPath: string = path.resolve(
    this.basePath,
    'puzzlesWithCategories',
  );
  private puzzles = [];

  async getAllPuzzles(clientId: Types.ObjectId, user: User) {
    const puzzles = await this.PuzzleModel.find({
      clientId,
      name: { $exists: true },
    });
    return puzzles;
  }
  async getPuzzlesByCategories(
    clientId: Types.ObjectId,
    category: string,
    user: User,
  ) {
    const puzzles = await this.PuzzleModel.find({
      clientId,
      category: category.toLowerCase(),
    });
    return puzzles;
  }
  async getPuzzlesCategories(clientId: Types.ObjectId, user: User) {
    const puzzles = await this.PuzzleModel.find({ clientId }).distinct(
      'category',
    );
    return puzzles;
  }
  async getPuzzlesCategoriesV2(clientId: Types.ObjectId, user: User) {
    const puzzles = await this.PuzzleModel.find({ clientId })
      .select({
        category: 1,
        categoryUrl: 1,
        isCategoryCreatedByUser: 1,
        clientId: 1,
        numberOfPuzzles: 1,
        isCompleted: 1,
        name: 1,
        _id: 0,
      })
      .sort({ createdAt: 1 })
      .lean();
    const key = 'category';
    const puzzlesCategories = [
      ...new Map(puzzles.map(item => [item[key], item])).values(),
    ];

    puzzlesCategories.forEach(puzzleCategory => {
      puzzleCategory.numberOfPuzzles = 0;
      puzzleCategory.completedPuzzles = 0;

      puzzles.map(puzzle => {
        if (puzzle.category === puzzleCategory.category) {
          if (puzzle.name) puzzleCategory.numberOfPuzzles++;
          if (puzzle.isCompleted) puzzleCategory.completedPuzzles++;
          puzzle.name = null;
        }
      });
    });

    return puzzlesCategories;
  }
  async hidePuzzle(hidePuzzle: HidePuzzleDto, user: User) {
    const puzzleFromDb = await this.PuzzleModel.findByIdAndUpdate(
      hidePuzzle.puzzleId,
      {
        isHidden: hidePuzzle.isHidden,
      },
      { new: true },
    );
    if (!puzzleFromDb)
      throw new NotFoundException(`puzzleId ${hidePuzzle.puzzleId} not found`);

    this.emitter.emit('PuzzleUpdated', puzzleFromDb);
    return puzzleFromDb;
  }
  async resetPuzzle(resetPuzzleDto: ResetPuzzleDto) {
    const puzzle = await this.PuzzleModel.findById(resetPuzzleDto.puzzleId);
    if (!puzzle)
      throw new NotFoundException(
        `${resetPuzzleDto.puzzleId} is invalid puzzle id for client ${resetPuzzleDto.clientId}`,
      );

    const puzzleFromDb = await this.PuzzleModel.findByIdAndUpdate(
      resetPuzzleDto.puzzleId,
      { isCompleted: false, completedPieces: [] },
      { new: true },
    );
    this.emitter.emit('PuzzleUpdated', puzzleFromDb);
    return puzzleFromDb;
  }
  async resetAllPuzzles(clientId: Types.ObjectId, user: User) {
    const puzzles = await this.PuzzleModel.find({
      clientId,
      isCompleted: true,
    });
    if (!puzzles || puzzles.length == 0)
      throw new NotFoundException(
        `does not have any completed puzzles to reset for client ${clientId}`,
      );

    await this.PuzzleModel.updateMany(
      { clientId },
      { isCompleted: false, completedPieces: [] },
      { multi: true },
    );

    puzzles.map(puzzle => (puzzle.isCompleted = false));
    this.emitter.emit('PuzzleCategoryUpdated', puzzles);
    return puzzles;
  }
  async resetCategoryPuzzles(
    category: string,
    clientId: Types.ObjectId,
    user: User,
  ) {
    const puzzles = await this.PuzzleModel.find({
      clientId,
      category: category.toLowerCase(),
      isCompleted: true,
    });
    if (!puzzles || puzzles.length == 0)
      throw new NotFoundException(
        `${category} is invalid category or does not have any completed puzzle for client ${clientId}`,
      );

    await this.PuzzleModel.updateMany(
      { clientId, category },
      { isCompleted: false, completedPieces: [] },
      { multi: true },
    );

    puzzles.map(puzzle => (puzzle.isCompleted = false));
    this.emitter.emit('PuzzleCategoryUpdated', puzzles);
    return puzzles;
  }
  async createCategory(categoryData: CreateCategoryDto, user: User) {
    const categories = await this.getPuzzlesCategories(
      categoryData.clientId,
      user,
    );
    if (categories.includes(categoryData.categoryName.toLowerCase())) {
      throw new BadRequestException(
        `puzzle category ${categoryData.categoryName} is already exists for this client`,
      );
    }

    const category = new this.PuzzleModel(categoryData);
    category.category = categoryData.categoryName;
    return await category.save();
  }
  async createPuzzle(puzzleData: CreatePuzzleDto, user: User) {
    const categories = await this.getPuzzlesCategories(
      puzzleData.clientId,
      user,
    );
    if (!categories.includes(puzzleData.category.toLowerCase())) {
      throw new BadRequestException(
        `puzzle category '${puzzleData.category}' is not a valid category name`,
      );
    }

    const puzzle = await this.checkPuzzleByClientIdAndName(
      puzzleData.clientId,
      puzzleData.name,
    );
    if (puzzle) {
      throw new BadRequestException(
        `puzzle with name '${puzzleData.name}' is already exists for this client`,
      );
    }

    const existingPuzzleInCategory = await this.PuzzleModel.findOne({
      category: puzzleData.category.toLowerCase(),
    });

    let puzzleFromDb;
    //checking if puzzle in newly created category is being added
    if (existingPuzzleInCategory.name) {
      const puzzle = omit(
        {
          ...puzzleData,
          isCategoryCreatedByUser:
            existingPuzzleInCategory.isCategoryCreatedByUser,
          categoryUrl: existingPuzzleInCategory.categoryUrl,
        },
        '_id',
        'createdAt',
        'updatedAt',
      );
      puzzleFromDb = await new this.PuzzleModel(puzzle).save();
    } else {
      puzzleFromDb = await this.PuzzleModel.findByIdAndUpdate(
        existingPuzzleInCategory._id,
        puzzleData,
        { new: true },
      );
    }
    this.emitter.emit('PuzzleCreated', puzzleFromDb);
    return puzzleFromDb;
  }
  async getPuzzlesByDeviceId(deviceId) {
    const client = await this.clientService.getClientByDevice(deviceId);
    if (!client)
      throw new BadRequestException('Child not connected to that device');
    const puzzles = await this.PuzzleModel.find({
      clientId: client._id,
      name: { $exists: true },
    }).sort('name');
    return puzzles;
  }
  async checkPuzzleByClientIdAndName(clientId, puzzleName: string) {
    const puzzle = await this.PuzzleModel.findOne({
      clientId,
      name: puzzleName.toLowerCase(),
    });
    return puzzle;
  }
  async updatePuzzleProgress(
    clientId,
    puzzleId: Types.ObjectId,
    body: UpdatePuzzleDto,
  ) {
    const puzzle = await this.PuzzleModel.findOne({
      clientId,
      _id: puzzleId,
    });
    if (!puzzle)
      throw new NotFoundException(
        `${puzzleId} does not exists for client ${clientId}`,
      );

    if (puzzle.isCompleted)
      throw new BadRequestException(`${puzzleId} already completed`);

    const puzzleFromDb = await this.PuzzleModel.findByIdAndUpdate(
      puzzle._id,
      {
        isCompleted: body.completedPieces.length == 16 ? true : false,
        lastCompleted: body.completedPieces.length == 16 ? new Date() : null,
        completedPieces: body.completedPieces,
      },
      { new: true },
    );
    this.emitter.emit('PuzzleUpdated', puzzleFromDb);
    return { oldPuzzle: puzzle, newPuzzle: puzzleFromDb };
  }
  async migratePuzzleProgress(
    clientId,
    puzzleName: string,
    completedPieces: number[],
  ) {
    const puzzle = await this.PuzzleModel.findOne({
      clientId,
      name: puzzleName,
    });
    if (!puzzle)
      throw new NotFoundException(
        `puzzle name ${puzzleName} does not exists for client ${clientId}`,
      );

    const puzzleFromDb = await this.PuzzleModel.findByIdAndUpdate(
      puzzle._id,
      {
        isCompleted: completedPieces.length == 16 ? true : false,
        lastCompleted: completedPieces.length == 16 ? new Date() : null,
        completedPieces,
      },
      { new: true },
    );
    return puzzleFromDb;
  }

  async deleteById(puzzleId: Types.ObjectId, user: User): Promise<void> {
    const puzzle = await this.PuzzleModel.findById(puzzleId);
    if (!puzzle) throw new NotFoundException(`puzzleId ${puzzleId} not found`);
    else if (!puzzle.isPuzzleCreatedByUser)
      throw new NotFoundException(
        `system puzzle with id ${puzzleId} is not allowed to deleted`,
      );
    //get puzzle category
    const totalCategories = await this.PuzzleModel.find({
      clientId: puzzle.clientId,
      category: puzzle.category,
    });
    if (totalCategories.length == 1) {
      await this.PuzzleModel.findByIdAndUpdate(
        puzzle._id,
        {
          $unset: {
            name: 1,
            puzzleUrl: 1,
            isCompleted: 1,
            lastCompleted: 1,
            completedPieces: 1,
          },
        },
        { new: true },
      );
    } else await puzzle.remove();
    this.emitter.emit('PuzzleDeleted', puzzle);
  }

  async deleteCategoryByName(
    clientId: Types.ObjectId,
    category: string,
    user: User,
  ): Promise<void> {
    const puzzles = await this.PuzzleModel.find({
      category: category.toLowerCase(),
      clientId,
    });
    if (!puzzles || puzzles.length == 0)
      throw new NotFoundException(`category with name ${category} not found`);
    else if (!puzzles[0].isCategoryCreatedByUser)
      throw new NotFoundException(
        `system category with name ${category} is not allowed to deleted`,
      );
    await this.PuzzleModel.deleteMany({
      clientId,
      category: category.toLowerCase(),
    });
    this.emitter.emit('PuzzleCategoryDeleted', puzzles);
  }

  async initPuzzlesAndCategories() {
    try {
      const puzzlesCategories = await this.readDirAsync(
        this.puzzlesWithCategoriesPath,
      );
      const puzzlesWithCategories = await BB.map(
        puzzlesCategories,
        async category => {
          let puzzles: any[] = await this.readDirAsync(
            path.resolve(this.puzzlesWithCategoriesPath, category),
          );
          puzzles = puzzles.map(puzzle => {
            return {
              name: puzzle.split('.')[0],
              puzzleUrl: this.getUrl(puzzle, category),
              categoryUrl: this.getCategoryUrl(category.toLowerCase()),
              category: category,
              isPuzzleCreatedByUser: false,
              isCategoryCreatedByUser: false,
            };
          });
          return flatten(puzzles);
        },
      );
      this.puzzles = flatten(puzzlesWithCategories);
    } catch (e) {
      console.log(e);
    }
  }

  async addClientPuzzles(client: Client) {
    this.puzzles.map(puzzle => {
      puzzle.clientId = client._id;
      puzzle.isCompleted = false;
      puzzle.lastCompleted = null;
      puzzle.completedPieces = [];

      //migrate completed puzzles
      const completedPuzzle = client.puzzles.filter(
        completedPuzzle => puzzle.name == completedPuzzle.name,
      );
      if (completedPuzzle && completedPuzzle.length > 0) {
        puzzle.isCompleted = true;
        puzzle.lastCompleted = completedPuzzle[0].completedAt;
        puzzle.completedPieces = Array.from(Array(16).keys());
      }
    });
    this.PuzzleModel.insertMany(this.puzzles);
    return true;
  }

  readDirAsync(pathToRead): Promise<string[]> {
    return new Promise((res, rej) => {
      fs.readdir(path.resolve(pathToRead), (err, files) => {
        if (err) rej(err);
        else res(files as string[]);
      });
    });
  }

  getUrl(nameWithExt: string, category: string) {
    return `https://${
      this.bucket
    }.s3.amazonaws.com/puzzles/${category.toLowerCase()}/${nameWithExt}`;
  }

  getCategoryUrl(name: string) {
    if (name == 'activities' || name == 'people' || name == 'shapes') {
      return `https://${this.bucket}.s3.amazonaws.com/puzzles/categories/${name}.png`;
    } else if (name == 'animals' || name == 'machines' || name == 'nature') {
      return `https://${this.bucket}.s3.amazonaws.com/puzzles/categories/${name}.svg`;
    }
  }
}
