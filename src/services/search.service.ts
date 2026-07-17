import { type ISearchResult } from './interfaces/search-result.interface';
import { type ISearchableService } from './interfaces/searchable-service.interface';

export interface ISearchService {
  globalSearch(query: string): Promise<ISearchResult[]>;
}

export class SearchService implements ISearchService {
  constructor(private readonly searchableServices: ISearchableService[]) {}

  async globalSearch(query: string): Promise<ISearchResult[]> {
    const trimed = query.trim();
    const searchPromises = this.searchableServices.map((service) => {
      return service.search(trimed).catch((err) => {
        console.error('Error buscando en un servicio', err);
        return [] as ISearchResult[];
      });
    });

    const results = await Promise.all(searchPromises);
    return results
      .flat()
      .filter(
        (searchResult) => searchResult && searchResult.result && searchResult.result.length > 0
      );
  }
}
