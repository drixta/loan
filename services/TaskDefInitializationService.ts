import { EntityType, ID } from "../types.ts";
import { MemoryTaskDefsRepository } from "../repositories/MemoryTaskDefsRepository.ts";
import { TaskDefinition } from "../repositories/ITaskDefsRepository.ts";

interface TaskInitializeParams {
  entityID: ID;
  type: EntityType;
}

class TaskDefInitializationService {
  private readonly taskDefsRepository: MemoryTaskDefsRepository =
    new MemoryTaskDefsRepository();

  execute(taskDefs: TaskDefinition[]) {
    taskDefs.forEach((taskDef) => {
      const newUUID = crypto.randomUUID();
      this.taskDefsRepository.save({ id: newUUID, taskDef });
    });
  }
}

export const taskDefInitializationService = new TaskDefInitializationService();
