import { ID } from "../../../types.ts";

export type EntityStore<T> = Map<ID, T>;

export abstract class MemoryEntityRepository<T> {
  protected memoryStore: EntityStore<T>;

  protected constructor(store: EntityStore<T>) {
    this.memoryStore = store;
  }

  findByID(id: ID): T | undefined {
    return this.memoryStore.get(id);
  }
  save(id: ID, entity: T): void {
    this.memoryStore.set(id, entity);
  }
}
