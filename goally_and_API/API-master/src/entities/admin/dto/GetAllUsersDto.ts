import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsPositive } from 'class-validator';
import { USER_SEARCH_FIELDS } from 'src/shared/const/stat-search-fields';
import { USER_SORT_FIELDS } from 'src/shared/const/stat-sort-fields';

export class GetAllUsersDto {
  @IsOptional()
  from: string;

  @IsOptional()
  to: string;

  @IsOptional()
  @IsIn(Object.values(USER_SEARCH_FIELDS))
  searchField: string;

  @IsOptional()
  searchText: string;

  @IsOptional()
  @IsIn(Object.values(USER_SORT_FIELDS))
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
