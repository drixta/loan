import {ID} from "../types.ts";

export abstract class MemoryRepository<T> {
  protected memoryStore: Map<ID, T> = new Map();
  findByID(id: ID): T | undefined {
    return this.memoryStore.get(id);
  }
  save(id: ID, entity: T): void {
    this.memoryStore.set(id, entity);
  }
}
