import {printf} from "https://deno.land/std@0.137.0/fmt/printf.ts";
import {red} from "https://deno.land/std@0.137.0/fmt/colors.ts";
import {createLoanService} from "./services/CreateLoanService.ts";

if (!Deno.args?.length && Deno.args.length !== 2) {
  printf(red('Missing parameters: Provide path for actions.json and tasks.json files when running this program\n'));
  Deno.exit(1);
}
const actionsJSON = await Deno.readTextFile(Deno.args[0]);
const tasksJSON = await Deno.readTextFile(Deno.args[1]);

const actionsRoute = {
  createLoan: (action) => {
    createLoanService(action.loanIdentifier);
  },
  createBorrower: (action) => {
    createLoanService({borrowerId: action.borrowerId, loanId: action.loanIdentifier});
  },
  setLoanField: (action) => {
    createLoanService(action.loanIdentifier);
  },
  setBorrowerField: (action) => {

  },
};
