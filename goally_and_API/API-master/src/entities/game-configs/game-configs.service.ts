import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as BB from 'bluebird';
import * as moment from 'moment';
import { Model, Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { ClientsService } from '../clients/clients.service';
import { UpdateGameConfigDto } from './dto/UpdateGameConfig.dto';
import { UpdateMagicPlayMinsDto } from './dto/UpdateMagicPlayMins.dto';
import { defaultGameConfig } from './predefinedData/default-game-config';
import { GameConfig } from './schema/game-configs.schema';

@Injectable()
export class GameConfigsService {
  constructor(
    @InjectModel(GameConfig.name) private GameConfigModel: Model<GameConfig>,
    @Inject(forwardRef(() => ClientsService))
    private cs: ClientsService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
  ) {}

  async createPredefinedGameConfig(
    clientId: Types.ObjectId,
  ): Promise<GameConfig> {
    const gameConfigFromDb = await this.GameConfigModel.findOne({
      clientId,
    });
    if (gameConfigFromDb) return gameConfigFromDb;

    const savedGameConfig = await new this.GameConfigModel({
      ...defaultGameConfig,
      clientId,
    }).save();
    return savedGameConfig;
  }

  async getClientGameConfig(clientId: Types.ObjectId): Promise<GameConfig> {
    const gameConfig = await this.GameConfigModel.findOne({ clientId });
    if (!gameConfig) {
      throw new BadRequestException(
        `Game config does not exist for client: ${clientId}`,
      );
    }
    return gameConfig;
  }

  async update(
    body: UpdateGameConfigDto,
    id: Types.ObjectId,
  ): Promise<GameConfig> {
    const gameConfig = await this.GameConfigModel.findById(id);
    if (!gameConfig) {
      throw new BadRequestException(
        `Game configs does not exists with id: ${id}`,
      );
    }

    if (body.startTime && body.endTime) {
      body.duration = this.getDuration(body.startTime, body.endTime);
    }
    const updatedGameConfig = await this.GameConfigModel.findByIdAndUpdate(
      id,
      body,
      { new: true },
    );
    this.emitter.emit('GameConfigUpdated', updatedGameConfig);
    return updatedGameConfig;
  }

  async updateMagicPlayMins(
    body: UpdateMagicPlayMinsDto,
    id: Types.ObjectId,
  ): Promise<GameConfig> {
    const gameConfig = await this.GameConfigModel.findById(id);
    if (!gameConfig) {
      throw new BadRequestException(
        `Game configs does not exists with id: ${id}`,
      );
    }

    gameConfig.magicPlayMinsUpdatedAt = new Date();
    gameConfig.magicPlayMins = body.magicPlayMins;

    const updatedGameConfig = await this.GameConfigModel.findByIdAndUpdate(
      id,
      gameConfig,
      { new: true },
    );
    this.emitter.emit('GameConfigUpdated', updatedGameConfig);
    return updatedGameConfig;
  }

  async disableHighProcessGamesForClient(
    clientId: Types.ObjectId,
    memorySize: number,
  ): Promise<GameConfig> {
    if (memorySize && memorySize < 800) {
      const gameConfig = await this.GameConfigModel.findOne({ clientId });
      if (!gameConfig) {
        throw new BadRequestException(
          `Game configs does not exists for client id: ${clientId}`,
        );
      }

      //disable high processing games for this client becuase connected device has < 800 memory
      gameConfig.games.forEach(game => {
        if (
          game.name.toLowerCase() == 'hungry frog' ||
          game.name.toLowerCase() == 'unicorn blast' ||
          game.name.toLowerCase() == 'dino egg defense'
        ) {
          game.isActive = false;
          game.isHighProcessing = true;
        }
      });
      const updatedGameConfig = await this.GameConfigModel.findByIdAndUpdate(
        gameConfig._id,
        gameConfig,
        { new: true },
      );
      this.emitter.emit('GameConfigUpdated', updatedGameConfig);
      return updatedGameConfig;
    }
  }

  async addGameConfigs() {
    const total = await this.cs.ClientModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const clients = await this.cs.ClientModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(clients, async client => {
          await this.createPredefinedGameConfig(client._id);
        });
      });
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e,
      };
    }
  }

  getDuration(startTime: string, endTime: string): number {
    const start = moment(startTime, 'hh:mm a');
    const end = moment(endTime, 'hh:mm a');
    if (start.isAfter(end)) {
      end.add(1, 'day');
    }
    return moment.duration(end.diff(start)).asMinutes();
  }

  async addHighProcessingFields() {
    const total = await this.GameConfigModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const gameConfigs = await this.GameConfigModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(gameConfigs, async gameConfig => {
          await this.addHighProcessingField(gameConfig);
        });
      });
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e,
      };
    }
  }

  async addHighProcessingField(gameConfig: GameConfig) {
    gameConfig.games.forEach(game => {
      game.isHighProcessing = false;
    });
    gameConfig.save();
  }

  async reValidateDevicesGameProcessing(
    deviceId: Types.ObjectId,
    memorySize: number,
  ): Promise<GameConfig> {
    const client = await this.cs.getClientByDevice(deviceId);
    if (client) {
      const gameConfig = await this.GameConfigModel.findOne({
        clientId: client._id,
      });
      if (!gameConfig) {
        throw new BadRequestException(
          `Game configs does not exists for client id: ${client._id}`,
        );
      }

      //disable high processing games for this client becuase connected device has < 800 memory
      gameConfig.games.forEach(game => {
        if (memorySize < 800) {
          if (
            game.name.toLowerCase() == 'hungry frog' ||
            game.name.toLowerCase() == 'unicorn blast' ||
            game.name.toLowerCase() == 'dino egg defense'
          ) {
            game.isActive = false;
            game.isHighProcessing = true;
          } else {
            game.isActive = true;
            game.isHighProcessing = false;
          }
        } else {
          game.isActive = true;
          game.isHighProcessing = false;
        }
      });
      const updatedGameConfig = await this.GameConfigModel.findByIdAndUpdate(
        gameConfig._id,
        gameConfig,
        { new: true },
      );
      return updatedGameConfig;
    }
  }
}
