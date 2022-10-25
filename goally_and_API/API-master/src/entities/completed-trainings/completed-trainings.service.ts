import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as BB from 'bluebird';
import { omit } from 'lodash';
import * as moment from 'moment';
import { PaginateModel, Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import { COMPLETED_TRAINING_TYPES } from 'src/shared/const/completed-training-types';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { BehaviorTrainingsService } from '../behavior-trainings/behavior-trainings.service';
import { ClientsService } from '../clients/clients.service';
import { Device } from '../devices/schemas';
import { User } from '../users/schema';
import { ChildCompleteGeneralTraining } from './dto/ChildCompleteGeneralTraining.dto';
import { ChildCompleteRehearsalTraining } from './dto/ChildCompleteRehearsalTraining.dto';
import { CompletedTraining } from './schema/completed-training.schema';

@Injectable()
export class CompletedTrainingsService {
  constructor(
    @InjectModel(CompletedTraining.name)
    private CompletedTrainingModel: PaginateModel<CompletedTraining>,
    private cs: ClientsService,
    private bts: BehaviorTrainingsService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
  ) {}

  async getChildCompletedTrainings(
    clientId: Types.ObjectId,
    user: User,
    daysBefore: number,
    type: string,
  ) {
    if (type && !Object.values(COMPLETED_TRAINING_TYPES).includes(type))
      throw new BadRequestException(`type must be GENERAL or REHEARSAL`);
    else if (!type) type = COMPLETED_TRAINING_TYPES.GENERAL;

    const dateBefore = moment().subtract(daysBefore, 'days');
    const completedTrainings = await this.CompletedTrainingModel.find({
      type,
      clientId,
      createdAt: {
        $gte: dateBefore.toDate(),
      },
    }).sort('-createdAt');
    return completedTrainings;
  }

  async getAllCompletedTrainings(user: User, daysBefore: number, type: string) {
    const clients = await BB.map(user.clients, this.cs.findById);
    const completedTrainingsByClients = await BB.map(clients, async client => {
      const completedTrainings = await this.getChildCompletedTrainings(
        client._id,
        user,
        daysBefore,
        type,
      );
      return { client, completedTrainings };
    });
    return completedTrainingsByClients;
  }

  async completeGeneral(data: ChildCompleteGeneralTraining, device: Device) {
    const behaviorTraining = await this.bts.findById(data.behaviorTrainingId);
    if (!behaviorTraining) {
      throw new BadRequestException(
        `Behavior training not found ${data.behaviorTrainingId}`,
      );
    }
    if (behaviorTraining.segments.length !== data.segments.length) {
      throw new BadRequestException(
        `Behavior training segments must be of size ${behaviorTraining.segments.length}`,
      );
    }

    behaviorTraining.lastCompleted = new Date();
    await behaviorTraining.save();

    behaviorTraining.segments.forEach(segment => {
      const correctAnswerId = segment.answers
        .filter(e => e.isCorrect)
        .map(e => e._id.toString());

      data.segments.forEach(segmentDto => {
        if (segmentDto.segmentId.toString() === segment._id.toString()) {
          segment.clientAnswerId = segmentDto.clientAnswerId;
          if (
            segmentDto.clientAnswerId.toString() ===
            correctAnswerId[0].toString()
          )
            segment.isCorrectAnswer = true;
          else segment.isCorrectAnswer = false;
        }
      });
    });

    const preparedTraining = omit(
      {
        behaviorTrainingId: behaviorTraining._id,
        type: COMPLETED_TRAINING_TYPES.GENERAL,
        name: behaviorTraining.name,
        reasons: behaviorTraining.reasons,
        videoURL: behaviorTraining.videoURL,
        segments: behaviorTraining.segments,
        points: behaviorTraining.points,
        puzzlePieces: behaviorTraining.puzzlePieces,
        puzzlePieceOnCorrectAnswer: behaviorTraining.puzzlePieceOnCorrectAnswer,
        pin: behaviorTraining.pin,
        clientId: device.client._id,
        createdBy: behaviorTraining.createdBy,
      },
      '_id',
      'createdAt',
      'updatedAt',
    );
    const competedTraining = new this.CompletedTrainingModel(preparedTraining);
    const savedCompetedTraining = await competedTraining.save();
    this.emitter.emit('CompletedTrainingCreated', savedCompetedTraining);
    this.updatePointsAndPuzzles(device, savedCompetedTraining);
    return savedCompetedTraining;
  }

  async completeRehearsal(
    data: ChildCompleteRehearsalTraining,
    device: Device,
  ) {
    const behaviorTraining = await this.bts.findById(data.behaviorTrainingId);
    if (!behaviorTraining) {
      throw new BadRequestException(
        `Behavior training not found ${data.behaviorTrainingId}`,
      );
    }
    if (behaviorTraining.segments.length !== data.segments.length) {
      throw new BadRequestException(
        `Behavior training segments must be of size ${behaviorTraining.segments.length}`,
      );
    }

    behaviorTraining.segments.forEach(segment => {
      data.segments.forEach(segmentDto => {
        if (segmentDto.segmentId.toString() === segment._id.toString()) {
          if (segmentDto.rehearsals.length != segmentDto.freqOfRehears)
            throw new BadRequestException(
              `Behavior segments rehearsals must be of size ${segmentDto.freqOfRehears}`,
            );
          segment.rehearsals = segmentDto.rehearsals;
          segment.freqOfRehears = segmentDto.freqOfRehears;
        }
      });
    });

    const preparedTraining = omit(
      {
        ...data,
        behaviorTrainingId: behaviorTraining._id,
        type: COMPLETED_TRAINING_TYPES.REHEARSAL,
        name: behaviorTraining.name,
        reasons: behaviorTraining.reasons,
        videoURL: behaviorTraining.videoURL,
        segments: behaviorTraining.segments,
        points: behaviorTraining.points,
        puzzlePieces: behaviorTraining.puzzlePieces,
        pin: behaviorTraining.pin,
        clientId: device.client._id,
        createdBy: behaviorTraining.createdBy,
      },
      '_id',
      'createdAt',
      'updatedAt',
    );
    const competedTraining = new this.CompletedTrainingModel(preparedTraining);
    const savedCompetedTraining = await competedTraining.save();
    this.emitter.emit('CompletedTrainingCreated', savedCompetedTraining);
    if (data.pointsGiven)
      this.updatePoints(device, savedCompetedTraining.points);
    return savedCompetedTraining;
  }

  async updatePoints(device: Device, trainingPoints: number) {
    if (trainingPoints) {
      const client = await this.cs.getClientByDevice(device._id);
      if (!client)
        throw new BadRequestException('Child not connected to that device');

      const points = client.points + trainingPoints;
      await this.cs.update(client._id, { points }, null);
    }
  }

  async updatePointsAndPuzzles(
    device: Device,
    completedTraining: CompletedTraining,
  ) {
    if (completedTraining.points) {
      const client = await this.cs.getClientByDevice(device._id);
      if (!client)
        throw new BadRequestException('Child not connected to that device');

      const points = client.points + completedTraining.points;
      const fieldsToUpdate = { points };
      //add puzzle pieces in client
      if (completedTraining.puzzlePieces) {
        let puzzlePieces = client.puzzlePieces + completedTraining.puzzlePieces;

        if (completedTraining.puzzlePieceOnCorrectAnswer) {
          completedTraining.segments.map(segment => {
            segment.isCorrectAnswer
              ? (puzzlePieces = puzzlePieces + 1)
              : (puzzlePieces = puzzlePieces + 0);
          });
        }
        Object.assign(fieldsToUpdate, { puzzlePieces });
      }
      await this.cs.update(client._id, fieldsToUpdate, null);
    }
  }
}
