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

export interface TaskDefinition {
  name: string;
  entity: string;
  triggerConditions: Condition[];
  completionConditions: Condition[];
}

export interface SaveParams {
  id: ID;
  taskDef: TaskDefinition;
}

export interface GetTaskDefIDByEntityFieldParams {
  type: EntityType;
  field: string;
}

export interface ITaskDefsRepository {
  getTaskDef(id: ID): TaskDefinition | undefined;
  getTaskDefsIDOfType(type: EntityType): ID[];
  getTaskDefIDByEntityField(params: GetTaskDefIDByEntityFieldParams): void;
  save(params: SaveParams): void;
}
