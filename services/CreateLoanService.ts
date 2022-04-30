import { ID } from "../types.ts";
import { ILoansRepository } from "../repositories/ILoansRepository.ts";
import { MemoryLoansRepository } from "../repositories/MemoryLoansRepository.ts";
import { Loan } from "../entities/Loan.ts";

interface CreateUserRequestParams {
  id: ID;
}

export class CreateLoanService {
  private loansRepository: ILoansRepository = new MemoryLoansRepository();

  execute(data: CreateUserRequestParams) {
    const loanAlreadyExists = this.loansRepository.findByID(data.id);
    if (loanAlreadyExists) {
      throw new Error("Loan already exists.");
    }
    const loan = new Loan(data);
    this.loansRepository.save(data.id, loan);
  }
}

export const createLoanService = new CreateLoanService();
