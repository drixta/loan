import { printf } from "https://deno.land/std@0.137.0/fmt/printf.ts";
import { red } from "https://deno.land/std@0.137.0/fmt/colors.ts";
import { createLoanService } from "./services/CreateLoanService.ts";
import { createBorrowerService } from "./services/CreateBorrowerService.ts";
import {
  updateBorrowerService,
  updateLoanService,
} from "./services/UpdateFieldService.ts";

if (!Deno.args?.length && Deno.args.length !== 2) {
  printf(
    red(
      "Missing parameters: Provide path for actions.json and tasks.json files when running this program\n",
    ),
  );
  Deno.exit(1);
}
const actionsJSON = await Deno.readTextFile(Deno.args[0]);
const tasksJSON = await Deno.readTextFile(Deno.args[1]);

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
