import { ID } from "../types.ts";
import {Task, TaskStatus} from "../entities/Task.ts";

export interface GetTaskParams {
  entityID: ID;
  taskDefID: ID;
}

export interface SaveParams {
  entityID: ID;
  taskDefID: ID;
  task: Task | null;
}

export interface ITasksRepository {
  getTask(params: GetTaskParams): Task | null;
  save(params: SaveParams): void;
  listAllTasks(): Task[];
}
