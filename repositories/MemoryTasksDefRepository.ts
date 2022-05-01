import {
  GetTaskDefIDByEntityFieldParams,
  ITasksDefRepository,
  SaveParams,
  TasksDefinition,
} from "./ITasksDefRepository.ts";
import { ID } from "../types.ts";

const taskDefinitionStore: Map<ID, TasksDefinition> = new Map();
const fieldToTaskDefStore: {
  [field: string]: ID[];
} = {};

export class MemoryTasksDefRepository implements ITasksDefRepository {
  getTaskDef(id: ID): TasksDefinition | undefined {
    return taskDefinitionStore.get(id);
  }

  save({ id, taskDef }: SaveParams) {
    taskDefinitionStore.set(id, taskDef);
    taskDef.triggerConditions.forEach((condition) => {
      fieldToTaskDefStore[`${taskDef.entity}.${condition.field}`] ??= [];
      fieldToTaskDefStore[`${taskDef.entity}.${condition.field}`].push(id);
    });
  }

  getTaskDefIDByEntityField({ type, field }: GetTaskDefIDByEntityFieldParams) {
    return fieldToTaskDefStore[`${type}.${field}`];
  }
}
