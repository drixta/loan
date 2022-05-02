import { EntityType, ID } from "../../../types.ts";

export interface CreateEvent {
  id: ID;
}

export interface UpdateEvent {
  actionName: string;
  field: string;
  entityID: ID;
  type: EntityType;
}
