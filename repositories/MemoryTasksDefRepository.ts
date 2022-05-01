import {
  GetTaskDefIDByEntityFieldParams,
  ITasksDefRepository,
  SaveParams,
  TasksDefinition,
} from "./ITasksDefRepository.ts";
import {EntityType, ID} from "../types.ts";

// Export only for tests
export const taskDefinitionStore: {[id: ID]: TasksDefinition} = {};
// Export only for tests
// Export only for tests
export const fieldToTaskDefStore: {
  [field: string]: ID[];
} = {};

export class MemoryTasksDefRepository implements ITasksDefRepository {
  getTaskDef(id: ID): TasksDefinition | undefined {
    return taskDefinitionStore[id];
  }

  // We're doing a table scan here because this function gets called once on initialization
  // Instead of increasing complexity by adding another entity type level to the datastore
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
