import { MemoryTasksRepository } from "../repositories/MemoryTasksRepository.ts";
import { MemoryTaskDefsRepository } from "../repositories/MemoryTaskDefsRepository.ts";
import { EntityType, ID } from "../../../types.ts";

interface TaskInitializeParams {
  entityID: ID;
  type: EntityType;
}

class TaskInitializationService {
  private readonly taskRepository: MemoryTasksRepository =
    new MemoryTasksRepository();
  private readonly taskDefRepository: MemoryTaskDefsRepository =
    new MemoryTaskDefsRepository();

  execute({ entityID, type }: TaskInitializeParams) {
    this.taskDefRepository.getTaskDefsIDOfType(type).forEach((taskDefID) => {
      this.taskRepository.save({ entityID, taskDefID, task: null });
    });
  }
}

export const taskInitializationService = new TaskInitializationService();
