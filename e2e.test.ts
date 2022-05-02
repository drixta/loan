import { assertEquals } from "https://deno.land/std@0.137.0/testing/asserts.ts";
import { taskDefinitionStore } from "./repositories/MemoryTaskDefsRepository.ts";
import { taskInitializationService } from "./services/TaskInitializationService.ts";
import { taskStore } from "./repositories/MemoryTasksRepository.ts";
import { taskDefInitializationService } from "./services/TaskDefInitializationService.ts";
import { ID } from "./types.ts";
import { taskResolverService } from "./services/TaskResolverService.ts";
import {createLoanService} from "./features/LoanManager/services/CreateLoanService.ts";
import {Loan} from "./features/LoanManager/entities/Loan.ts";
import {updateBorrowerService, updateLoanService} from "./features/LoanManager/services/UpdateFieldService.ts";
import {createBorrowerService} from "./features/LoanManager/services/CreateBorrowerService.ts";
import {Borrower} from "./features/LoanManager/entities/Borrower.ts";

Deno.test("Loan Service", async (t) => {
  const loanID = "loan123";
  const borrowerID = "borrower123";
  await t.step("create a loan", () => {
    createLoanService.execute({ id: loanID });
    assertEquals(
      createLoanService["loansRepository"].findByID(loanID),
      new Loan({
        borrowerID: [],
        id: "loan123",
        loanAmount: undefined,
        loanType: undefined,
        propertyAddress: undefined,
        purchasePrice: undefined,
      }),
    );
  });
  await t.step("create a borrower", () => {
    createBorrowerService.execute({ loanID, borrowerID });
    assertEquals(
      createBorrowerService["loansRepository"].findByID(loanID),
      new Loan({
        borrowerID: [borrowerID],
        id: loanID,
      }),
    );
    assertEquals(
      createBorrowerService["borrowersRepository"].findByID(borrowerID),
      new Borrower({
        id: borrowerID,
      }),
    );
  });
  await t.step("update a loan", () => {
    updateLoanService.execute({
      id: loanID,
      field: "loanType",
      value: "Purchase",
    });
    assertEquals(
      updateLoanService["repository"].findByID(loanID),
      new Loan({
        borrowerID: [borrowerID],
        id: loanID,
        loanAmount: undefined,
        loanType: "Purchase",
        propertyAddress: undefined,
        purchasePrice: undefined,
      }),
    );
  });
  await t.step("update a borrower", () => {
    updateBorrowerService.execute({
      id: borrowerID,
      field: "firstName",
      value: "Jane",
    });
    assertEquals(
      updateBorrowerService["repository"].findByID(borrowerID),
      new Borrower({
        id: borrowerID,
        firstName: "Jane",
      }),
    );
  });
});

Deno.test("Task Initialization", async (t) => {
  const loanID1 = "loan456";
  const loanID2 = "loan789";
  const taskDefs = JSON.parse(JSON.stringify([
    {
      "name": "Require purchase price for purchase loans",
      "entity": "loan",
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
  ]));
  let taskDefID: ID = "";
  await t.step("initialize tasks definition", () => {
    taskDefInitializationService.execute(taskDefs);
    taskDefID = Object.keys(taskDefinitionStore)[0];
  });

  await t.step("initialize task container", () => {
    taskInitializationService.execute({ entityID: loanID1, type: "loan" });
    taskInitializationService.execute({ entityID: loanID2, type: "loan" });
    assertEquals(taskStore[loanID1][taskDefID], null);
    assertEquals(taskStore[loanID2][taskDefID], null);
  });

  await t.step("run a completed task", () => {
    createLoanService.execute({ id: loanID1 });
    updateLoanService.execute({
      field: "loanAmount",
      value: 10000,
      id: loanID1,
    });
    taskResolverService.execute({
      type: "loan",
      field: "loanAmount",
      entityID: loanID1,
    });
    updateLoanService.execute({
      field: "loanType",
      value: "Purchase",
      id: loanID1,
    });
    taskResolverService.execute({
      type: "loan",
      field: "loanType",
      entityID: loanID1,
    });
    updateLoanService.execute({
      field: "purchasePrice",
      value: 100,
      id: loanID1,
    });
    taskResolverService.execute({
      type: "loan",
      field: "purchasePrice",
      entityID: loanID1,
    });
  });
  await t.step("run a canceled task", () => {
    createLoanService.execute({ id: loanID2 });
    updateLoanService.execute({
      field: "loanAmount",
      value: 10000,
      id: loanID2,
    });
    taskResolverService.execute({
      type: "loan",
      field: "loanAmount",
      entityID: loanID2,
    });
    updateLoanService.execute({
      field: "loanType",
      value: "Purchase",
      id: loanID2,
    });
    taskResolverService.execute({
      type: "loan",
      field: "loanType",
      entityID: loanID2,
    });
    updateLoanService.execute({
      field: "loanAmount",
      value: null,
      id: loanID2,
    });
    taskResolverService.execute({
      type: "loan",
      field: "loanAmount",
      entityID: loanID2,
    });
    updateLoanService.execute({
      field: "purchasePrice",
      value: 100,
      id: loanID2,
    });
    taskResolverService.execute({
      type: "loan",
      field: "purchasePrice",
      entityID: loanID2,
    });
  });
});
