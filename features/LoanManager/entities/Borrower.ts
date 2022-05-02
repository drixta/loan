import { ID } from "../../../types.ts";

export class Borrower {
  public readonly id: ID;
  public firstName?: string;
  public lastName?: string;
  public address?: string;
  public birthYear?: number;

  constructor(props: Borrower) {
    this.id = props.id;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.address = props.address;
    this.birthYear = props.birthYear;
  }
}
