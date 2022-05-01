import { ITasksDefRepository, TasksDefinition } from "./ITasksDefRepository.ts";
import { ID } from "../types.ts";

const taskDefinitionStore: Map<ID, TasksDefinition> = new Map();

export class MemoryTasksDefRepository implements ITasksDefRepository {
  findByID(id: ID): TasksDefinition | undefined {
    return taskDefinitionStore.get(id);
  }

  save(id: ID, taskDef: TasksDefinition) {
    taskDefinitionStore.set(id, taskDef);
  }
}
