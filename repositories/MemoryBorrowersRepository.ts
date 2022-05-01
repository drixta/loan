import { IEntitiesRepository } from "./IEntitiesRepository.ts";
import { EntityStore, MemoryRepository } from "./MemoryRepository.ts";
import { Borrower } from "../entities/Borrower.ts";

const borrowerStore: EntityStore<Borrower> = new Map();

export class MemoryBorrowersRepository extends MemoryRepository<Borrower>
  implements IEntitiesRepository<Borrower> {
  constructor() {
    super(borrowerStore);
  }
}
