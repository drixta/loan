import { IEntitiesRepository } from "./IEntitiesRepository.ts";
import {
  EntityStore,
  MemoryEntityRepository,
} from "./MemoryEntityRepository.ts";
import { Borrower } from "../entities/Borrower.ts";

const borrowerStore: EntityStore<Borrower> = new Map();

export class MemoryBorrowersRepository extends MemoryEntityRepository<Borrower>
  implements IEntitiesRepository<Borrower> {
  constructor() {
    super(borrowerStore);
  }
}
