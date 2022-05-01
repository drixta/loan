import { ID } from "../types.ts";
import { IEntitiesRepository } from "../repositories/IEntitiesRepository.ts";
import { Loan } from "../entities/Loan.ts";
import { Borrower } from "../entities/Borrower.ts";
import { MemoryBorrowersRepository } from "../repositories/MemoryBorrowersRepository.ts";
import { MemoryLoansRepository } from "../repositories/MemoryLoansRepository.ts";
import { fifoEventBus } from "../providers/fifoEventBus.ts";

interface CreateBorrowerRequestParams {
  borrowerID: ID;
  loanID: ID;
}

export class CreateBorrowerService {
  private borrowersRepository: IEntitiesRepository<Borrower> =
    new MemoryBorrowersRepository();
  private loansRepository: IEntitiesRepository<Loan> =
    new MemoryLoansRepository();

  execute({ borrowerID, loanID }: CreateBorrowerRequestParams) {
    const borrowerAlreadyExists = this.borrowersRepository.findByID(
      borrowerID,
    );
    if (borrowerAlreadyExists) {
      throw new Error("Borrower already exists.");
    }
    const borrower = new Borrower({ id: borrowerID });
    this.borrowersRepository.save(borrowerID, borrower);
    const loan = this.loansRepository.findByID(loanID);
    if (loan?.borrowerID) {
      loan.borrowerID.push(borrowerID);
    }
    fifoEventBus.publishSync("borrower.create.completed", {
      borrowerID,
      loanID,
    });
  }
}

export const createBorrowerService = new CreateBorrowerService();
