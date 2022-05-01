import { ID } from "../types.ts";
import { IEntitiesRepository } from "../repositories/IEntitiesRepository.ts";
import { MemoryLoansRepository } from "../repositories/MemoryLoansRepository.ts";
import { Loan } from "../entities/Loan.ts";
import { fifoEventBus } from "../providers/fifoEventBus.ts";

interface CreateLoanRequestParams {
  id: ID;
}

export class CreateLoanService {
  private loansRepository: IEntitiesRepository<Loan> =
    new MemoryLoansRepository();

  execute({ id }: CreateLoanRequestParams) {
    const loanAlreadyExists = this.loansRepository.findByID(id);
    if (loanAlreadyExists) {
      throw new Error("Loan already exists.");
    }
    const loan = new Loan({ id });
    this.loansRepository.save(id, loan);
    fifoEventBus.publishSync("loan.create.completed", { id });
  }
}

export const createLoanService = new CreateLoanService();
