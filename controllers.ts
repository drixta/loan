import { createLoanService } from "./services/CreateLoanService.ts";
import { createBorrowerService } from "./services/CreateBorrowerService.ts";
import {
  updateBorrowerService,
  updateLoanService,
} from "./services/UpdateFieldService.ts";

import { TaskDefinition } from "./repositories/ITaskDefsRepository.ts";
import { fifoEventBus } from "./providers/fifoEventBus.ts";
import { taskInitializationService } from "./services/TaskInitializationService.ts";
import { taskDefInitializationService } from "./services/TaskDefInitializationService.ts";
import { taskResolverService } from "./services/TaskResolverService.ts";

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
const actionsJSON = [
  {
    "action": "createLoan",
    "loanIdentifier": "loan1",
  },
  {
    "action": "createBorrower",
    "loanIdentifier": "loan1",
    "borrowerIdentifier": "borr1",
  },
  {
    "action": "createBorrower",
    "loanIdentifier": "loan1",
    "borrowerIdentifier": "borr2",
  },
  {
    "action": "setLoanField",
    "loanIdentifier": "loan1",
    "field": "loanAmount",
    "value": 100000,
  },
  {
    "action": "setLoanField",
    "loanIdentifier": "loan1",
    "field": "loanType",
    "value": "Purchase",
  },
  {
    "action": "setBorrowerField",
    "borrowerIdentifier": "borr1",
    "field": "firstName",
    "value": "Jane",
  },
  {
    "action": "setBorrowerField",
    "borrowerIdentifier": "borr1",
    "field": "lastName",
    "value": "Smith",
  },
  {
    "action": "setBorrowerField",
    "borrowerIdentifier": "borr2",
    "field": "firstName",
    "value": "John",
  },
  {
    "action": "setBorrowerField",
    "borrowerIdentifier": "borr2",
    "field": "lastName",
    "value": "Smith",
  },
  {
    "action": "setBorrowerField",
    "borrowerIdentifier": "borr2",
    "field": "firstName",
    "value": null,
  },
  {
    "action": "setLoanField",
    "loanIdentifier": "loan1",
    "field": "purchasePrice",
    "value": 500000,
  },
  {
    "action": "setBorrowerField",
    "borrowerIdentifier": "borr2",
    "field": "firstName",
    "value": "Joseph",
  },
  {
    "action": "setBorrowerField",
    "borrowerIdentifier": "borr2",
    "field": "address",
    "value": "500 California St.",
  },
];

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

export const actionsRoute: any = {
  createLoan: (action: any) => {
    createLoanService.execute({ id: action.loanIdentifier });
  },
  createBorrower: (action: any) => {
    createBorrowerService.execute({
      borrowerID: action.borrowerIdentifier,
      loanID: action.loanIdentifier,
    });
  },
  setLoanField: (action: any) => {
    const { loanIdentifier, field, value } = action;
    updateLoanService.execute({ id: loanIdentifier, field, value });
  },
  setBorrowerField: ({ borrowerIdentifier, field, value }: any) => {
    updateBorrowerService.execute({ id: borrowerIdentifier, field, value });
  },
};

fifoEventBus.subscribe(
  "loan.create.completed",
  (_message: string, params: any) => {
    taskInitializationService.execute({ entityID: params.id, type: "loan" });
  },
);

fifoEventBus.subscribe(
  "borrower.create.completed",
  (_message: string, params: any) => {
    taskInitializationService.execute({
      entityID: params.id,
      type: "borrower",
    });
  },
);

fifoEventBus.subscribe(
  "loan.update.completed",
  (_message: string, params: any) => {
    taskResolverService.execute({
      type: "loan",
      field: params.field,
      entityID: params.entityID,
    });
  },
);

fifoEventBus.subscribe(
  "borrower.update.completed",
  (_message: string, params: any) => {
    taskResolverService.execute({
      type: "borrower",
      field: params.field,
      entityID: params.entityID,
    });
  },
);

initializeTaskDefinition();
actionsJSON.forEach((action: any) => {
  actionsRoute[action.action](action);
});
