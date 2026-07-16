export interface ISearchableRepository<TModel> {
  search(query: string): Promise<TModel[]>;
}
