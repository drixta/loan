[
  {
    "action": "createLoan",
    "loanIdentifier": "loan1"
  },
  {
    "action": "createBorrower",
    "loanIdentifier": "loan1",
    "borrowerIdentifier": "borr1"
  },
  {
    "action": "createBorrower",
    "loanIdentifier": "loan1",
    "borrowerIdentifier": "borr2"
  },
  {
    "action": "setLoanField",
    "loanIdentifier": "loan1",
    "field": "loanAmount",
    "value": 100000
  },
  {
    "action": "setLoanField",
    "loanIdentifier": "loan1",
    "field": "loanType",
    "value": "Purchase"
  },
  // "Require purchase price for purchase loans" for loan1 should be created here
  {
    "action": "setBorrowerField",
    "borrowerIdentifier": "borr1",
    "field": "firstName",
    "value": "Jane"
  },
  {
    "action": "setBorrowerField",
    "borrowerIdentifier": "borr1",
    "field": "lastName",
    "value": "Smith"
  },
  // "Require address for borrower" created for borr1 here
  {
    "action": "setBorrowerField",
    "borrowerIdentifier": "borr2",
    "field": "firstName",
    "value": "John"
  },
  {
    "action": "setBorrowerField",
    "borrowerIdentifier": "borr2",
    "field": "lastName",
    "value": "Smith"
  },
  // "Require address for borrower" created for borr 2 here
  {
    "action": "setBorrowerField",
    "borrowerIdentifier": "borr2",
    "field": "firstName",
    "value": null
  },
  // "Require address for borrower" cancelled for borr 2 here
  {
    "action": "setLoanField",
    "loanIdentifier": "loan1",
    "field": "purchasePrice",
    "value": 500000
  },
  // "Require purchase price for purchase loans" for loan1 completed here
  {
    "action": "setBorrowerField",
    "borrowerIdentifier": "borr2",
    "field": "firstName",
    "value": "Joseph"
  },
  // "Require address for borrower" moved from cancelled to open for borr 2 here
  {
    "action": "setBorrowerField",
    "borrowerIdentifier": "borr2",
    "field": "address",
    "value": "500 California St."
  }
  // "Require address for borrower" completed for borr 2 here
]
