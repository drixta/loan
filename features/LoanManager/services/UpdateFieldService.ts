import { IEntitiesRepository } from "../repositories/IEntitiesRepository.ts";
import { MemoryLoansRepository } from "../repositories/MemoryLoansRepository.ts";
import { MemoryBorrowersRepository } from "../repositories/MemoryBorrowersRepository.ts";
import { EntityType, ID } from "../../../types.ts";
import { fifoEventBus } from "../../../providers/fifoEventBus.ts";
import { cloneInstance } from "../../../utils/cloneInstance.ts";

interface UpdateFieldRequestParams {
  actionName: string;
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

  execute({ id, field, value, actionName }: UpdateFieldRequestParams) {
    const entity = this.repository.findByID(id);
    if (!entity) {
      throw new Error("Cannot update non-existent entity");
    }

    const clonedEntity = cloneInstance<T>(entity);
    (clonedEntity as any)[field] = value;
    this.repository.save(id, clonedEntity);
    fifoEventBus.publishSync(`${this.type}.update.completed`, {
      field,
      entityID: id,
      type: this.type,
      actionName: actionName,
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
