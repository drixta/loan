import { printf } from "https://deno.land/std@0.137.0/fmt/printf.ts";
import {
  black,
  blue,
  green,
} from "https://deno.land/std@0.137.0/fmt/colors.ts";

import { ID } from "../../../types.ts";
import { Loan } from "../../LoanManager/entities/Loan.ts";
import { Borrower } from "../../LoanManager/entities/Borrower.ts";
import {
  Condition,
  TaskDefinition,
} from "../repositories/ITaskDefsRepository.ts";

export type Entity = Borrower | Loan;

interface TaskState {
  displayName: string;
  resolve(entity: Entity, taskDef: TaskDefinition): void;
}

abstract class TaskState {
  protected readonly task: Task;

  constructor(task: Task) {
    this.task = task;
  }
}

export type TaskStatus = "Open" | "Cancelled" | "Completed";

export const resolveCondition = (conditions: Condition[], pentity: Entity) => {
  if (!conditions?.length) {
    return false;
  }
  return conditions.every((condition) => {
    const field = condition.field;
    const entity = JSON.parse(JSON.stringify(pentity));
    if (condition.comparator === "exists") {
      return entity[field] !== "" && entity[field] !== null &&
        entity[field] !== undefined;
    }
    if (condition.comparator === "equals") {
      return String(entity[field]?.toLowerCase().trim()) ===
        String(condition.value).toLowerCase().trim();
    }
  });
};

export class OpenTaskState extends TaskState implements TaskState {
  public displayName: TaskStatus = "Open";
  resolve(entity: Entity, taskDef: TaskDefinition) {
    const triggerConditionMet = resolveCondition(
      taskDef.triggerConditions,
      entity,
    );
    if (!triggerConditionMet) {
      this.task.setState(new CancelledTaskState(this.task));
    }
    const completeConditionMet = resolveCondition(
      taskDef.completionConditions,
      entity,
    );
    if (completeConditionMet) {
      this.task.setState(new CompletedTaskState(this.task));
    }
  }
}

export class CancelledTaskState extends TaskState implements TaskState {
  public displayName: TaskStatus = "Cancelled";
  resolve(entity: Entity, taskDef: TaskDefinition) {
    const triggerConditionMet = resolveCondition(
      taskDef.triggerConditions,
      entity,
    );
    if (triggerConditionMet) {
      this.task.setState(new OpenTaskState(this.task));
    }
  }
}

export class CompletedTaskState extends TaskState implements TaskState {
  public displayName: TaskStatus = "Completed";
  resolve(_entity: Entity, _taskDef: TaskDefinition) {
    return;
  }
}

export class Task {
  public readonly id: ID;
  public readonly entityID: ID;
  public readonly taskDefID: ID;
  public readonly taskDefName: string;
  public currentState: TaskState = new OpenTaskState(this);
  constructor(
    { id, entityID, taskDefID, taskDefName }: Pick<
      Task,
      "id" | "entityID" | "taskDefID" | "taskDefName"
    >,
  ) {
    this.id = id;
    this.entityID = entityID;
    this.taskDefID = taskDefID;
    this.taskDefName = taskDefName;
  }

  setState(taskState: TaskState) {
    this.currentState = taskState;
  }

  resolve(entity: Entity, taskDef: TaskDefinition) {
    let pastState;
    while (pastState !== this.currentState) {
      pastState = this.currentState;
      this.currentState.resolve(entity, taskDef);
    }
  }

  print() {
    printf(
      green(
        `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n┃EntityID:${
          black(this.entityID)
        }\n┃Task Name:${this.taskDefName}\n┃Status:${
          blue(this.currentState.displayName)
        }\n┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`,
      ),
    );
  }
}
