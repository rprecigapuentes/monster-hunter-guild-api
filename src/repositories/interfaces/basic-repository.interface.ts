export interface IBasicRepository<TModel, TCreateInput, TUpdateInput> {
  create(data: TCreateInput): Promise<TModel>;
  update(id: string, data: TUpdateInput): Promise<TModel>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<TModel | null>;
  findAll(): Promise<TModel[]>;
}
