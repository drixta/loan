import { printf } from "https://deno.land/std@0.137.0/fmt/printf.ts";
import { red } from "https://deno.land/std@0.137.0/fmt/colors.ts";
import { createLoanService } from "./services/CreateLoanService.ts";
import { createBorrowerService } from "./services/CreateBorrowerService.ts";
import {
  updateBorrowerService,
  updateLoanService,
} from "./services/UpdateFieldService.ts";

import { MemoryTaskDefsRepository } from "./repositories/MemoryTaskDefsRepository.ts";
import { TaskDefinition } from "./repositories/ITaskDefsRepository.ts";
import { fifoEventBus } from "./providers/fifoEventBus.ts";
import { taskInitializationService } from "./services/TaskInitializationService.ts";
import { taskDefInitializationService } from "./services/TaskDefInitializationService.ts";

// if (!Deno.args?.length && Deno.args.length !== 2) {
//   printf(
//     red(
//       "Missing parameters: Provide path for actions.json and tasks.json files when running this program\n",
//     ),
//   );
//   Deno.exit(1);
// }
// const actionsJSON = await Deno.readTextFile(Deno.args[0]);
// const tasksJSON = await Deno.readTextFile(Deno.args[1]);

const tasksJSON = [
  {
    "name": "Require purchase price for purchase loans",
    "entity": "Loan",
    "triggerConditions": [
      {
        "field": "loanAmount",
        "comparator": "exists",
      },
      {
        "field": "loanType",
        "comparator": "equals",
        "value": "Purchase",
      },
    ],
    "completionConditions": [
      {
        "field": "purchasePrice",
        "comparator": "exists",
      },
    ],
  },
  {
    "name": "Require address for borrower",
    "entity": "Borrower",
    "triggerConditions": [
      {
        "field": "firstName",
        "comparator": "exists",
      },
      {
        "field": "lastName",
        "comparator": "exists",
      },
    ],
    "completionConditions": [
      {
        "field": "address",
        "comparator": "exists",
      },
    ],
  },
];

const formatTaskDef = (tasksDef: TaskDefinition) => {
  return {
    ...tasksDef,
    entity: tasksDef.entity.toLowerCase().trim(),
  };
};

// TODO: Move to a service
export const initializeTaskDefinition = () => {
  const taskDefs = JSON.parse(JSON.stringify(tasksJSON)).map((
    taskDef: TaskDefinition,
  ) => formatTaskDef(taskDef));
  taskDefInitializationService.execute(taskDefs);
};

export const actionsRoute = {
  createLoan: (action: any) => {
    createLoanService.execute(action.loanIdentifier);
  },
  createBorrower: (action: any) => {
    createBorrowerService.execute({
      borrowerID: action.borrowerId,
      loanID: action.loanIdentifier,
    });
  },
  setLoanField: ({ loanIdentifier, field, value }: any) => {
    updateLoanService.execute({ id: loanIdentifier, field, value });
  },
  setBorrowerField: ({ borrowerIdentifier, field, value }: any) => {
    updateBorrowerService.execute({ id: borrowerIdentifier, field, value });
  },
};

fifoEventBus.subscribe("loan.create.completed", (params: any) => {
  taskInitializationService.execute({ entityID: params.id, type: "loan" });
});

fifoEventBus.subscribe("borrower.create.completed", (params: any) => {
  taskInitializationService.execute({ entityID: params.id, type: "borrower" });
});
