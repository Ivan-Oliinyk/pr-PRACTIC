import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as BB from 'bluebird';
import { flatten, omit } from 'lodash';
import * as moment from 'moment';
import { DocumentDefinition, Model, Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import * as P from 'path';
import { EnvironmentVariables } from 'src/config';
import { ClientsService } from 'src/entities/clients/clients.service';
import { PollyService } from 'src/entities/polly/polly.service';
import { User } from 'src/entities/users/schema';
import { LIBRARY_TYPES } from 'src/shared/const';
import { AAC_VISUAL_AID_TYPES } from 'src/shared/const/aac-visual-aids';
import { VOICE_NAMES } from 'src/shared/const/aac-voices';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { AacFoldersService } from '../aac-folders/aac-folders.service';
import { CreateChildFolder } from '../aac-folders/dto/CreateChildFolder';
import { CreateChildSubFolder } from '../aac-folders/dto/CreateChildSubFolder';
import { AddWordsDto } from './dto/AddWords.dto';
import { CopyWord } from './dto/CopyWord';
import { CreateChildGrouping } from './dto/CreateChildGrouping';
import { CreateChildWord } from './dto/CreateChildWord';
import { CreateWord } from './dto/CreateWord';
import { DeleteWordsDto } from './dto/DeleteWords';
import { UpdateWordsDto } from './dto/UpdateWords.dto';
import { AacWord } from './schema/aac-word.schema';

@Injectable()
export class AacWordsService {
  bucket: string;

  constructor(
    @InjectModel(AacWord.name) private AacWordModel: Model<AacWord>,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private cs: ClientsService,
    private pollyService: PollyService,
    private aacFoldersService: AacFoldersService,
    private config: ConfigService<EnvironmentVariables>,
  ) {
    this.bucket = this.config.get('AWS_BUCKET');
  }

  async create(wordData: CreateWord, user: User): Promise<AacWord> {
    const folder = await this.aacFoldersService.findById(wordData.folderId);
    if (!folder)
      throw new BadRequestException(
        `folder id ${wordData.folderId} does not exists`,
      );
    const subFolders = await this.aacFoldersService.getSubFoldersOfFolder(
      folder._id,
      null,
      user,
      false,
    );
    if (subFolders && subFolders.length > 0)
      throw new BadRequestException(
        `folder must have to be added into one of subfolders of ${wordData.folderId}`,
      );

    const word = new this.AacWordModel(wordData);
    word.grouping = 3000;
    word.alphabet = 'F';

    const highestSerialWord = await this.getHighestSerialId(
      user,
      word.alphabet,
      word.grouping,
    );
    if (highestSerialWord) word.serial = highestSerialWord.serial + 1;
    else word.serial = 9000;

    word.subSerial = 1;
    word.gridPosition = 0;
    word.displayId = `${word.alphabet}-${word.serial}-${word.subSerial}`;
    word.createdBy = user._id;
    word.libraryType = LIBRARY_TYPES.ADULT;
    word.partOfSpeech = word.partOfSpeech.toLowerCase();
    word.visualAidType = AAC_VISUAL_AID_TYPES.IMAGE;
    word.folderDisplayId = folder.folderId;
    word.parentFolderDisplayId = folder.parentFolderId;

    if (word.mp3Url) word.isCustomVoice = true;

    this.pollyService.initSpeechFile(VOICE_NAMES, word.text);
    const savedWord = await word.save();
    this.aacFoldersService.updateWordsQty(savedWord.folderId, user, null);
    this.emitter.emit('AacWordCreated', savedWord);
    return savedWord;
  }

  async getHighestSerialId(user, alphabet, grouping): Promise<AacWord> {
    const word = await this.AacWordModel.findOne({
      alphabet,
      createdBy: user._id,
      grouping,
    })
      .sort({ serial: -1 })
      .limit(1);
    return word;
  }

  async createWordForChild(wordData: CreateChildWord, user: User) {
    const parentWord = await this.AacWordModel.findOne({
      _id: wordData.parentWordId,
      libraryType: LIBRARY_TYPES.ADULT,
    }).lean();
    if (!parentWord)
      throw new NotFoundException(
        `word ${wordData.parentWordId} not found in dictionary`,
      );

    await this.aacFoldersService.createParentFolderFromSubFolder(
      parentWord.folderId,
      wordData.clientId,
      user,
    );
    await this.aacFoldersService.createForChild(
      user,
      wordData.clientId,
      parentWord.folderId,
    );

    const folder = await this.aacFoldersService.getFolderForChild(
      user,
      wordData.clientId,
      parentWord.folderId,
    );
    //remove existing words
    const deletedWords = await this.AacWordModel.deleteMany({
      folderId: folder._id,
      libraryType: LIBRARY_TYPES.CHILD,
      isDictionary: false,
      clientId: wordData.clientId,
      text: parentWord.text,
      displayId: parentWord.displayId,
      createdBy: user._id,
    });

    const newWord = omit(
      {
        ...parentWord,
        ...wordData,
        createdBy: user._id,
        libraryType: LIBRARY_TYPES.CHILD,
        isDictionary: false,
        folderId: folder._id,
      },
      '_id',
      'createdAt',
      'updatedAt',
    );

    const aacWord = new this.AacWordModel(newWord);
    const savedAacWord = await aacWord.save();
    this.aacFoldersService.updateWordsQty(
      savedAacWord.folderId,
      user,
      wordData.clientId,
    );
    this.emitter.emit('AacWordAddedForTheChild', savedAacWord);
    return savedAacWord;
  }

  async createFolderForChild(wordData: CreateChildFolder, user: User) {
    let parentWords;
    parentWords = await this.AacWordModel.find({
      folderId: wordData.folderId,
      libraryType: LIBRARY_TYPES.ADULT,
      $or: [{ createdBy: null }, { createdBy: user._id }],
    }).lean();

    if (!parentWords || parentWords.length == 0) {
      //folder does have subFolders
      const subFolders = await this.aacFoldersService.getSubFoldersOfFolder(
        wordData.folderId as Types.ObjectId,
        wordData.clientId,
        user,
      );
      const result = await BB.map(subFolders, async subFolder => {
        parentWords = await this.AacWordModel.find({
          folderId: subFolder._id,
          libraryType: LIBRARY_TYPES.ADULT,
          $or: [{ createdBy: null }, { createdBy: user._id }],
        }).lean();

        parentWords = await this.getNotAddedWords(
          parentWords,
          wordData.clientId,
          user,
        );

        const words = await this.createFolderAndWords(
          user,
          wordData.clientId,
          subFolder._id,
          parentWords,
        );
        return words;
      });
      return flatten(result);
    } else {
      parentWords = await this.getNotAddedWords(
        parentWords,
        wordData.clientId,
        user,
      );
      const savedAacWords = await this.createFolderAndWords(
        user,
        wordData.clientId,
        wordData.folderId,
        parentWords,
      );
      return savedAacWords;
    }
  }

  async createSubFolderForChild(wordData: CreateChildSubFolder, user: User) {
    //check for subFolder
    let parentWords;
    parentWords = await this.AacWordModel.find({
      folderId: wordData.subFolderId,
      libraryType: LIBRARY_TYPES.ADULT,
      $or: [{ createdBy: null }, { createdBy: user._id }],
    }).lean();

    if (!parentWords || parentWords.length == 0)
      throw new NotFoundException(
        `SubFolder with id ${wordData.subFolderId} not found`,
      );
    parentWords = await this.getNotAddedWords(
      parentWords,
      wordData.clientId,
      user,
    );
    await this.aacFoldersService.createParentFolderFromSubFolder(
      wordData.subFolderId,
      wordData.clientId,
      user,
    );
    const savedAacWords = await this.createFolderAndWords(
      user,
      wordData.clientId,
      wordData.subFolderId,
      parentWords,
    );
    return savedAacWords;
  }

  async createFolderAndWords(
    user,
    clientId,
    folderId,
    parentWords: DocumentDefinition<AacWord>[],
  ) {
    await this.aacFoldersService.createForChild(user, clientId, folderId);

    const folder = await this.aacFoldersService.getFolderForChild(
      user,
      clientId,
      folderId,
    );

    const results = await BB.map(parentWords, async word => {
      return omit(
        {
          ...word,
          clientId,
          createdBy: user._id,
          libraryType: LIBRARY_TYPES.CHILD,
          isDictionary: false,
          folderId: folder._id,
        },
        '_id',
        'createdAt',
        'updatedAt',
      );
    });
    const savedAacWords = await this.AacWordModel.insertMany(results);
    this.aacFoldersService.updateWordsQty(folder._id, user, clientId);
    if (savedAacWords.length > 0)
      this.emitter.emit('AacMultipleWordsAddedForTheChild', savedAacWords);
    return savedAacWords;
  }

  async getNotAddedWords(
    parentWords: DocumentDefinition<AacWord>[],
    clientId,
    user,
  ): Promise<DocumentDefinition<AacWord>[]> {
    const notAddedWords = await BB.map(parentWords, async parentWord => {
      const word = await this.AacWordModel.findOne({
        libraryType: LIBRARY_TYPES.CHILD,
        isDictionary: false,
        clientId,
        folderDisplayId: parentWord.folderDisplayId,
        displayId: parentWord.displayId,
        createdBy: user._id,
      }).lean();
      if (word) return [];
      else return parentWord;
    });
    return flatten(notAddedWords);
  }

  async createGroupingForChild(wordData: CreateChildGrouping, user: User) {
    // this.aacFoldersService.updateUserFoldersQty(user._id);

    const grouping = wordData.grouping;
    const words = await this.AacWordModel.find({
      grouping: { $lte: grouping },
      libraryType: LIBRARY_TYPES.ADULT,
    }).lean();
    if (!words || words.length == 0)
      throw new NotFoundException(`grouping ${grouping} not found`);

    //remove existing words
    const deletedWords = await this.AacWordModel.deleteMany({
      libraryType: LIBRARY_TYPES.CHILD,
      isDictionary: false,
      clientId: wordData.clientId,
      createdBy: user._id,
    });
    await this.aacFoldersService.removeClientFolders(wordData.clientId, user);

    const folderIds = await this.AacWordModel.find({
      grouping: { $lte: grouping },
      libraryType: LIBRARY_TYPES.ADULT,
    })
      .distinct('folderId')
      .lean();
    const newFolders = await this.aacFoldersService.createGroupingFolder(
      user,
      wordData.clientId,
      folderIds,
    );

    const newWords = await BB.map(words, async word => {
      const folder = await this.aacFoldersService.getFolderForChild(
        user,
        wordData.clientId,
        word.folderId,
      );
      const childWord = omit(
        {
          ...word,
          ...wordData,
          createdBy: user._id,
          libraryType: LIBRARY_TYPES.CHILD,
          isDictionary: false,
          folderId: folder._id,
        },
        '_id',
        'createdAt',
        'updatedAt',
      );

      return childWord;
    });
    const savedAacWords = await this.AacWordModel.insertMany(newWords);
    BB.map(newFolders, aacFolder => {
      this.aacFoldersService.updateWordsQty(
        aacFolder._id,
        user,
        wordData.clientId,
      );
    });
    this.emitter.emit('AacMultipleWordsAddedForTheChild', savedAacWords);
    return newWords;
  }

  async getUserWords(folderId: Types.ObjectId, user: User) {
    const arrFilter = [];
    arrFilter.push({ $or: [{ createdBy: user._id }, { createdBy: null }] });
    const objFilter = { libraryType: LIBRARY_TYPES.ADULT };

    if (folderId) {
      Object.assign(objFilter, {
        folderId,
      });
    }
    Object.assign(objFilter, { $and: arrFilter });
    const words = await this.AacWordModel.find(objFilter).sort('text');
    const folder = await this.aacFoldersService.findById(folderId);
    return { words, folder };
  }

  async getUserSearchWords(search: string, user: User) {
    const arrFilter = [];
    arrFilter.push({ $or: [{ createdBy: user._id }, { createdBy: null }] });
    const objFilter = { libraryType: LIBRARY_TYPES.ADULT };

    if (search) {
      const searchRegex = { $regex: new RegExp(search, 'i') };
      arrFilter.push({
        $or: [{ text: searchRegex }, { label: searchRegex }],
      });
    }
    Object.assign(objFilter, { $and: arrFilter });

    const folders = await this.aacFoldersService.getUserSearchFolder(
      search,
      user,
    );
    const words = await this.AacWordModel.find(objFilter).sort('text');
    return { words, folders };
  }

  async update(
    wordData: Partial<AacWord>,
    wordId: Types.ObjectId,
    user: User,
  ): Promise<AacWord> {
    const word = await this.findById(wordId);
    if (!word) throw new NotFoundException(`Word with id ${wordId} not found`);
    if (word.isDictionary)
      throw new NotFoundException(`Dictionary words are not allowed to edit`);

    const folder = await this.aacFoldersService.findById(wordData.folderId);
    if (!folder)
      throw new BadRequestException(
        `folder id ${wordData.folderId} does not exists`,
      );

    if (wordData.visualAidType == AAC_VISUAL_AID_TYPES.EMOJI) {
      if (
        wordData.visualAid.charAt(0) != 'U' &&
        wordData.visualAid.charAt(1) != '+'
      ) {
        throw new BadRequestException(
          `visualAidType is EMOJI but visualAid is not emoji ${wordData.visualAid}`,
        );
      }
    }

    if (folder.libraryType == LIBRARY_TYPES.ADULT) {
      const subFolders = await this.aacFoldersService.getSubFoldersOfFolder(
        folder._id,
        null,
        user,
        false,
      );
      if (subFolders && subFolders.length > 0)
        throw new BadRequestException(
          `folder must have to be added into one of subfolders of ${wordData.folderId}`,
        );
    } else {
      const subFolders = await this.aacFoldersService.getSubFoldersForChildWithType(
        user,
        folder.clientId,
        folder._id,
      );
      if (subFolders && subFolders.length > 0)
        throw new BadRequestException(
          `folder must have to be added into one of subfolders of ${wordData.folderId}`,
        );
    }

    wordData.folderDisplayId = folder.folderId;
    wordData.parentFolderDisplayId = folder.parentFolderId;
    wordData.partOfSpeech = wordData.partOfSpeech.toLowerCase();
    if (wordData.mp3Url) wordData.isCustomVoice = true;

    const savedWord = await this.AacWordModel.findByIdAndUpdate(
      wordId,
      wordData,
      {
        new: true,
      },
    );
    if (word.text != savedWord.text) {
      this.pollyService.initSpeechFile(VOICE_NAMES, savedWord.text);
    }
    this.emitter.emit('AacWordUpdated', savedWord);
    return savedWord;
  }

  async findById(wordId: Types.ObjectId): Promise<AacWord> {
    const word = await this.AacWordModel.findById(wordId);
    return word;
  }

  async findWordByIdAndClientId(
    wordId: Types.ObjectId,
    clientId: Types.ObjectId,
  ): Promise<DocumentDefinition<AacWord>> {
    const word = await this.AacWordModel.findOne({
      _id: wordId,
      isDictionary: false,
      clientId,
      libraryType: LIBRARY_TYPES.CHILD,
    })
      .limit(1)
      .lean();
    return word;
  }
  async deleteById(wordId: Types.ObjectId, user: User): Promise<void> {
    const word = await this.findById(wordId);
    if (!word) throw new NotFoundException(`Word with id ${wordId} not found`);
    if (word.isDictionary)
      throw new NotFoundException(`Dictionary words are not allowed to delete`);
    await word.remove();
    this.aacFoldersService.updateWordsQty(word.folderId, user, word.clientId);
    this.emitter.emit('AacWordDeleted', word);
  }

  async deleteList(
    deleteWordsDto: DeleteWordsDto,
    clientId: Types.ObjectId,
    user: User,
  ): Promise<void> {
    const words = await this.AacWordModel.find({
      libraryType: LIBRARY_TYPES.CHILD,
      clientId,
      isDictionary: false,
      _id: { $in: deleteWordsDto.words },
    });

    await this.deleteListChecks(words, clientId);

    await this.AacWordModel.deleteMany({
      _id: { $in: words },
    });
    await this.aacFoldersService.updateWordsQty(
      words[0].folderId,
      user,
      clientId,
    );
    this.emitter.emit('AacMultipleWordsDeletedForTheChild', words);
  }

  async getChildWords(
    folderId: Types.ObjectId,
    clientId: Types.ObjectId,
    user: User,
  ) {
    const client = await this.cs.findById(clientId);
    if (!client) throw new NotFoundException(`client id ${clientId} not found`);

    const objFilter = { libraryType: LIBRARY_TYPES.CHILD, clientId };
    if (folderId) {
      Object.assign(objFilter, {
        folderId,
      });
    }
    console.log(objFilter);
    const words = await this.AacWordModel.find(objFilter).sort('text');
    const folder = await this.aacFoldersService.findById(folderId);
    return { words, folder };
  }

  async getParentFolderWords(
    folderId: Types.ObjectId,
    clientId: Types.ObjectId,
    user: User,
  ) {
    const client = await this.cs.findById(clientId);
    if (!client) throw new NotFoundException(`client id ${clientId} not found`);

    const folder = await this.aacFoldersService.findById(folderId);
    if (!folder) throw new NotFoundException(`folder id ${folderId} not found`);

    const objFilter = { libraryType: LIBRARY_TYPES.CHILD, clientId };
    if (folderId) {
      Object.assign(objFilter, {
        folderId,
      });
    }
    const words = await this.AacWordModel.find(objFilter).sort('text');
    if (words && words.length > 0) return words;
    else {
      if (folderId) {
        const subFolders = await this.aacFoldersService.getSubFoldersForChild(
          user,
          clientId,
          folderId,
        );
        const subFolderwords = await BB.map(subFolders, async subFolder => {
          Object.assign(objFilter, {
            folderId: subFolder._id,
          });
          return await this.AacWordModel.find(objFilter).sort('text');
        });
        return flatten(subFolderwords);
      }
    }
  }

  async getAdminWordsByFolderId(folderId: Types.ObjectId) {
    const folder = await this.aacFoldersService.findOne({
      _id: folderId,
      isDictionary: true,
      libraryType: LIBRARY_TYPES.ADULT,
    });

    const rootFolderFilter = {
      libraryType: LIBRARY_TYPES.ADULT,
      isDictionary: true,
      folderId,
    };
    const words = await this.AacWordModel.find(rootFolderFilter).sort('text');
    if (words && words.length > 0) return words;
    else {
      const subFolderFilter = {
        libraryType: LIBRARY_TYPES.ADULT,
        isDictionary: true,
        parentFolderDisplayId: folder.parentFolderId,
      };
      const words = await this.AacWordModel.find(subFolderFilter).sort('text');
      return words;
    }
  }

  async adminUpdateWord(
    wordData: Partial<AacWord>,
    wordId: Types.ObjectId,
  ): Promise<AacWord> {
    const word = await this.findById(wordId);
    if (!word) throw new NotFoundException(`Word with id ${wordId} not found`);
    if (!word.isDictionary)
      throw new NotFoundException(
        `Non dictionary words are not allowed to edit`,
      );

    const folder = await this.aacFoldersService.findById(wordData.folderId);
    if (!folder)
      throw new BadRequestException(
        `folder id ${wordData.folderId} does not exists`,
      );

    if (wordData.visualAidType == AAC_VISUAL_AID_TYPES.EMOJI) {
      if (
        wordData.visualAid.charAt(0) != 'U' &&
        wordData.visualAid.charAt(1) != '+'
      ) {
        throw new BadRequestException(
          `visualAidType is EMOJI but visualAid is not emoji ${wordData.visualAid}`,
        );
      }
    }

    if (folder.libraryType == LIBRARY_TYPES.ADULT) {
      const subFolders = await this.aacFoldersService.getSubFoldersOfFolder(
        folder._id,
        null,
        null,
        false,
      );
      if (subFolders && subFolders.length > 0)
        throw new BadRequestException(
          `word must have to be added into one of subfolders of ${wordData.folderId}`,
        );
    }

    wordData.folderDisplayId = folder.folderId;
    wordData.parentFolderDisplayId = folder.parentFolderId;
    wordData.partOfSpeech = wordData.partOfSpeech.toLowerCase();
    if (wordData.mp3Url) wordData.isCustomVoice = true;

    const savedWord = await this.AacWordModel.findByIdAndUpdate(
      wordId,
      wordData,
      {
        new: true,
      },
    );
    if (word.text != savedWord.text) {
      this.pollyService.initSpeechFile(VOICE_NAMES, savedWord.text);
    }
    return savedWord;
  }

  async getChildSearchWords(
    search: string,
    clientId: Types.ObjectId,
    user: User,
  ) {
    const client = await this.cs.findById(clientId);
    if (!client) throw new NotFoundException(`client id ${clientId} not found`);

    const objFilter = { libraryType: LIBRARY_TYPES.CHILD, clientId };
    if (search) {
      const searchRegex = { $regex: new RegExp(search, 'i') };
      Object.assign(objFilter, {
        $or: [{ text: searchRegex }, { label: searchRegex }],
      });
    }
    const folders = await this.aacFoldersService.getChildSearchFolder(
      search,
      clientId,
      user,
    );

    const words = await this.AacWordModel.find(objFilter).sort('text');
    return { words, folders };
  }
  findClientWords(clientId) {
    return this.AacWordModel.find({ clientId }).sort('text');
  }
  async getClientWordsByDeviceId(deviceId: Types.ObjectId) {
    const client = await this.cs.getClientByDevice(deviceId);
    if (!client)
      throw new BadRequestException('Child not connected to that device');
    const words = await this.findClientWords(client._id);

    return words;
  }
  async getClientWordByDeviceIdAndId(
    deviceId: Types.ObjectId,
    wordId: Types.ObjectId,
  ) {
    const client = await this.cs.getClientByDevice(deviceId);
    if (!client)
      throw new BadRequestException('Child not connected to that device');

    const word = await this.findById(wordId);
    if (!word)
      throw new NotFoundException(
        `word with id ${wordId}  doest not exist for the device with id ${deviceId}`,
      );
    return word;
  }

  async modelChildWord(wordId: Types.ObjectId, user: User): Promise<AacWord> {
    const word = await this.findById(wordId);
    if (!word) throw new NotFoundException(`Word with id ${wordId} not found`);

    if (word.libraryType != LIBRARY_TYPES.CHILD)
      throw new NotFoundException(
        `Word with id ${wordId} has libray type ADULT`,
      );

    this.emitter.emit('AacWordModelForTheChild', word);
    return word;
  }

  async hideChildWord(wordId: Types.ObjectId, user: User): Promise<AacWord> {
    const word = await this.findById(wordId);
    if (!word) throw new NotFoundException(`Word with id ${wordId} not found`);

    if (word.libraryType != LIBRARY_TYPES.CHILD)
      throw new NotFoundException(
        `Word with id ${wordId} has libray type ADULT`,
      );

    const hiddenUntil = moment()
      .add(30, 'seconds')
      .toDate();
    const savedWord = await this.AacWordModel.findByIdAndUpdate(
      wordId,
      { hiddenUntil },
      { new: true },
    );
    this.emitter.emit('AacWordUpdated', savedWord);
    return savedWord;
  }

  async pinChildWord(wordId: Types.ObjectId, user: User): Promise<AacWord> {
    const word = await this.findById(wordId);
    if (!word) throw new NotFoundException(`Word with id ${wordId} not found`);

    if (word.libraryType != LIBRARY_TYPES.CHILD)
      throw new NotFoundException(
        `Word with id ${wordId} has library type ADULT`,
      );

    if (word.pinOrder) {
      const savedWord = await this.AacWordModel.findByIdAndUpdate(
        wordId,
        { $unset: { pinOrder: 1 } },
        { new: true },
      );
      this.emitter.emit('AacWordUpdated', savedWord);
      return savedWord;
    } else {
      let pinOrder = 1;
      const highestPinWord = await this.getHighestPin(word, user);
      if (highestPinWord && highestPinWord.pinOrder)
        pinOrder = highestPinWord.pinOrder + 1;
      const savedWord = await this.AacWordModel.findByIdAndUpdate(
        wordId,
        { pinOrder },
        { new: true },
      );
      this.emitter.emit('AacWordUpdated', savedWord);
      return savedWord;
    }
  }

  async getHighestPin(pinWord, user): Promise<AacWord> {
    const word = await this.AacWordModel.findOne({
      createdBy: user._id,
      isDictionary: false,
      libraryType: LIBRARY_TYPES.CHILD,
      clientId: pinWord.clientId,
      _id: { $ne: pinWord._id },
    })
      .sort({ pinOrder: -1 })
      .limit(1);
    return word;
  }

  async updatePins(folderId: Types.ObjectId, user: User) {
    const folder = await this.aacFoldersService.findById(folderId);
    if (!folder)
      throw new BadRequestException(
        `folder with id ${folderId} does not exists`,
      );
    if (folder.libraryType != LIBRARY_TYPES.CHILD)
      throw new NotFoundException(
        `Dictionary folders are not allowed to remove pins`,
      );

    // let pinWords = await this.AacWordModel.find({
    //   pinOrder: { $gte: 1 },
    // });

    let updatedWords;
    updatedWords = await this.AacWordModel.updateMany(
      { folderId },
      {
        $unset: { pinOrder: 1 },
      },
      { multi: true },
    );
    updatedWords = await this.AacWordModel.find({ folderId });

    //get user sub folder from folder
    const subFolders = await this.aacFoldersService.getClientSubFolders(
      folder.folderId,
      folder.clientId,
    );
    if (subFolders && subFolders.length > 0) {
      updatedWords = await BB.map(subFolders, async subFolder => {
        //update inside subfolders words
        await this.AacWordModel.updateMany(
          { folderId: subFolder._id },
          {
            $unset: { pinOrder: 1 },
          },
          { multi: true },
        );
        return await this.AacWordModel.find({ folderId: subFolder._id });
      });
    }
    this.emitter.emit('AacMultipleWordsUpdatedForTheChild', updatedWords);
    return updatedWords;
  }

  async deleteAll() {
    await this.AacWordModel.remove({});
  }

  async addAll(words: AacWord[]): Promise<AacWord[]> {
    const wordsFromDb = await this.AacWordModel.insertMany(words);
    return wordsFromDb;
  }

  async resetAac(clientId: Types.ObjectId, user: User) {
    await this.AacWordModel.deleteMany({
      libraryType: LIBRARY_TYPES.CHILD,
      isDictionary: false,
      clientId: clientId,
      createdBy: user._id,
    });
    await this.aacFoldersService.removeClientFolders(clientId, user);
    const updatedUser = await this.cs.resetAacConfig(clientId);
    return updatedUser;
  }

  async addAacPngImages() {
    const total = await this.AacWordModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const words = await this.AacWordModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(words, async word => {
          await this.addAacPngImage(word);
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

  async addAacPngImage(word: AacWord) {
    if (word.visualAidType === AAC_VISUAL_AID_TYPES.IMAGE) {
      const ext = P.extname(word.visualAid);
      const fileName = this.getFileNameFormUrl(word.visualAid);
      if (ext === '.svg') {
        word.visualAidPng = this.getImgLink(fileName);
        const savedWord = await new this.AacWordModel(word).save();
        return savedWord;
      }
    }
  }

  getFileNameFormUrl = urlStr => {
    const url = new URL(urlStr);
    return P.basename(url.pathname).replace('.svg', '');
  };

  getImgLink(fileName: string): string {
    return `https://${this.bucket}.s3.amazonaws.com/aac/images/png/${fileName}.png`;
  }

  async getWordByUniqueKey(displayId: string) {
    const word = await this.AacWordModel.findOne({
      displayId,
    });
    return word;
  }

  async getChildAndTemplateSearchWords(
    search: string,
    clientId: Types.ObjectId,
    user: User,
  ) {
    const userWords = await this.getUserSearchWordsWithFolderDetail(
      search,
      user,
    );
    const userFolders = await this.aacFoldersService.getUserSearchFolder(
      search,
      user,
    );
    const template = { words: userWords, folders: userFolders };

    const childWords = await this.getChildSearchWordsWithFolderDetail(
      search,
      clientId,
    );
    const childFolders = await this.aacFoldersService.getChildSearchFolder(
      search,
      clientId,
      user,
    );
    const child = { words: childWords, folders: childFolders };

    return {
      template,
      child,
    };
  }
  async getUserSearchWordsWithFolderDetail(search: string, user: User) {
    const searchRegex = { $regex: new RegExp(search, 'i') };
    const matchCriteria = {
      libraryType: LIBRARY_TYPES.ADULT,
      $and: [
        { $or: [{ createdBy: user._id }, { createdBy: null }] },
        { $or: [{ text: searchRegex }, { label: searchRegex }] },
      ],
    };

    const folderLookup = {
      from: 'aacfolders',
      localField: 'folderId',
      foreignField: '_id',
      as: 'folder',
    };
    const words = await this.AacWordModel.aggregate([
      {
        $match: matchCriteria,
      },
      {
        $lookup: folderLookup,
      },
      {
        $unwind: { path: '$folder' },
      },
      {
        $set: {
          parentFolderName: '$folder.parentFolderName',
          subFolderName: '$folder.subFolderName',
        },
      },
      {
        $unset: ['folder'],
      },
      {
        $sort: { text: 1 },
      },
    ]);
    return words;
  }
  async getChildSearchWordsWithFolderDetail(
    search: string,
    clientId: Types.ObjectId,
  ) {
    const client = await this.cs.findById(clientId);
    if (!client) throw new NotFoundException(`client id ${clientId} not found`);

    const searchRegex = { $regex: new RegExp(search, 'i') };
    const matchCriteria = {
      libraryType: LIBRARY_TYPES.CHILD,
      clientId,
      $or: [{ text: searchRegex }, { label: searchRegex }],
    };

    const folderLookup = {
      from: 'aacfolders',
      localField: 'folderId',
      foreignField: '_id',
      as: 'folder',
    };

    const words = await this.AacWordModel.aggregate([
      {
        $match: matchCriteria,
      },
      {
        $lookup: folderLookup,
      },
      {
        $unwind: { path: '$folder' },
      },
      {
        $set: {
          parentFolderName: '$folder.parentFolderName',
          subFolderName: '$folder.subFolderName',
        },
      },
      {
        $unset: ['folder'],
      },
      {
        $sort: { text: 1 },
      },
    ]);
    return words;
  }
  async getAllWords(
    folderDisplayId: number,
    clientId: Types.ObjectId,
    user: User,
  ) {
    //get all parent folder words
    const parentFolderWords = await this.AacWordModel.find({
      folderDisplayId,
      libraryType: LIBRARY_TYPES.ADULT,
    }).lean();

    //get all child folder words
    const childFolderWords = await this.AacWordModel.find({
      folderDisplayId,
      libraryType: LIBRARY_TYPES.CHILD,
      clientId,
    }).lean();

    return {
      template: parentFolderWords,
      child: childFolderWords,
    };
  }

  async addList(
    addWordsDto: AddWordsDto,
    clientId: Types.ObjectId,
    user: User,
  ): Promise<AacWord[]> {
    const words: AacWord[] = await this.AacWordModel.find({
      _id: { $in: addWordsDto.words },
      libraryType: LIBRARY_TYPES.ADULT,
    }).lean();

    await this.addListChecks(words, clientId);

    const savedAacWords = await this.createFolderAndWords(
      user,
      clientId,
      words[0].folderId,
      words,
    );
    return savedAacWords;
  }
  async updateList(
    body: UpdateWordsDto,
    clientId: Types.ObjectId,
    user: User,
  ): Promise<AacWord[]> {
    const templateWords: AacWord[] = await this.AacWordModel.find({
      _id: { $in: body.templateWordsIds },
      libraryType: LIBRARY_TYPES.ADULT,
    }).lean();

    await this.updateListChecks(body, templateWords, clientId);

    const childFolderWords = await this.AacWordModel.find({
      folderId: body.childFolderId,
      libraryType: LIBRARY_TYPES.CHILD,
      isDictionary: false,
      clientId,
      createdBy: user._id,
    });
    if (childFolderWords.length > 0) {
      await this.deleteList({ words: childFolderWords }, clientId, user);
    }

    if (templateWords.length > 0) {
      const savedAacWords = await this.createFolderAndWords(
        user,
        clientId,
        templateWords[0].folderId,
        templateWords,
      );
      return savedAacWords;
    }
  }
  async addListChecks(words: AacWord[], clientId: Types.ObjectId) {
    if (!words || words.length == 0) {
      throw new BadRequestException(
        `Provided words list is not in the adult library`,
      );
    }

    const uniqueFolderIds = new Set(words.map(v => v.folderId.toString()));
    if (uniqueFolderIds.size > 1) {
      throw new BadRequestException(`Words must belong to same folder`);
    }

    const displayIds = words.map(v => v.displayId);
    const childWords = await this.AacWordModel.find({
      libraryType: LIBRARY_TYPES.CHILD,
      clientId,
      displayId: { $in: displayIds },
    });
    if (childWords.length > 0) {
      throw new BadRequestException(
        `Words with the same displayId already exist in the child library`,
      );
    }
  }
  async updateListChecks(
    body: UpdateWordsDto,
    templateWords: AacWord[],
    clientId,
  ) {
    if (templateWords.length < body.templateWordsIds.length) {
      throw new BadRequestException(
        `Some words in the template list do not exist in the adult library`,
      );
    }

    const uniqueFolderIds = new Set(
      templateWords.map(v => v.folderId.toString()),
    );
    if (uniqueFolderIds.size > 1) {
      throw new BadRequestException(`Words must belong to same folder`);
    }

    try {
      const childFolder = await this.aacFoldersService.findOne({
        _id: body.childFolderId,
        libraryType: LIBRARY_TYPES.CHILD,
        clientId,
      });
    } catch (error) {
      throw new BadRequestException(
        `Child folder:${body.childFolderId} does not exist for the client:${clientId}`,
      );
    }
  }
  async deleteListChecks(words: AacWord[], clientId: Types.ObjectId) {
    if (!words || words.length == 0) {
      throw new BadRequestException(`No word qualified for deletion`);
    }

    const uniqueFolderIds = new Set(words.map(v => v.folderId.toString()));
    if (uniqueFolderIds.size > 1) {
      throw new BadRequestException(`Words must belong to same folder`);
    }
  }
  async copyWord(data: CopyWord, clientId: Types.ObjectId, user: User) {
    const wordId: Types.ObjectId = data.wordId;
    const folderId: Types.ObjectId = data.folderId;

    const folder = await this.aacFoldersService.isChildFolder(
      clientId,
      folderId,
    );
    const word = await this.AacWordModel.findById(wordId).lean();
    if (!word) throw new NotFoundException(`word id ${wordId} not found`);

    //veriy if copy is permissible
    const isWordInFolder = await this.AacWordModel.findOne({
      folderId,
      displayId: word.displayId,
      libraryType: LIBRARY_TYPES.CHILD,
      clientId,
    });
    if (isWordInFolder) {
      throw new BadRequestException(
        `Word with displayId: ${word.displayId} is already in the folder with id: ${folderId}`,
      );
    }
    const hasSubFolders = await this.aacFoldersService.hasSubFolders(
      folder.folderId,
      clientId,
    );
    if (hasSubFolders) {
      throw new BadRequestException(
        `Folder with parentFolderId ${folder.parentFolderId} has subfolders for the client ${clientId}`,
      );
    }

    //copy word to folder
    const newWord = omit(
      {
        ...word,
        createdBy: user._id,
        libraryType: LIBRARY_TYPES.CHILD,
        isDictionary: false,
        folderId: folder._id,
        clientId,
        folderDisplayId: folder.folderId,
        parentFolderDisplayId: folder.parentFolderId,
      },
      '_id',
      'createdAt',
      'updatedAt',
    );
    const aacWord = new this.AacWordModel(newWord);
    const savedAacWord = await aacWord.save();
    this.aacFoldersService.updateWordsQty(
      savedAacWord.folderId,
      user,
      clientId,
    );
    this.emitter.emit('AacWordAddedForTheChild', savedAacWord);
    return savedAacWord;
  }

  async getFolders(displayId: string, clientId: Types.ObjectId, user: User) {
    //get folderIds that are associated with the word
    const folderIds = await this.AacWordModel.find({
      displayId,
      libraryType: LIBRARY_TYPES.CHILD,
      clientId,
    }).distinct('folderId');

    //get folders details
    const folders = await this.aacFoldersService.getFolders(folderIds);

    return folders;
  }

  async removeFromFolder(
    clientId: Types.ObjectId,
    folderId: Types.ObjectId,
    wordDisplayId: string,
    user: User,
  ): Promise<void> {
    //get word that belongs to the given folder
    const wordInFolder = await this.AacWordModel.findOne({
      displayId: wordDisplayId,
      libraryType: LIBRARY_TYPES.CHILD,
      clientId,
      folderId,
    }).lean();
    if (!wordInFolder) {
      throw new BadRequestException(
        `Word with displayId: ${wordDisplayId} is not in the folder with id: ${folderId} for the client ${clientId}`,
      );
    }

    return await this.deleteById(wordInFolder._id, user);
  }

  async getTemplateWordsByDeviceId(deviceId: Types.ObjectId) {
    const client = await this.cs.getClientByDevice(deviceId);
    if (!client)
      throw new BadRequestException('Child not connected to that device');
    const words = await this.AacWordModel.find({
      isDictionary: true,
      clientId: null,
      createdBy: null,
      $and: [{ gridPosition: { $exists: true } }, { gridPosition: { $gt: 0 } }],
      libraryType: LIBRARY_TYPES.ADULT,
    }).sort({ gridPosition: 1 });

    return words;
  }
}
