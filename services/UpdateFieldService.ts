import { EntityType, ID } from "../types.ts";
import { IEntitiesRepository } from "../repositories/IEntitiesRepository.ts";
import { MemoryLoansRepository } from "../repositories/MemoryLoansRepository.ts";
import { MemoryBorrowersRepository } from "../repositories/MemoryBorrowersRepository.ts";
import { cloneInstance } from "../utils/cloneInstance.ts";
import { fifoEventBus } from "../providers/fifoEventBus.ts";

interface UpdateFieldRequestParams {
  id: ID;
  field: string;
  value: string | number | null;
}

class UpdateFieldService<T> {
  private readonly repository: IEntitiesRepository<T>;
  private readonly type: EntityType;
  constructor(type: EntityType, repository: IEntitiesRepository<T>) {
    this.repository = repository;
    this.type = type;
  }

  execute(params: UpdateFieldRequestParams) {
    const { id, field, value } = params;
    const entity = this.repository.findByID(id);
    if (!entity) {
      throw new Error("Cannot update non-existent entity");
    }

    const clonedEntity = cloneInstance<T>(entity);
    // @ts-ignore
    clonedEntity[field] = value;
    this.repository.save(id, clonedEntity);
    fifoEventBus.publishSync(`${this.type}.update.completed`, {
      ...params,
      entity: clonedEntity,
      type: this.type,
    });
  }
}

export const updateLoanService = new UpdateFieldService(
  "loan",
  new MemoryLoansRepository(),
);
export const updateBorrowerService = new UpdateFieldService(
  "borrower",
  new MemoryBorrowersRepository(),
);
