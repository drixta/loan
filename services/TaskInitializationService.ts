import { EntityType, ID } from "../types.ts";
import { IEntitiesRepository } from "../repositories/IEntitiesRepository.ts";
import { MemoryLoansRepository } from "../repositories/MemoryLoansRepository.ts";
import { MemoryBorrowersRepository } from "../repositories/MemoryBorrowersRepository.ts";
import { cloneInstance } from "../utils/cloneInstance.ts";
import { fifoEventBus } from "../providers/fifoEventBus.ts";
import { MemoryTasksRepository } from "../repositories/MemoryTasksRepository.ts";
import { MemoryTasksDefRepository } from "../repositories/MemoryTasksDefRepository.ts";

interface TaskInitializeParams {
  entityID: ID;
  type: EntityType;
}

class TaskInitializationService {
  private readonly taskRepository: MemoryTasksRepository =
    new MemoryTasksRepository();
  private readonly taskDefRepository: MemoryTasksDefRepository =
    new MemoryTasksDefRepository();

  execute({ entityID, type }: TaskInitializeParams) {
    this.taskDefRepository.getTaskDefsIDOfType(type).forEach((taskDefID) => {
      this.taskRepository.save({ entityID, taskDefID, task: null });
    })
  }
}

export const taskInitializationService = new TaskInitializationService();
