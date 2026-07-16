import { type ISearchResult } from './search-result.interface';

export interface ISearchableRepository {
  search(query: string): ISearchResult;
}
