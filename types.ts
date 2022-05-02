export type ID = string;
export type EntityType = "loan" | "borrower";

export type FieldValue = string | number | null;

export interface CreateLoanAction {
  action: "createLoan";
  loanIdentifier: ID;
}

export interface CreateBorrowerAction {
  action: "createBorrower";
  loanIdentifier: ID;
  borrowerIdentifier: ID;
}

export interface SetLoanFieldAction {
  action: "setLoanField";
  loanIdentifier: ID;
  field: string;
  value: FieldValue;
}

export interface SetLoanFieldAction {
  action: "setLoanField";
  loanIdentifier: ID;
  field: string;
  value: FieldValue;
}
export interface SetBorrowerFieldAction {
  action: "setBorrowerField";
  borrowerIdentifier: ID;
  field: string;
  value: FieldValue;
}

export type Action =
  | CreateLoanAction
  | CreateBorrowerAction
  | SetLoanFieldAction
  | SetBorrowerFieldAction;
