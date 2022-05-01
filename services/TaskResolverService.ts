import {EntityType, ID} from "../types.ts";
import { MemoryTasksRepository } from "../repositories/MemoryTasksRepository.ts";
import { MemoryTaskDefsRepository } from "../repositories/MemoryTaskDefsRepository.ts";
import { Entity, resolveCondition, Task } from "../entities/Task.ts";
import {MemoryLoansRepository} from "../repositories/MemoryLoansRepository.ts";
import {MemoryBorrowersRepository} from "../repositories/MemoryBorrowersRepository.ts";

interface TaskResolverParams {
  type: EntityType;
  field: string;
  entityID: ID;
}

class TaskResolverService {
  private readonly taskRepository: MemoryTasksRepository =
    new MemoryTasksRepository();
  private readonly taskDefRepository: MemoryTaskDefsRepository =
    new MemoryTaskDefsRepository();
  private readonly loanRepository: MemoryLoansRepository =
    new MemoryLoansRepository();
  private readonly borrowerRepository: MemoryBorrowersRepository =
    new MemoryBorrowersRepository();

  execute({ type, field, entityID }: TaskResolverParams) {
    let entity: Entity | undefined;
    if (type === 'loan') {
      entity = this.loanRepository.findByID(entityID);
    } else if (type === 'borrower') {
      entity = this.borrowerRepository.findByID(entityID);
    }
    const taskIDs = this.taskDefRepository.getTaskDefIDByEntityField({
      type,
      field,
    });
    taskIDs.forEach((taskID) => {
      const taskDef = this.taskDefRepository.getTaskDef(taskID);
      if (!taskDef || !entity) {
        throw new Error("Cannot find task definition");
      }
      const task = this.taskRepository.getTask({
        entityID: entity.id,
        taskDefID: taskID,
      });
      if (task) {
        task.resolve(entity, taskDef);
      } else if (resolveCondition(taskDef.triggerConditions, entity)) {
        const newUUID = crypto.randomUUID();
        const newTask = new Task({
          id: newUUID,
        });
        newTask.resolve(entity, taskDef);
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
