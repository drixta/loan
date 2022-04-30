import {ID} from "../types.ts";

export abstract class MemoryRepository<T> {
  private memoryStore: Map<ID, T> = new Map();
  findByID(id: ID): T | undefined {
    return this.memoryStore.get(id);
  }
  save(id: ID, entity: T): void {
    this.memoryStore.set(id, entity);
  }
}
