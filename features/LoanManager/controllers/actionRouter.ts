import {CreateBorrowerAction, CreateLoanAction, SetBorrowerFieldAction, SetLoanFieldAction} from "../../../types.ts";
import {createLoanService} from "../services/CreateLoanService.ts";
import {createBorrowerService} from "../services/CreateBorrowerService.ts";
import {updateBorrowerService, updateLoanService} from "../services/UpdateFieldService.ts";

export const actionsRoute: { [actionName: string]: Function } = {
  createLoan: (action: CreateLoanAction) => {
    createLoanService.execute({ id: action.loanIdentifier });
  },
  createBorrower: (action: CreateBorrowerAction) => {
    createBorrowerService.execute({
      borrowerID: action.borrowerIdentifier,
      loanID: action.loanIdentifier,
    });
  },
  setLoanField: (action: SetLoanFieldAction) => {
    const { loanIdentifier, field, value } = action;
    updateLoanService.execute({ id: loanIdentifier, field, value });
  },
  setBorrowerField: (
    { borrowerIdentifier, field, value }: SetBorrowerFieldAction,
  ) => {
    updateBorrowerService.execute({ id: borrowerIdentifier, field, value });
  },
};
