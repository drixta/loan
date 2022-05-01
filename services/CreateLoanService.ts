import { ID } from "../types.ts";
import { IEntitiesRepository } from "../repositories/IEntitiesRepository.ts";
import { MemoryLoansRepository } from "../repositories/MemoryLoansRepository.ts";
import { Loan } from "../entities/Loan.ts";

interface CreateLoanRequestParams {
  id: ID;
}

export class CreateLoanService {
  private loansRepository: IEntitiesRepository<Loan> =
    new MemoryLoansRepository();

  execute(data: CreateLoanRequestParams) {
    const loanAlreadyExists = this.loansRepository.findByID(data.id);
    if (loanAlreadyExists) {
      throw new Error("Loan already exists.");
    }
    const loan = new Loan(data);
    this.loansRepository.save(data.id, loan);
  }
}

export const createLoanService = new CreateLoanService();
