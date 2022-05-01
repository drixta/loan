import { ID } from "../types.ts";

export type TaskStatus = "Open" | "Cancelled" | "Completed";

export interface Task {
  id: string;
  taskDefID: ID;
  status: TaskStatus;
}

interface ListByEntityIDAndFieldParams {
  entityID: ID;
  field: string;
}

interface SaveParams {
  entityID: ID;
  field: string;
  task: Task;
}

export interface ITasksRepository {
  listByEntityIDAndField(
    { entityID, field }: ListByEntityIDAndFieldParams,
  ): Task[] | undefined;
  save({ entityID, field, task }: SaveParams): void;
}
