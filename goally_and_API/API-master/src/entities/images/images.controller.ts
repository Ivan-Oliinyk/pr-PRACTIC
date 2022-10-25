import { Controller, DefaultValuePipe, Get, Query } from '@nestjs/common';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
  constructor(private is: ImagesService) {}
  @Get()
  async getImages(@Query('search', new DefaultValuePipe('')) search: string) {
    return this.is.getImageUrl(search);
  }
  @Get('puzzles')
  async getPuzzles() {
    return this.is.getPuzzles();
  }
  @Get('puzzles-with-category')
  async getPuzzlesWithCategories() {
    return this.is.getPuzzlesWithCategories();
  }
  @Get('puzzles-category')
  async getPuzzlesCategory() {
    return this.is.getPuzzlesCategories();
  }
  @Get('category')
  async getImageCategory() {
    return this.is.getCategories();
  }
}
