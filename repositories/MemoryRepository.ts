import {ID} from "../types.ts";

export abstract class MemoryRepository<T> {
  private memoryStore: Map<ID, T> = new Map();
  async findByID(id: ID): Promise<T> {
    return this.memoryStore.get(id);
  };
  async save(id: ID, entity: T): Promise<void> {
    return this.memoryStore.set(id, entity);
  };
}
