import { MemoryTaskDefsRepository } from "../repositories/MemoryTaskDefsRepository.ts";
import { TaskDefinition } from "../repositories/ITaskDefsRepository.ts";

class TaskDefInitializationService {
  private readonly taskDefsRepository: MemoryTaskDefsRepository =
    new MemoryTaskDefsRepository();

  execute(taskDefs: TaskDefinition[]) {
    taskDefs.forEach((taskDef) => {
      const newUUID = crypto.randomUUID();
      const populatedTaskDef = {
        ...taskDef,
        id: newUUID,
      }
      this.taskDefsRepository.save({ id: newUUID, taskDef: populatedTaskDef });
    });
  }
}

export const taskDefInitializationService = new TaskDefInitializationService();
