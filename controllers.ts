import { fifoEventBus } from "./providers/fifoEventBus.ts";
import { taskInitializationService } from "./services/TaskInitializationService.ts";
import { taskResolverService } from "./services/TaskResolverService.ts";

fifoEventBus.subscribe(
  "loan.create.completed",
  (_message: string, params: any) => {
    taskInitializationService.execute({ entityID: params.id, type: "loan" });
  },
);

fifoEventBus.subscribe(
  "borrower.create.completed",
  (_message: string, params: any) => {
    taskInitializationService.execute({
      entityID: params.id,
      type: "borrower",
    });
  },
);

fifoEventBus.subscribe(
  "loan.update.completed",
  (_message: string, params: any) => {
    taskResolverService.execute({
      type: "loan",
      field: params.field,
      entityID: params.entityID,
    });
  },
);

fifoEventBus.subscribe(
  "borrower.update.completed",
  (_message: string, params: any) => {
    taskResolverService.execute({
      type: "borrower",
      field: params.field,
      entityID: params.entityID,
    });
  },
);
