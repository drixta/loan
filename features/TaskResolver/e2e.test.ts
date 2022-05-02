import { ID } from "../../types.ts";
import { taskDefInitializationService } from "./services/TaskDefInitializationService.ts";
import {
  taskDefinitionStore,
} from "./repositories/MemoryTaskDefsRepository.ts";
import { taskInitializationService } from "./services/TaskInitializationService.ts";
import { assertEquals } from "https://deno.land/std@0.137.0/testing/asserts.ts";
import { taskStore } from "./repositories/MemoryTasksRepository.ts";
import { createLoanService } from "../LoanManager/services/CreateLoanService.ts";
import { updateLoanService } from "../LoanManager/services/UpdateFieldService.ts";
import { taskResolverService } from "./services/TaskResolverService.ts";

(window as any)["env"] = "Test";

Deno.test("Task Resolver", async (t) => {
  const loanID1 = "loan456";
  const loanID2 = "loan789";
  const loanID3 = "loan890";
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
    assertEquals(!!taskDefID, true);
  });

  await t.step("initialize task container", () => {
    taskInitializationService.execute({ entityID: loanID1, type: "loan" });
    taskInitializationService.execute({ entityID: loanID2, type: "loan" });
    taskInitializationService.execute({ entityID: loanID3, type: "loan" });
    assertEquals(taskStore[loanID1][taskDefID], null);
    assertEquals(taskStore[loanID2][taskDefID], null);
    assertEquals(taskStore[loanID3][taskDefID], null);
  });

  await t.step("run a completed task", async (t) => {
    await t.step("initialize service and set 1 field", () => {
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
      assertEquals(taskStore[loanID1][taskDefID], null);
    });
    await t.step("set 2nd field and validate trigger condition", () => {
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
      assertEquals(
        taskStore[loanID1][taskDefID]?.currentState.displayName,
        "Open",
      );
    });
    await t.step("set field and validate complete condition", () => {
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
      assertEquals(
        taskStore[loanID1][taskDefID]?.currentState.displayName,
        "Completed",
      );
    });
  });

  await t.step("run a canceled task", async (t) => {
    await t.step("initialize service and create Open task", () => {
      createLoanService.execute({ id: loanID2 });
      updateLoanService.execute({
        field: "loanAmount",
        value: 10000,
        id: loanID2,
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
      assertEquals(
        taskStore[loanID2][taskDefID]?.currentState.displayName,
        "Open",
      );
    });
    await t.step("set null field and create Cancelled task", () => {
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
      assertEquals(
        taskStore[loanID2][taskDefID]?.currentState.displayName,
        "Cancelled",
      );
    });
    await t.step("validate completion conditons", () => {
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
      assertEquals(
        taskStore[loanID2][taskDefID]?.currentState.displayName,
        "Cancelled",
      );
    });
    await t.step("set task to Open again which resolves to Complete", () => {
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
      assertEquals(
        taskStore[loanID2][taskDefID]?.currentState.displayName,
        "Completed",
      );
    });
  });
  await t.step("rerun a completed task", async (t) => {
    await t.step("initialize service and create a Completed task", () => {
      createLoanService.execute({ id: loanID3 });
      updateLoanService.execute({
        field: "loanAmount",
        value: 10000,
        id: loanID3,
      });
      updateLoanService.execute({
        field: "loanType",
        value: "Purchase",
        id: loanID3,
      });
      updateLoanService.execute({
        field: "purchasePrice",
        value: 1000,
        id: loanID3,
      });
      taskResolverService.execute({
        type: "loan",
        field: "purchasePrice",
        entityID: loanID3,
      });
      assertEquals(
        taskStore[loanID3][taskDefID]?.currentState.displayName,
        "Completed",
      );
    });
    await t.step("set null field and task should not change status", () => {
      updateLoanService.execute({
        field: "loanAmount",
        value: null,
        id: loanID3,
      });
      taskResolverService.execute({
        type: "loan",
        field: "loanAmount",
        entityID: loanID3,
      });
      assertEquals(
        taskStore[loanID3][taskDefID]?.currentState.displayName,
        "Completed",
      );
    });
  });
});

Deno.test("Empty Task Resolver", async (t) => {
  const loanID = "EmptyLoanTask123";
  const emptyCompleteConditionTask = JSON.parse(JSON.stringify([
    {
      "name":
        "Require purchase price for purchase loans without complete conditions",
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
      "completionConditions": [],
    },
  ]));
  const taskDefID =
    taskDefInitializationService.execute(emptyCompleteConditionTask)[0];
  taskInitializationService.execute({ entityID: loanID, type: "loan" });
  await t.step("rerun a completed task", async (t) => {
    await t.step("initialize service and create a Completed task", () => {
      createLoanService.execute({ id: loanID });
      updateLoanService.execute({
        field: "loanAmount",
        value: 10000,
        id: loanID,
      });
      updateLoanService.execute({
        field: "loanType",
        value: "Purchase",
        id: loanID,
      });
      taskResolverService.execute({
        type: "loan",
        field: "loanType",
        entityID: loanID,
      });
      updateLoanService.execute({
        field: "purchasePrice",
        value: 1000,
        id: loanID,
      });
      taskResolverService.execute({
        type: "loan",
        field: "purchasePrice",
        entityID: loanID,
      });
      assertEquals(
        taskStore[loanID][taskDefID]?.currentState.displayName,
        "Open",
      );
    });
  });
});
