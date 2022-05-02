import { fifoEventBus } from "../../../providers/fifoEventBus.ts";
import { taskInitializationService } from "../services/TaskInitializationService.ts";
import { taskResolverService } from "../services/TaskResolverService.ts";
import { CreateEvent, UpdateEvent } from "./interfaces.ts";

export const initializeSubscriptionHandlers = () => {
  fifoEventBus.subscribe(
    "loan.create.completed",
    (_message: string, params: CreateEvent) => {
      taskInitializationService.execute({ entityID: params.id, type: "loan" });
    },
  );
  fifoEventBus.subscribe(
    "borrower.create.completed",
    (_message: string, params: CreateEvent) => {
      taskInitializationService.execute({
        entityID: params.id,
        type: "borrower",
      });
    },
  );
  fifoEventBus.subscribe(
    "loan.update.completed",
    (_message: string, { field, entityID, actionName }: UpdateEvent) => {
      taskResolverService.execute({
        type: "loan",
        field,
        entityID,
        actionName,
      });
    },
  );
  fifoEventBus.subscribe(
    "borrower.update.completed",
    (_message: string, { field, entityID, actionName }: UpdateEvent) => {
      taskResolverService.execute({
        type: "borrower",
        field,
        entityID,
        actionName,
      });
    },
  );
};
