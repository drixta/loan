import { MemoryTaskDefsRepository } from "../repositories/MemoryTaskDefsRepository.ts";
import { TaskDefinition } from "../repositories/ITaskDefsRepository.ts";
import { ID } from "../../../types.ts";

class TaskDefInitializationService {
  private readonly taskDefsRepository: MemoryTaskDefsRepository =
    new MemoryTaskDefsRepository();

  execute(taskDefs: TaskDefinition[]) {
    const taskDefsID: ID[] = [];
    taskDefs.forEach((taskDef) => {
      const newUUID = crypto.randomUUID();
      const populatedTaskDef = {
        ...taskDef,
        id: newUUID,
      };
      this.taskDefsRepository.save({ id: newUUID, taskDef: populatedTaskDef });
      taskDefsID.push(newUUID);
    });
    return taskDefsID;
  }
}

export const taskDefInitializationService = new TaskDefInitializationService();
