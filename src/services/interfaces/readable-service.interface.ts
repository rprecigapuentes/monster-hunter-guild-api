export interface IReadableService<TModel> {
  findById(id: string): Promise<TModel>;
  findAll(): Promise<TModel[]>;
}
