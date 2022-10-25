import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as BB from 'bluebird';
import { omit, uniqBy } from 'lodash';
import { Model, Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import { EnvironmentVariables } from 'src/config';
import { ClientsService } from 'src/entities/clients/clients.service';
import { User } from 'src/entities/users/schema';
import { LIBRARY_TYPES } from 'src/shared/const';
import { AAC_FOLDER_TYPES } from 'src/shared/const/aac-folders';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { AacWord } from '../aac-words/schema/aac-word.schema';
import { CreateFolder } from './dto/CreateFolder';
import { UpdateFolder } from './dto/UpdateFolder';
import { AacFolder } from './schema/aac-folder.schema';

@Injectable()
export class AacFoldersService {
  bucket: string;

  constructor(
    @InjectModel(AacWord.name) private AacWordModel: Model<AacWord>,
    @InjectModel(AacFolder.name) private AacFolderModel: Model<AacFolder>,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private cs: ClientsService,
    private config: ConfigService<EnvironmentVariables>,
  ) {
    this.bucket = this.config.get('AWS_BUCKET');
  }

  async create(folderData: CreateFolder, user: User): Promise<AacFolder> {
    const folder = new this.AacFolderModel(folderData);

    // if (folder.type == AAC_FOLDER_TYPES.FOLDER) {
    folder.parentFolderName = folderData.name;
    folder.subFolderName = '';
    folder.subFolderId = 0;
    folder.imgUrl = folderData.imgUrl;
    folder.type = AAC_FOLDER_TYPES.FOLDER;

    const highestFolder = await this.getHighestParentFolderId();

    folder.parentFolderId = highestFolder.parentFolderId + 1;
    folder.folderId = folder.parentFolderId;

    const highestPosition = await this.getHighestFolderGridPositioning(user);
    if (highestPosition) folder.gridPosition = highestPosition.gridPosition + 1;
    else folder.gridPosition = 18;
    // } else {
    //   const parentFolder = await this.getById(folderData.folderId);
    //   folder.parentFolderName = parentFolder.parentFolderName;
    //   folder.subFolderName = folderData.name;

    //   const highestFolder = await this.getHighestSubFolderId();
    //   folder.subFolderId = highestFolder.subFolderId + 1;
    //   folder.parentFolderId = parentFolder.parentFolderId;
    //   folder.folderId = parentFolder.parentFolderId + parentFolder.folderId;

    //   const highestPosition = await this.getHighestSubFolderGridPositioning(
    //     user,
    //   );
    //   if (highestPosition)
    //     folder.gridPosition = highestPosition.gridPosition % 2 == 0 ? 7 : 1;
    //   else folder.gridPosition = 26;
    // }

    folder.libraryType = LIBRARY_TYPES.ADULT;
    folder.isDictionary = false;
    folder.createdBy = user._id;
    folder.hasSubFolders = false;

    const savedfolder = await folder.save();
    this.emitter.emit('AacFolderCreated', savedfolder);
    return savedfolder;
  }

  async getHighestParentFolderId(): Promise<AacFolder> {
    const folder = await this.AacFolderModel.findOne()
      .sort({ parentFolderId: -1 })
      .limit(1);
    return folder;
  }

  async getHighestSubFolderId(): Promise<AacFolder> {
    const folder = await this.AacFolderModel.findOne()
      .sort({ subFolderId: -1 })
      .limit(1);
    return folder;
  }

  async getHighestFolderGridPositioning(user): Promise<AacFolder> {
    const folder = await this.AacFolderModel.findOne({
      createdBy: user._id,
      type: AAC_FOLDER_TYPES.FOLDER,
    })
      .sort({ gridPosition: -1 })
      .limit(1);
    return folder;
  }

  async getHighestSubFolderGridPositioning(user): Promise<AacFolder> {
    const folder = await this.AacFolderModel.findOne({
      createdBy: user._id,
      type: AAC_FOLDER_TYPES.SUBFOLDER,
    })
      .sort({ gridPosition: -1 })
      .limit(1);
    return folder;
  }

  async findById(folderId): Promise<AacFolder> {
    const folder = await this.AacFolderModel.findById(folderId);
    if (!folder)
      throw new BadRequestException(
        `folder with id ${folderId} does not exists`,
      );
    return folder;
  }

  async findOne(object): Promise<AacFolder> {
    const folder = await this.AacFolderModel.findOne(object);
    if (!folder)
      throw new BadRequestException(
        `folder with specified ${object} does not exists`,
      );
    return folder;
  }

  async update(
    folderData: UpdateFolder,
    folderId: Types.ObjectId,
    user: User,
  ): Promise<AacFolder> {
    const folder = await this.findById(folderId);
    if (!folder)
      throw new BadRequestException(
        `folder with id ${folderId} does not exists`,
      );
    if (folder.isDictionary)
      throw new NotFoundException(`Dictionary folders are not allowed to edit`);

    const savedFolder = await this.AacFolderModel.findByIdAndUpdate(
      folderId,
      { parentFolderName: folderData.name, imgUrl: folderData.imgUrl },
      { new: true },
    );
    this.emitter.emit('AacFolderUpdated', savedFolder);
    return savedFolder;
  }

  async deleteById(folderId: Types.ObjectId, user: User): Promise<void> {
    const folder = await this.findById(folderId);
    if (!folder)
      throw new NotFoundException(`Folder with id ${folderId} not found`);
    if (folder.isDictionary)
      throw new NotFoundException(
        `Dictionary folders are not allowed to delete`,
      );
    await folder.remove();
    this.emitter.emit('AacFolderDeleted', folder);

    //delete inside folder words
    const deletedFolderWords = await this.AacWordModel.deleteMany({
      folderId: folder._id,
      createdBy: user._id,
    });

    if (folder.clientId) {
      //get client sub folder from folder
      const subFolders = await this.getClientSubFolders(
        folder.folderId,
        folder.clientId,
      );
      if (subFolders && subFolders.length > 0) {
        await BB.map(subFolders, async subFolder => {
          //delete inside subfolders words
          const deletedSubFoldersWords = await this.AacWordModel.deleteMany({
            folderId: subFolder._id,
            createdBy: user._id,
          });
          await subFolder.remove();
        });
      }
    }

    this.updateWordsQty(folderId, user, folder.clientId);
  }

  async getClientSubFolders(clientFolderId, clientId) {
    const subFolders = await this.AacFolderModel.find({
      parentFolderId: clientFolderId,
      isDictionary: false,
      clientId,
      type: AAC_FOLDER_TYPES.SUBFOLDER,
      libraryType: LIBRARY_TYPES.CHILD,
    });
    return subFolders;
  }

  async createForChild(
    user: User,
    clientId: Types.ObjectId,
    folderId: Types.ObjectId,
  ) {
    const folder = await this.AacFolderModel.findOne({
      _id: folderId,
      libraryType: LIBRARY_TYPES.ADULT,
    }).lean();
    if (!folder)
      throw new NotFoundException(
        `folder with ${folderId} not found in dictionary`,
      );

    if (folder.type == AAC_FOLDER_TYPES.SUBFOLDER) {
      await this.createSubFolderForChild(user, clientId, folderId);
    } else if (folder.type == AAC_FOLDER_TYPES.FOLDER) {
      const subFolders = await this.AacFolderModel.find({
        parentFolderId: folder.folderId,
        type: AAC_FOLDER_TYPES.SUBFOLDER,
        libraryType: LIBRARY_TYPES.ADULT,
      });

      if (!subFolders || subFolders.length == 0) {
        //folder has root level words
        let parentFolder = await this.AacFolderModel.findOne({
          folderId: folder.parentFolderId,
          isDictionary: false,
          type: AAC_FOLDER_TYPES.FOLDER,
          clientId,
          libraryType: LIBRARY_TYPES.CHILD,
          createdBy: user._id,
        });
        if (!parentFolder) {
          parentFolder = await this.AacFolderModel.findOne({
            folderId: folder.parentFolderId,
            type: AAC_FOLDER_TYPES.FOLDER,
            libraryType: LIBRARY_TYPES.ADULT,
          }).lean();

          const newParentFolder = omit(
            {
              ...parentFolder,
              createdBy: user._id,
              libraryType: LIBRARY_TYPES.CHILD,
              isDictionary: false,
              clientId: clientId,
            },
            '_id',
            'createdAt',
            'updatedAt',
          );
          const aacParentFolder = new this.AacFolderModel(newParentFolder);
          const savedAacParentFolder = await aacParentFolder.save();
        }
      } else {
        const savedSubFolders = await BB.map(subFolders, async subFolder => {
          return await this.createSubFolderForChild(
            user,
            subFolder.clientId,
            subFolder._id,
          );
        });
      }
    }
  }

  async createGroupingFolder(user: User, clientId: Types.ObjectId, folderIds) {
    const folders = BB.map(folderIds, async folderId => {
      const parentFolder = await this.AacFolderModel.findOne({
        _id: folderId,
        libraryType: LIBRARY_TYPES.ADULT,
      }).lean();

      const deletedFolders = await this.AacFolderModel.deleteMany({
        libraryType: LIBRARY_TYPES.CHILD,
        isDictionary: false,
        clientId: clientId,
        folderId: parentFolder.folderId,
        createdBy: user._id,
      });

      const newParentFolder = omit(
        {
          ...parentFolder,
          createdBy: user._id,
          libraryType: LIBRARY_TYPES.CHILD,
          isDictionary: false,
          clientId: clientId,
        },
        '_id',
        'createdAt',
        'updatedAt',
      );
      const aacParentFolder = new this.AacFolderModel(newParentFolder);
      const savedAacParentFolder = await aacParentFolder.save();
      return savedAacParentFolder;
    });

    const parentFolders = await BB.map(folders, async subFolder => {
      if (subFolder.type == AAC_FOLDER_TYPES.SUBFOLDER) {
        const parentSubFolder = await this.checkIfFolderExists(
          subFolder,
          clientId,
          user,
        );
        if (!parentSubFolder) {
          const parentSubFolder = await this.createParentFolder(
            subFolder,
            clientId,
            user,
          );
          return parentSubFolder;
        }
        return null;
      }
    });

    if (parentFolders && parentFolders.length > 0) {
      const foldersToSave = parentFolders.filter(
        folder => folder !== null && folder !== undefined,
      );
      const savedAac = await this.AacFolderModel.insertMany(
        uniqBy(foldersToSave, 'parentFolderId'),
      );
    }
    return folders;
  }

  async checkIfFolderExists(subFolder, clientId, user) {
    const parentSubFolder = await this.AacFolderModel.findOne({
      folderId: subFolder.parentFolderId,
      isDictionary: false,
      type: AAC_FOLDER_TYPES.FOLDER,
      clientId,
      libraryType: LIBRARY_TYPES.CHILD,
      createdBy: user._id,
    });

    return parentSubFolder;
  }
  async createParentFolder(subFolder, clientId, user) {
    const parentSubFolder = await this.AacFolderModel.findOne({
      folderId: subFolder.parentFolderId,
      type: AAC_FOLDER_TYPES.FOLDER,
      libraryType: LIBRARY_TYPES.ADULT,
    }).lean();
    const newParentFolder = omit(
      {
        ...parentSubFolder,
        createdBy: user._id,
        libraryType: LIBRARY_TYPES.CHILD,
        isDictionary: false,
        clientId,
      },
      '_id',
      'createdAt',
      'updatedAt',
    );
    const aacParentFolder = new this.AacFolderModel(newParentFolder);
    return aacParentFolder;
  }

  async getFolderForChild(
    user: User,
    clientId: Types.ObjectId,
    folderId: Types.ObjectId,
  ): Promise<AacFolder> {
    const parentFolder = await this.AacFolderModel.findById(folderId);
    const childFolder = await this.AacFolderModel.findOne({
      isDictionary: false,
      libraryType: LIBRARY_TYPES.CHILD,
      folderId: parentFolder.folderId,
      clientId,
      createdBy: user._id,
    });
    return childFolder;
  }

  async getSubFoldersForChild(
    user: User,
    clientId: Types.ObjectId,
    folderId: Types.ObjectId,
  ): Promise<AacFolder[]> {
    const childFolder = await this.AacFolderModel.findById(folderId);
    const childFolders = await this.AacFolderModel.find({
      isDictionary: false,
      libraryType: LIBRARY_TYPES.CHILD,
      parentFolderId: childFolder.folderId,
      clientId,
      createdBy: user._id,
    });
    return childFolders;
  }

  async getSubFoldersForChildWithType(
    user: User,
    clientId: Types.ObjectId,
    folderId: Types.ObjectId,
  ): Promise<AacFolder[]> {
    const childFolder = await this.AacFolderModel.findById(folderId);
    const childFolders = await this.AacFolderModel.find({
      isDictionary: false,
      libraryType: LIBRARY_TYPES.CHILD,
      parentFolderId: childFolder.folderId,
      clientId,
      createdBy: user._id,
      type: AAC_FOLDER_TYPES.SUBFOLDER,
    });
    return childFolders;
  }

  async createSubFolderForChild(user: User, clientId, subFolderId) {
    const subFolder = await this.AacFolderModel.findOne({
      _id: subFolderId,
      libraryType: LIBRARY_TYPES.ADULT,
      type: AAC_FOLDER_TYPES.SUBFOLDER,
    }).lean();
    if (!subFolder)
      throw new NotFoundException(
        `sub folder with ${subFolderId} not found in user library`,
      );
    //check if client folder already exists
    const clientFolder = await this.AacFolderModel.findOne({
      folderId: subFolder.folderId,
      isDictionary: false,
      type: AAC_FOLDER_TYPES.SUBFOLDER,
      clientId: clientId,
      libraryType: LIBRARY_TYPES.CHILD,
      createdBy: user._id,
    });
    if (clientFolder) return clientFolder;
    const newSubFolder = omit(
      {
        ...subFolder,
        createdBy: user._id,
        libraryType: LIBRARY_TYPES.CHILD,
        isDictionary: false,
        clientId: clientId,
      },
      '_id',
      'createdAt',
      'updatedAt',
    );
    const aacSubFolder = new this.AacFolderModel(newSubFolder);
    const savedAacSubFolder = await aacSubFolder.save();
    return savedAacSubFolder;
  }

  async createParentFolderFromUserFolder(userFolder, clientId, user) {
    // check if folder type is subFolder then add parentFolder too
    const parentFolder = await this.AacFolderModel.findOne({
      folderId: userFolder.folderId,
      isDictionary: false,
      type: AAC_FOLDER_TYPES.FOLDER,
      clientId,
      libraryType: LIBRARY_TYPES.CHILD,
      createdBy: user._id,
    }).lean();
    if (!parentFolder) {
      const newParentFolder = omit(
        {
          ...userFolder,
          createdBy: user._id,
          libraryType: LIBRARY_TYPES.CHILD,
          isDictionary: false,
          clientId,
        },
        '_id',
        'createdAt',
        'updatedAt',
      );
      const aacParentFolder = new this.AacFolderModel(newParentFolder);
      const savedAacParentFolder = await aacParentFolder.save();
    }
  }

  async createParentFolderFromSubFolder(subFolderId, clientId, user) {
    const subFolder = await this.AacFolderModel.findOne({
      _id: subFolderId,
      libraryType: LIBRARY_TYPES.ADULT,
    });
    if (!subFolder) {
      throw new BadRequestException(
        `sub folder id ${subFolderId} does not exists`,
      );
    }
    if (subFolder.type == AAC_FOLDER_TYPES.SUBFOLDER) {
      // check if folder type is subFolder then add parentFolder too
      let parentFolder = await this.AacFolderModel.findOne({
        folderId: subFolder.parentFolderId,
        isDictionary: false,
        type: AAC_FOLDER_TYPES.FOLDER,
        clientId,
        libraryType: LIBRARY_TYPES.CHILD,
        createdBy: user._id,
      }).lean();
      if (!parentFolder) {
        parentFolder = await this.AacFolderModel.findOne({
          folderId: subFolder.parentFolderId,
          type: AAC_FOLDER_TYPES.FOLDER,
          libraryType: LIBRARY_TYPES.ADULT,
        }).lean();

        const newParentFolder = omit(
          {
            ...parentFolder,
            createdBy: user._id,
            libraryType: LIBRARY_TYPES.CHILD,
            isDictionary: false,
            clientId,
          },
          '_id',
          'createdAt',
          'updatedAt',
        );
        const aacParentFolder = new this.AacFolderModel(newParentFolder);
        const savedAacParentFolder = await aacParentFolder.save();
      }
    }
  }
  async getSubFoldersOfFolder(
    folderId: Types.ObjectId,
    clientId,
    user,
    isCreateParentFolder = true,
  ) {
    const parentFolder = await this.AacFolderModel.findOne({
      _id: folderId,
      libraryType: LIBRARY_TYPES.ADULT,
    }).lean();
    if (!parentFolder) {
      throw new BadRequestException(
        `folder id ${folderId} does not exists in dictionary`,
      );
    }
    //create parent folder
    if (isCreateParentFolder)
      await this.createParentFolderFromUserFolder(parentFolder, clientId, user);

    //get user sub folder for user folder
    const subFolders = await this.AacFolderModel.find({
      parentFolderId: parentFolder.folderId,
      type: AAC_FOLDER_TYPES.SUBFOLDER,
      libraryType: LIBRARY_TYPES.ADULT,
    });
    return subFolders;
  }

  async getUserFolders(user: User) {
    const folders = await this.AacFolderModel.aggregate([
      {
        $match: {
          libraryType: LIBRARY_TYPES.ADULT,
          $or: [{ createdBy: user._id }, { createdBy: null }],
        },
      },
      {
        $project: {
          _id: 1,
          parentFolderName: 1,
          subFolderName: 1,
          gridPosition: 1,
          folderId: 1,
          parentFolderId: 1,
          subFolderId: 1,
          type: 1,
          clientId: 1,
          isDictionary: 1,
          createdBy: 1,
          createdAt: 1,
          updatedAt: 1,
          imgUrl: 1,
          insensitive: { $toLower: '$parentFolderName' },
        },
      },
      { $sort: { insensitive: 1 } },
      { $limit: 1000 },
    ]);
    return folders;
  }

  async getChildFolders(clientId: Types.ObjectId, user: User) {
    const childFolders = await this.AacFolderModel.aggregate([
      {
        $match: {
          clientId,
          isDictionary: false,
        },
      },
      {
        $project: {
          _id: 1,
          parentFolderName: 1,
          subFolderName: 1,
          gridPosition: 1,
          folderId: 1,
          parentFolderId: 1,
          subFolderId: 1,
          type: 1,
          clientId: 1,
          isDictionary: 1,
          createdBy: 1,
          createdAt: 1,
          updatedAt: 1,
          imgUrl: 1,
          userFolderCount: 1,
          userSubFolderCount: 1,
          clientCount: 1,
          insensitive: { $toLower: '$parentFolderName' },
        },
      },
      { $sort: { insensitive: 1 } },
      { $limit: 1000 },
    ]);

    childFolders.forEach(childFolder => {
      if (childFolder.type == AAC_FOLDER_TYPES.FOLDER) {
        //if folder type is folder then it does not have userSubFolderCount, userFolderCount and clientCount
        //so we need to get it from its sub folders
        if (!childFolder.userCount) childFolder.userCount = 0;
        if (!childFolder.clientCount) childFolder.clientCount = 0;

        let isSubFolderExists = false;
        childFolders.forEach(folder => {
          if (
            //identifying the sub folders
            folder.parentFolderId == childFolder.parentFolderId &&
            folder.type == AAC_FOLDER_TYPES.SUBFOLDER
          ) {
            isSubFolderExists = true;
            childFolder.userCount = folder.userFolderCount;
            childFolder.clientCount += folder.clientCount; //adding client count of sub folders to parent folder
          }
        });

        //if folder does not have sub folders, then it means it has the required values itself
        if (!isSubFolderExists) {
          childFolder.userCount = childFolder.userFolderCount;
          childFolder.clientCount = childFolder.clientCount;
        }
      } else {
        childFolder.userCount = childFolder.userSubFolderCount;
      }
    });
    console.log(childFolders);
    return childFolders;
  }
  async getUserSearchFolder(search: string, user: User) {
    const arrFilter = [];
    arrFilter.push({ $or: [{ createdBy: user._id }, { createdBy: null }] });
    const objFilter = { libraryType: LIBRARY_TYPES.ADULT };

    if (search) {
      const searchRegex = { $regex: new RegExp(search, 'i') };
      arrFilter.push({
        $or: [
          { parentFolderName: searchRegex },
          { subFolderName: searchRegex },
        ],
      });
    }
    Object.assign(objFilter, { $and: arrFilter });

    const folders = await this.AacFolderModel.find(objFilter).sort(
      'parentFolderName',
    );

    return folders;
  }

  async searchUserFoldersToAddWords(search: string, user: User) {
    const arrFilter = [];
    arrFilter.push({ $or: [{ createdBy: user._id }, { createdBy: null }] });
    const objFilter = { libraryType: LIBRARY_TYPES.ADULT };

    if (search) {
      const searchRegex = { $regex: new RegExp(search, 'i') };
      arrFilter.push({
        $or: [
          { parentFolderName: searchRegex },
          { subFolderName: searchRegex },
        ],
      });
    }
    const folderIds = await this.AacWordModel.find({
      libraryType: LIBRARY_TYPES.ADULT,
    })
      .distinct('folderId')
      .lean();

    arrFilter.push({
      $or: [{ _id: { $in: folderIds } }, { createdBy: user._id }],
    });

    Object.assign(objFilter, { $and: arrFilter });
    console.log(objFilter);
    const folders = await this.AacFolderModel.find(objFilter).sort(
      'parentFolderName',
    );
    return folders;
  }

  async searchChildFoldersToAddWords(
    clientId: Types.ObjectId,
    search: string,
    user: User,
  ) {
    const arrFilter = [];
    const objFilter = {
      libraryType: LIBRARY_TYPES.CHILD,
      clientId,
      createdBy: user._id,
    };

    if (search) {
      const searchRegex = { $regex: new RegExp(search, 'i') };
      arrFilter.push({
        $or: [
          { parentFolderName: searchRegex },
          { subFolderName: searchRegex },
        ],
      });
      Object.assign(objFilter, { $and: arrFilter });
    }
    const folderIds = await this.AacWordModel.find({
      libraryType: LIBRARY_TYPES.CHILD,
      clientId,
      createdBy: user._id,
      isDictionary: false,
    })
      .distinct('folderId')
      .lean();

    Object.assign(objFilter, { _id: { $in: folderIds } });

    const folders = await this.AacFolderModel.find(objFilter).sort(
      'parentFolderName',
    );
    return folders;
  }

  async getChildSearchFolder(
    search: string,
    clientId: Types.ObjectId,
    user: User,
  ) {
    const objFilter = { libraryType: LIBRARY_TYPES.CHILD, clientId };
    if (search) {
      const searchRegex = { $regex: new RegExp(search, 'i') };
      Object.assign(objFilter, {
        $or: [
          {
            $and: [
              { subFolderName: searchRegex },
              { type: AAC_FOLDER_TYPES.SUBFOLDER },
            ],
          },
          {
            $and: [
              { parentFolderName: searchRegex },
              { type: AAC_FOLDER_TYPES.FOLDER },
            ],
          },
        ],
      });
    }
    console.log(objFilter);
    const folders = await this.AacFolderModel.find(objFilter).sort(
      'parentFolderName',
    );
    return folders;
  }

  async getClientFoldersByDeviceId(deviceId: Types.ObjectId) {
    const client = await this.cs.getClientByDevice(deviceId);
    if (!client)
      throw new BadRequestException('Child not connected to that device');
    const folders = await this.AacFolderModel.find({
      clientId: client._id,
    }).lean();
    const folderDisplayIds = await this.AacWordModel.find({
      libraryType: LIBRARY_TYPES.CHILD,
      clientId: client._id,
    }).distinct('folderDisplayId');
    const parentFolderDisplayIds = await this.AacWordModel.find({
      libraryType: LIBRARY_TYPES.CHILD,
      clientId: client._id,
    }).distinct('parentFolderDisplayId');
    const adminFolders = await this.AacFolderModel.find({
      libraryType: LIBRARY_TYPES.ADULT,
      isDictionary: true,
      $and: [
        { folderId: { $nin: folderDisplayIds } },
        { folderId: { $nin: parentFolderDisplayIds } },
      ],
    }).lean();
    //to sync app data and prevent migration
    adminFolders.forEach(folder => {
      folder.clientId = client._id;
      folder.createdBy = client._id;
    });
    return folders.concat(adminFolders);
  }
  async getClientFolderByDeviceIdAndId(
    deviceId: Types.ObjectId,
    folderId: Types.ObjectId,
  ) {
    const client = await this.cs.getClientByDevice(deviceId);
    if (!client)
      throw new BadRequestException('Child not connected to that device');

    const folder = await this.findById(folderId);
    if (!folder)
      throw new NotFoundException(
        `folder with id ${folderId}  doest not exist for the device with id ${deviceId}`,
      );
    return folder;
  }

  async getUserFolderIcons(folderId: Types.ObjectId, user: User) {
    const folderIcons = await this.AacWordModel.find({
      folderId,
    })
      .limit(4)
      .sort('text');
    return folderIcons;
  }

  async getUserFolderIconsV2(
    clientId: Types.ObjectId,
    folderId: number,
    user: User,
  ) {
    const folderIcons = await this.AacWordModel.find({
      $and: [
        {
          $or: [
            { parentFolderDisplayId: folderId },
            { folderDisplayId: folderId },
          ],
        },
        { clientId },
      ],
    })
      .limit(4)
      .sort('text');
    return folderIcons;
  }

  async deleteAll() {
    await this.AacFolderModel.remove({});
  }

  async addAll(folders: AacFolder[]): Promise<AacFolder[]> {
    const foldersFromDb = await this.AacFolderModel.insertMany(folders);
    return foldersFromDb;
  }

  async getFolderByDisplayId(folderDisplayId: number): Promise<AacFolder> {
    const folderFromDb = await this.AacFolderModel.findOne({
      folderId: folderDisplayId,
    });
    return folderFromDb;
  }

  async getAllFolders(): Promise<AacFolder[]> {
    const folderFromDb = await this.AacFolderModel.find({});
    return folderFromDb;
  }

  async removeClientFolders(clientId: Types.ObjectId, user) {
    //remove existing folders
    const deletedFolders = await this.AacFolderModel.deleteMany({
      libraryType: LIBRARY_TYPES.CHILD,
      isDictionary: false,
      clientId,
      createdBy: user._id,
    });
    return deletedFolders;
  }

  async getFolderCount(
    clientId: Types.ObjectId,
    folderId: Types.ObjectId,
    user: User,
  ) {
    const parentFolder = await this.AacFolderModel.findOne({
      _id: folderId,
      libraryType: LIBRARY_TYPES.ADULT,
    });
    if (!parentFolder) {
      throw new BadRequestException(
        `folder id ${folderId} does not exists in dictionary`,
      );
    }

    if (parentFolder.type == AAC_FOLDER_TYPES.FOLDER) {
      const existingChildCount = await this.AacWordModel.count({
        parentFolderDisplayId: parentFolder.parentFolderId,
        clientId,
        libraryType: LIBRARY_TYPES.CHILD,
        createdBy: user._id,
      });
      const existingParentCount = await this.AacWordModel.count({
        parentFolderDisplayId: parentFolder.parentFolderId,
        $or: [{ createdBy: null }, { createdBy: user._id }],
        libraryType: LIBRARY_TYPES.ADULT,
      });
      return { count: existingParentCount - existingChildCount };
    } else {
      const existingChildCount = await this.AacWordModel.count({
        folderDisplayId: parentFolder.folderId,
        clientId,
        libraryType: LIBRARY_TYPES.CHILD,
        createdBy: user._id,
      });
      const existingParentCount = await this.AacWordModel.count({
        folderDisplayId: parentFolder.folderId,
        $or: [{ createdBy: null }, { createdBy: user._id }],
        libraryType: LIBRARY_TYPES.ADULT,
      });
      return { count: existingParentCount - existingChildCount };
    }
  }

  async getAdminFolders() {
    const folders = await this.AacFolderModel.find({
      libraryType: LIBRARY_TYPES.ADULT,
      isDictionary: true,
      type: AAC_FOLDER_TYPES.FOLDER,
    });
    return folders;
  }

  async updateWordsQty(
    folderId: Types.ObjectId,
    user: User,
    clientId?: Types.ObjectId,
  ) {
    if (!clientId) {
      await BB.map(user.clients as Types.ObjectId[], async clientId => {
        const folderFromDb = await this.AacFolderModel.findById(folderId);
        //find child folder from parent folder
        const folder = await this.AacFolderModel.findOne({
          clientId,
          folderId: folderFromDb.folderId,
          parentFolderId: folderFromDb.parentFolderId,
          libraryType: LIBRARY_TYPES.CHILD,
        });
        //second client does not have this folder
        if (folder && clientId) {
          this.updateWordsQty(folder._id, user, clientId);
        }
      });
    } else {
      const count = await this.getChildFolderCount(clientId, folderId, user);
      await this.AacFolderModel.findByIdAndUpdate(
        folderId,
        {
          userFolderCount: count.existingParentFolderCount,
          userSubFolderCount: count.existingParentSubFolderCount,
          clientCount: count.existingChildCount,
        },
        { new: true },
      );
    }
  }

  async getChildFolderCount(
    clientId: Types.ObjectId,
    folderId: Types.ObjectId,
    user: User,
  ) {
    const parentFolder = await this.AacFolderModel.findOne({
      _id: folderId,
      libraryType: LIBRARY_TYPES.CHILD,
    });
    if (!parentFolder) {
      throw new BadRequestException(
        `folder id ${folderId} does not exists in child dictionary`,
      );
    }

    if (parentFolder.type == AAC_FOLDER_TYPES.FOLDER) {
      const existingChildCount = await this.AacWordModel.count({
        parentFolderDisplayId: parentFolder.parentFolderId,
        clientId,
        libraryType: LIBRARY_TYPES.CHILD,
        createdBy: user._id,
      });
      const existingParentFolderCount = await this.AacWordModel.count({
        parentFolderDisplayId: parentFolder.parentFolderId,
        $or: [{ createdBy: null }, { createdBy: user._id }],
        libraryType: LIBRARY_TYPES.ADULT,
      });
      return { existingParentFolderCount, existingChildCount };
    } else {
      const existingChildCount = await this.AacWordModel.count({
        folderDisplayId: parentFolder.folderId,
        clientId,
        libraryType: LIBRARY_TYPES.CHILD,
        createdBy: user._id,
      });
      const existingParentSubFolderCount = await this.AacWordModel.count({
        folderDisplayId: parentFolder.folderId,
        $or: [{ createdBy: null }, { createdBy: user._id }],
        libraryType: LIBRARY_TYPES.ADULT,
      });
      const existingParentFolderCount = await this.AacWordModel.count({
        parentFolderDisplayId: parentFolder.parentFolderId,
        $or: [{ createdBy: null }, { createdBy: user._id }],
        libraryType: LIBRARY_TYPES.ADULT,
      });
      return {
        existingParentFolderCount,
        existingParentSubFolderCount,
        existingChildCount,
      };
    }
  }
  //check if folder exists for the client
  async isChildFolder(clientId: Types.ObjectId, folderId: Types.ObjectId) {
    const folder = await this.AacFolderModel.findOne({
      _id: folderId,
      clientId,
      libraryType: LIBRARY_TYPES.CHILD,
    });
    if (!folder) {
      throw new BadRequestException(
        `folder id ${folderId} does not exists for the client id ${clientId}`,
      );
    }
    return folder;
  }

  async hasSubFolders(folderId: number, clientId: Types.ObjectId) {
    const subFolders = await this.AacFolderModel.count({
      parentFolderId: folderId,
      type: AAC_FOLDER_TYPES.SUBFOLDER,
      libraryType: LIBRARY_TYPES.CHILD,
      clientId,
    });
    if (subFolders > 0) {
      return true;
    }
    return false;
  }
  async getFolders(folderIds: Types.ObjectId[]) {
    const folders = await this.AacFolderModel.find({
      _id: { $in: folderIds },
    });
    return folders;
  }
  async searchChildFolders(
    search: string,
    clientId: Types.ObjectId,
    displayId: string,
    user: User,
  ) {
    //get folderIds that are associated with the word
    const linkedFolderIds = await this.AacWordModel.find({
      displayId,
      libraryType: LIBRARY_TYPES.CHILD,
      clientId,
    }).distinct('folderId');

    const searchRegex = { $regex: new RegExp(search, 'i') };

    //get all child folders that are not associated with the word
    const linkableFoldersList = await this.AacFolderModel.find({
      libraryType: LIBRARY_TYPES.CHILD,
      clientId,
      hasSubFolders: false,
      _id: { $nin: linkedFolderIds },
      $or: [{ parentFolderName: searchRegex }, { subFolderName: searchRegex }],
    }).lean();

    return linkableFoldersList;
  }

  async addHasSubFoldersField() {
    //as per current implementation: FOLDERS may have further sub folders
    const parentFolderIds = await this.AacFolderModel.find({
      type: AAC_FOLDER_TYPES.FOLDER,
    })
      .distinct('folderId')
      .lean();
    await BB.map(parentFolderIds, async parentFolderId => {
      //count sub folders of the folder
      const subFolders = await this.AacFolderModel.count({
        type: AAC_FOLDER_TYPES.SUBFOLDER,
        parentFolderId,
      });

      let hasSubFolders = false;
      if (subFolders > 0) {
        hasSubFolders = true;
      }
      await this.AacFolderModel.updateMany(
        {
          folderId: parentFolderId,
          type: AAC_FOLDER_TYPES.FOLDER,
        },
        { $set: { hasSubFolders } },
        { new: true },
      );
    });

    //as per current implementation: SUBFOLDERS do not have further sub folders
    await this.AacFolderModel.updateMany(
      { type: AAC_FOLDER_TYPES.SUBFOLDER }, //update only SUBFOLDERS
      { $set: { hasSubFolders: false } },
      { new: true },
    );

    return { parentFolderIds };
  }
}
