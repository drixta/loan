import { TaskDefinition } from "./repositories/ITaskDefsRepository.ts";
import { taskDefInitializationService } from "./services/TaskDefInitializationService.ts";
import { red } from "https://deno.land/std@0.137.0/fmt/colors.ts";
import { printf } from "https://deno.land/std@0.137.0/fmt/printf.ts";
import { actionsRoute } from "./controllers.ts";
import { Action } from "./types.ts";

if (!Deno.args?.length && Deno.args.length !== 2) {
  printf(
    red(
      "Missing parameters: Provide path for actions.json and tasks.json files when running this program\n",
    ),
  );
  Deno.exit(1);
}
const actionsJSON = await Deno.readTextFile(Deno.args[0]);
const tasksJSON = await Deno.readTextFile(Deno.args[1]);

const formatTaskDef = (tasksDef: TaskDefinition) => {
  return {
    ...tasksDef,
    entity: tasksDef.entity.toLowerCase().trim(),
  };
};

export const initializeTaskDefinition = () => {
  const taskDefs = JSON.parse(tasksJSON).map((
    taskDef: TaskDefinition,
  ) => formatTaskDef(taskDef));
  taskDefInitializationService.execute(taskDefs);
};

export const executeActions = () => {
  JSON.parse(actionsJSON).forEach((action: Action) => {
    const actionName: string = action.action;
    actionsRoute[actionName](action);
  });
};
initializeTaskDefinition();
executeActions();
