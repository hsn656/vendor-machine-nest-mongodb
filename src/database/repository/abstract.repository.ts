import {
  Document,
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

export abstract class AbstractRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}

  async findOne(
    entityFilterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
  ): Promise<T | null> {
    return this.entityModel.findOne(entityFilterQuery, projection).exec();
  }

  async find(entityFilterQuery: FilterQuery<T>): Promise<T[] | null> {
    return this.entityModel.find(entityFilterQuery);
  }

  async findById(
    id: any,
    projection?: ProjectionType<T> | null,
    options?: QueryOptions<T> | null,
  ): Promise<T | null> {
    return this.entityModel.findById(id, projection, options);
  }

  async create(createEntityData: unknown): Promise<T> {
    const entity = await this.entityModel.create(createEntityData);
    return entity;
  }

  async findOneAndUpdate(
    entityFilterQuery: FilterQuery<T>,
    updateEntityData: UpdateQuery<unknown>,
    options?: QueryOptions,
  ): Promise<T | null> {
    return this.entityModel.findOneAndUpdate(
      entityFilterQuery,
      updateEntityData,
      {
        ...options,
      },
    );
  }

  async deleteMany(entityFilterQuery: FilterQuery<T>): Promise<boolean> {
    const deleteResult = await this.entityModel.deleteMany(entityFilterQuery);
    return deleteResult.deletedCount >= 1;
  }
}
