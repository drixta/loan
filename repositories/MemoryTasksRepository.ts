import {
  GetTaskParams,
  ITasksRepository,
  SaveParams,
  Task,
} from "./ITasksRepository.ts";

const taskStore: {
  [entityID: string]: {
    [taskDefID: string]: Task | null;
  };
} = {};

export class MemoryTasksRepository implements ITasksRepository {
  getTask({
    entityID,
    taskDefID,
  }: GetTaskParams): Task | null {
    return taskStore[entityID][taskDefID];
  }

  save({ entityID, taskDefID, task }: SaveParams) {
    taskStore[entityID] ??= {};
    taskStore[entityID][taskDefID] = task;
  }

  listAllTasks() {
    const taskList = [];
    for (const entityID in taskStore) {
      for (const taskDefID in taskStore[entityID]) {
        const task = taskStore[entityID][taskDefID];
        if (task) {
          taskList.push(task);
        }
      }
    }
    return taskList;
  }
}
