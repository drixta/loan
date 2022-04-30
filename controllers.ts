import {printf} from "https://deno.land/std@0.137.0/fmt/printf.ts";
import {red} from "https://deno.land/std@0.137.0/fmt/colors.ts";

if (!Deno.args?.length && Deno.args.length === 2) {
  printf(red('Missing parameters: Provide path for actions.json and tasks.json files when running this program\n'));
}

const actionsJSONPath = Deno.args[0];
const tasksJSONPath = Deno.args[1];
console.log(actionsJSONPath, tasksJSONPath);
