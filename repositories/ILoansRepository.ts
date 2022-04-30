import {ID} from "../types.ts";
import {Loan} from "../entities/Loan.ts";

export interface ILoansRepository {
  findByID(id: ID): Loan | undefined;
  save(id: ID, loan: Loan): void;
}
