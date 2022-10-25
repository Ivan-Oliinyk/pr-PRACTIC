import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsPositive } from 'class-validator';
import { CLIENT_SEARCH_FIELDS } from 'src/shared/const/stat-search-fields';
import { CLIENT_SORT_FIELDS } from 'src/shared/const/stat-sort-fields';

export class GetAllClientsDto {
  @IsOptional()
  from: string;

  @IsOptional()
  to: string;

  @IsOptional()
  @IsIn(Object.values(CLIENT_SEARCH_FIELDS))
  searchField: string;

  @IsOptional()
  searchText: string;

  @IsOptional()
  @IsIn(Object.values(CLIENT_SORT_FIELDS))
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
