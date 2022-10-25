import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsPositive } from 'class-validator';
import { COMPLETED_ROUTINE_SEARCH_FIELDS } from 'src/shared/const/stat-search-fields';
import { COMPLETED_ROUTINE_SORT_FIELDS } from 'src/shared/const/stat-sort-fields';

export class GetAllCompletedRoutinesDto {
  @IsOptional()
  from: string;

  @IsOptional()
  to: string;

  @IsOptional()
  @IsIn(Object.values(COMPLETED_ROUTINE_SEARCH_FIELDS))
  searchField: string;

  @IsOptional()
  searchText: string;

  @IsOptional()
  @IsIn(Object.values(COMPLETED_ROUTINE_SORT_FIELDS))
  sortBy: string;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit: number;
}
