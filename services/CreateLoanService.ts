import {ID} from "../types.ts";
import {ILoansRepository} from "../repositories/ILoansRepository.ts";
import {MemoryLoansRepository} from "../repositories/MemoryLoansRepository.ts";
import {Loan} from "../entities/Loan.ts";

interface CreateUserRequestParams {
  id: ID;
}

export class CreateLoanService {
  private loansRepository:ILoansRepository = new MemoryLoansRepository();

  async execute(data: CreateUserRequestParams) {
    const loanAlreadyExists = await this.loansRepository.findByID(data.id);
    if (loanAlreadyExists) {
      throw new Error("Loan already exists.");
    }
    const loan = new Loan(data);
    await this.loansRepository.save(loan);
  };
}
