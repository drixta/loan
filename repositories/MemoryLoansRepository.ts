import { IEntitiesRepository } from "./IEntitiesRepository.ts";
import {
  EntityStore,
  MemoryEntityRepository,
} from "./MemoryEntityRepository.ts";
import { Loan } from "../entities/Loan.ts";

const loanStore: EntityStore<Loan> = new Map();

export class MemoryLoansRepository extends MemoryEntityRepository<Loan>
  implements IEntitiesRepository<Loan> {
  constructor() {
    super(loanStore);
  }
}
