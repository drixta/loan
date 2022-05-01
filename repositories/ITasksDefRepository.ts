import {EntityType, ID} from "../types.ts";

export type Condition = {
  field: string
} & {
  comparator: 'exists'
} | {
  comparator: 'equals'
  value: string | number;
}

export interface TasksDefinition {
  name: string;
  entity: string;
  triggerConditions: Condition[];
  completionConditions: Condition[];
}

export interface ITasksDefRepository {
  findByIDAndType(id: ID, type: EntityType): TasksDefinition | undefined;
  save(id: ID, taskDef: TasksDefinition): void;
}
