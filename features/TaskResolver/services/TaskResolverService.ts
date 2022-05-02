import { MemoryTasksRepository } from "../repositories/MemoryTasksRepository.ts";
import { MemoryTaskDefsRepository } from "../repositories/MemoryTaskDefsRepository.ts";
import { printf } from "https://deno.land/std@0.137.0/fmt/printf.ts";
import { red } from "https://deno.land/std@0.137.0/fmt/colors.ts";
import { EntityType, ID } from "../../../types.ts";
import { MemoryLoansRepository } from "../../LoanManager/repositories/MemoryLoansRepository.ts";
import { MemoryBorrowersRepository } from "../../LoanManager/repositories/MemoryBorrowersRepository.ts";
import { Entity, resolveCondition, Task } from "../entities/Task.ts";
import { TaskDefinition } from "../repositories/ITaskDefsRepository.ts";

interface TaskResolverParams {
  type: EntityType;
  field: string;
  entityID: ID;
  actionName: string;
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

  private getEntity(entityID: ID, type: EntityType): Entity {
    let entity: Entity | undefined;
    if (type === "loan") {
      entity = this.loanRepository.findByID(entityID);
    } else if (type === "borrower") {
      entity = this.borrowerRepository.findByID(entityID);
    }
    if (!entity) {
      throw new Error("Cannot find entity");
    }
    return entity;
  }

  private printTasks() {
    if ((window as any)["env"] != "Test") {
      const allTasks = this.taskRepository.listAllTasks();
      allTasks.forEach((task, index) => {
        task.print();
      });
    }
  }

  private createNewTask(taskDef: TaskDefinition, entity: Entity) {
    if (resolveCondition(taskDef.triggerConditions, entity)) {
      const newUUID = crypto.randomUUID();
      const newTask = new Task({
        id: newUUID,
        entityID: entity.id,
        taskDefName: taskDef.name,
        taskDefID: taskDef.id,
      });
      newTask.resolve(entity, taskDef);
      this.taskRepository.save({
        entityID: newTask.entityID,
        taskDefID: newTask.taskDefID,
        task: newTask,
      });
    }
  }

  execute({ type, field, entityID, actionName }: TaskResolverParams) {
    const entity = this.getEntity(entityID, type);
    const taskDefIDs = this.taskDefRepository.getTaskDefIDByEntityField({
      type,
      field,
    });
    if ((window as any)["env"] != "Test") {
      printf(
        red(`=====Action ${actionName}:${entityID}.${field} executed=====\n`),
      );
    }
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
      } else {
        this.createNewTask(taskDef, entity);
      }
      this.printTasks();
    });
  }
}

export const taskResolverService = new TaskResolverService();
