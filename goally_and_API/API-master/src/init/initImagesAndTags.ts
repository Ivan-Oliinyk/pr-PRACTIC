import { INestApplication } from '@nestjs/common';
import { ImagesService } from 'src/entities/images/images.service';
import { PuzzlesService } from 'src/entities/puzzles/puzzles.service';

export async function setupImagesAndTags(app: INestApplication) {
  try {
    console.log('started', '🏙'.repeat(10));
    const imageService = app.get(ImagesService);
    await imageService.initImagesAndTags();
    await imageService.initPuzzlesAndCategories();

    const puzzleService = app.get(PuzzlesService);
    await puzzleService.initPuzzlesAndCategories();

    console.log('finished', '🖼'.repeat(10));
  } catch (e) {
    console.log(e);
  }
}
