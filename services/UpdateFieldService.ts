import { EntityType, ID } from "../types.ts";
import { IEntitiesRepository } from "../repositories/IEntitiesRepository.ts";
import { MemoryLoansRepository } from "../repositories/MemoryLoansRepository.ts";
import { MemoryBorrowersRepository } from "../repositories/MemoryBorrowersRepository.ts";
import { cloneInstance } from "../utils/cloneInstance.ts";

interface UpdateFieldRequestParams {
  id: ID;
  field: string;
  value: string | number | null;
}

export class UpdateFieldService<T> {
  private repository: IEntitiesRepository<T>;
  constructor(repository: IEntitiesRepository<T>) {
    this.repository = repository;
  }

  execute(data: UpdateFieldRequestParams) {
    const entity = this.repository.findByID(data.id);
    if (!entity) {
      throw new Error("Cannot update non-existent entity");
    }

    const clonedEntity = cloneInstance<T>(entity);
    // @ts-ignore
    clonedEntity[data.field] = data.value;
    this.repository.save(data.id, clonedEntity);
  }
}

export const updateLoanService = new UpdateFieldService(
  new MemoryLoansRepository(),
);
export const updateBorrowerService = new UpdateFieldService(
  new MemoryBorrowersRepository(),
);
