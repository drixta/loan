import { EntityType, ID } from "../types.ts";
import { MemoryTasksRepository } from "../repositories/MemoryTasksRepository.ts";
import { MemoryTaskDefsRepository } from "../repositories/MemoryTaskDefsRepository.ts";
import { Entity, resolveCondition, Task } from "../entities/Task.ts";

interface TaskResolverParams {
  type: EntityType;
  field: string;
  entity: Entity;
}

class TaskResolverService {
  private readonly taskRepository: MemoryTasksRepository =
    new MemoryTasksRepository();
  private readonly taskDefRepository: MemoryTaskDefsRepository =
    new MemoryTaskDefsRepository();

  execute({ type, field, entity }: TaskResolverParams) {
    const taskIDs = this.taskDefRepository.getTaskDefIDByEntityField({
      type,
      field,
    });
    taskIDs.forEach((taskID) => {
      const taskDef = this.taskDefRepository.getTaskDef(taskID);
      if (!taskDef) {
        throw new Error("Cannot find task definition");
      }
      const task = this.taskRepository.getTask({
        entityID: entity.id,
        taskDefID: taskID,
      });
      if (task) {
        task.resolve();
      } else if (resolveCondition(taskDef.triggerConditions, entity)) {
        const newUUID = crypto.randomUUID();
        const newTask = new Task({
          id: newUUID,
          taskDef,
          entity,
        });
        this.taskRepository.save({
          entityID: entity.id,
          taskDefID: taskID,
          task: newTask,
        });
      }
    });
  }
}

export const taskResolverService = new TaskResolverService();
