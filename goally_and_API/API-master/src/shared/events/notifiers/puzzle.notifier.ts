import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { Puzzles } from 'src/entities/puzzles/schema/puzzles.schema';
import { PUZZLE_NOTIFICATIONS } from 'src/socket/const';
import { SocketBase } from 'src/socket/socket-base.gateway';
import { GoallyEventEmitter } from '../const';
@Injectable()
export class PuzzleNotifier implements OnModuleInit {
  constructor(
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private baseSocket: SocketBase,
  ) {}

  onModuleInit() {
    this.emitter.on(
      'PuzzleCreated',
      async puzzle => await this.onPuzzleCreated(puzzle),
    );
    this.emitter.on(
      'PuzzleUpdated',
      async puzzle => await this.onPuzzleUpdated(puzzle),
    );
    this.emitter.on(
      'PuzzleDeleted',
      async puzzle => await this.onPuzzleDeleted(puzzle),
    );

    this.emitter.on(
      'PuzzleCategoryDeleted',
      async puzzles => await this.onPuzzleCategoryDeleted(puzzles),
    );
    this.emitter.on(
      'PuzzleCategoryUpdated',
      async puzzles => await this.onPuzzleCategoryUpdated(puzzles),
    );
  }

  private async onPuzzleCreated(puzzle) {
    this.onPuzzleChanged(puzzle, 'CREATED');
  }
  private async onPuzzleUpdated(puzzle) {
    this.onPuzzleChanged(puzzle, 'UPDATED');
  }
  private async onPuzzleDeleted(puzzle) {
    this.onPuzzleChanged(puzzle, 'DELETED');
  }
  private async onPuzzleCategoryUpdated(puzzle) {
    this.onPuzzleCategoryChanged(puzzle, 'CATEGORY_UPDATED');
  }
  private async onPuzzleCategoryDeleted(puzzle) {
    this.onPuzzleCategoryChanged(puzzle, 'CATEGORY_DELETED');
  }

  onPuzzleChanged(puzzle: Puzzles, action) {
    const body = {
      puzzleId: puzzle._id,
      clientId: puzzle.clientId,
      action,
      puzzle,
    };
    if (puzzle.clientId) {
      this.baseSocket.notifyAllParentsAndDeviceByClientId(
        puzzle.clientId,
        PUZZLE_NOTIFICATIONS.CLIENT_PUZZLE_CHANGED,
        body,
      );
    }
  }

  onPuzzleCategoryChanged(puzzles: Puzzles[], action) {
    const body = {
      puzzleId: puzzles[0]._id,
      clientId: puzzles[0].clientId,
      action,
      puzzles,
    };
    if (puzzles[0].clientId) {
      this.baseSocket.notifyAllParentsAndDeviceByClientId(
        puzzles[0].clientId,
        PUZZLE_NOTIFICATIONS.CLIENT_PUZZLE_CHANGED,
        body,
      );
    }
  }
}
