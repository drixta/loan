import { EntityType, ID } from "../types.ts";

export type Condition =
  & {
    field: string;
  }
  & (
    | {
      comparator: "exists";
    }
    | {
      comparator: "equals";
      value: string | number;
    }
  );

export interface TasksDefinition {
  name: string;
  entity: string;
  triggerConditions: Condition[];
  completionConditions: Condition[];
}

export interface SaveParams {
  id: ID;
  taskDef: TasksDefinition;
}

export interface GetTaskDefIDByEntityFieldParams {
  type: EntityType;
  field: string;
}

export interface ITasksDefRepository {
  getTaskDef(id: ID): TasksDefinition | undefined;
  getTaskDefIDByEntityField(params: GetTaskDefIDByEntityFieldParams): void;
  save(params: SaveParams): void;
}
