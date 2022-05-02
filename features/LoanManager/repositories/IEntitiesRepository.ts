import {ID} from "../../../types.ts";

export interface IEntitiesRepository<T> {
  findByID(id: ID): T | undefined;
  save(id: ID, entity: T): void;
}
