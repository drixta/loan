import {ID} from "../../../types.ts";

export class Loan {
  public readonly id: ID;
  public loanAmount?: number;
  public loanType?: string;
  public purchasePrice?: number;
  public propertyAddress?: string;
  public borrowerID?: string[];

  constructor(props: Loan) {
    this.id = props.id;
    this.loanAmount = props.loanAmount;
    this.loanType = props.loanType;
    this.purchasePrice = props.purchasePrice;
    this.propertyAddress = props.propertyAddress;
    this.borrowerID = props.borrowerID || [];
  }
}
