import { ID } from "../types.ts";

export type TaskStatus = "Open" | "Cancelled" | "Completed";

export interface Task {
  id: string;
  taskDefID: ID;
  status: TaskStatus;
}

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
