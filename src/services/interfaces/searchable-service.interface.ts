import { type ISearchResult } from './search-result.interface';

export interface ISearchableService {
  search(query: string): Promise<ISearchResult>;
}
