import { ITasksDefRepository, TasksDefinition } from "./ITasksDefRepository.ts";
import { ID } from "../types.ts";
import {
  GetTaskParams,
  ITasksRepository,
  SaveParams,
  Task,
} from "./ITasksRepository.ts";

const taskStore: {
  [entityID: string]: {
    [taskDefID: string]: Task;
  };
} = {};

export class MemoryTasksRepository implements ITasksRepository {
  getTask({
    entityID,
    taskDefID,
  }: GetTaskParams): Task | undefined {
    return taskStore[entityID][taskDefID];
  }

  save({ entityID, taskDefID, task }: SaveParams) {
    taskStore[entityID] ??= {};
    taskStore[entityID][taskDefID] = task;
  }
}
