import { assertEquals } from "https://deno.land/std@0.137.0/testing/asserts.ts";
import { createLoanService } from "./services/CreateLoanService.ts";
import { Loan } from "./entities/Loan.ts";

Deno.test("Loan Service", async (t) => {
  await t.step("create a loan", () => {
    const testID = "loan123";
    createLoanService.execute({ id: testID });
    assertEquals(
      createLoanService["loansRepository"].findByID(testID),
      new Loan({
        borrowerId: [],
        id: "loan123",
        loanAmount: undefined,
        loanType: undefined,
        propertyAddress: undefined,
        purchasePrice: undefined,
      }),
    );
  });
});
