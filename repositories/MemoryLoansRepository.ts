import { IEntitiesRepository } from "./IEntitiesRepository.ts";
import { EntityStore, MemoryRepository } from "./MemoryRepository.ts";
import { Loan } from "../entities/Loan.ts";

const loanStore: EntityStore<Loan> = new Map();

export class MemoryLoansRepository extends MemoryRepository<Loan>
  implements IEntitiesRepository<Loan> {
  constructor() {
    super(loanStore);
  }
}
