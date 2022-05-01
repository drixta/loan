import { assertEquals } from "https://deno.land/std@0.137.0/testing/asserts.ts";
import { createLoanService } from "./services/CreateLoanService.ts";
import { Loan } from "./entities/Loan.ts";
import { createBorrowerService } from "./services/CreateBorrowerService.ts";
import {
  updateBorrowerService,
  updateLoanService,
} from "./services/UpdateFieldService.ts";
import { Borrower } from "./entities/Borrower.ts";
import { initializeTaskDefinition } from "./controllers.ts";
import { fieldToTaskDefStore } from "./repositories/MemoryTasksDefRepository.ts";

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
