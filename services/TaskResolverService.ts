import { EntityType, ID } from "../types.ts";
import { MemoryTasksRepository } from "../repositories/MemoryTasksRepository.ts";
import { MemoryTaskDefsRepository } from "../repositories/MemoryTaskDefsRepository.ts";
import { Entity, resolveCondition, Task } from "../entities/Task.ts";
import { printf } from "https://deno.land/std@0.137.0/fmt/printf.ts";
import { red } from "https://deno.land/std@0.137.0/fmt/colors.ts";
import { MemoryLoansRepository } from "../features/LoanManager/repositories/MemoryLoansRepository.ts";
import { MemoryBorrowersRepository } from "../features/LoanManager/repositories/MemoryBorrowersRepository.ts";

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
    if (type === "loan") {
      entity = this.loanRepository.findByID(entityID);
    } else if (type === "borrower") {
      entity = this.borrowerRepository.findByID(entityID);
    }
    if (!entity) {
      return;
    }
    const taskDefIDs = this.taskDefRepository.getTaskDefIDByEntityField({
      type,
      field,
    });
    printf(red(`=====Action Taken=====\n`));
    taskDefIDs.forEach((taskDefID) => {
      const taskDef = this.taskDefRepository.getTaskDef(taskDefID);
      if (!taskDef || !entity) {
        throw new Error("Cannot find task definition");
      }
      const task = this.taskRepository.getTask({
        entityID: entity.id,
        taskDefID: taskDefID,
      });
      if (task) {
        task.resolve(entity, taskDef);
      } else if (resolveCondition(taskDef.triggerConditions, entity)) {
        const newUUID = crypto.randomUUID();
        const newTask = new Task({
          id: newUUID,
          entityID: entity.id,
          taskDefName: taskDef.name,
          taskDefID,
        });
        newTask.resolve(entity, taskDef);
        this.taskRepository.save({
          entityID: newTask.entityID,
          taskDefID: newTask.taskDefID,
          task: newTask,
        });
      }

      const allTasks = this.taskRepository.listAllTasks();
      for (const task of allTasks) {
        task.print();
      }
    });
  }
}

export const taskResolverService = new TaskResolverService();
