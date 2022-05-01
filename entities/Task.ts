import { ID } from "../types.ts";
import {Borrower} from "./Borrower.ts";
import {Loan} from "./Loan.ts";
import {TaskDefinition} from "../repositories/ITaskDefsRepository.ts";

export type Entity = Borrower | Loan;

interface TaskState {
  resolve(entity: Entity, taskDef: TaskDefinition): void;
}

abstract class TaskState {
  protected readonly task: Task;
  protected readonly entity: Entity;
  protected readonly taskDef: TaskDefinition;

  constructor(task: Task, entity: Entity, taskDef: TaskDefinition) {
    this.task = task;
    this.entity = entity;
    this.taskDef = taskDef;
  }
}

export type TaskStatus = "Open" | "Cancelled" | "Completed";

export class OpenTaskState extends TaskState implements TaskState {
  resolve() {
    const entity = JSON.parse(JSON.stringify(this.entity));
    this.taskDef.triggerConditions.every((condition) => {
      const field = condition.field;
      if (condition.comparator === 'exists') {
        return entity[field] !== '' && entity[field] !== null;
      }
      if (condition.comparator === 'equals') {
        return String(entity[field].toLowerCase().trim()) === String(condition.value).toLowerCase().trim();
      }
    });
  }
}

export class Task {
  public readonly id: ID;
  public status: TaskStatus;
  public taskDefID: ID;

  constructor(props: Task) {
    this.id = props.id;
    this.status = props.status;
    this.taskDefID = props.taskDefID;
  }
}
