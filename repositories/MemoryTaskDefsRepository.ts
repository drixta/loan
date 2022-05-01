import {
  GetTaskDefIDByEntityFieldParams,
  ITaskDefsRepository,
  SaveParams,
  TaskDefinition,
} from "./ITaskDefsRepository.ts";
import { EntityType, ID } from "../types.ts";

// Export only for tests
export const taskDefinitionStore: { [id: ID]: TaskDefinition } = {};
// Export only for tests
// Export only for tests
export const fieldToTaskDefStore: {
  [field: string]: ID[];
} = {};

export class MemoryTaskDefsRepository implements ITaskDefsRepository {
  getTaskDef(id: ID): TaskDefinition | undefined {
    return taskDefinitionStore[id];
  }

  // We can improve run time by adding entity type key above the object but since the task definition list
  // is small, we'll table scan it for now
  getTaskDefsIDOfType(type: EntityType): ID[] {
    return Object.entries(taskDefinitionStore).filter(([_, taskDef]) => {
      return taskDef.entity === type;
    }).map(([key]) => key);
  }

  save({ id, taskDef }: SaveParams) {
    taskDefinitionStore[id] = taskDef;
    taskDef.triggerConditions.forEach((condition) => {
      fieldToTaskDefStore[`${taskDef.entity}.${condition.field}`] ??= [];
      fieldToTaskDefStore[`${taskDef.entity}.${condition.field}`].push(id);
    });
  }

  getTaskDefIDByEntityField({ type, field }: GetTaskDefIDByEntityFieldParams) {
    return fieldToTaskDefStore[`${type}.${field}`];
  }
}
