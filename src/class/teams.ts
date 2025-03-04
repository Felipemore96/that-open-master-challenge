import { v4 as uuidv4 } from "uuid";
import { FragmentIdMap } from "@thatopen/fragments";
import * as OBC from "@thatopen/components";

export type TeamRole =
  | "BIM Manager"
  | "Structural"
  | "MEP"
  | "Architect"
  | "Contractor";

// Define the structure for a team
export interface ITeam {
  teamName: string;
  teamRole: TeamRole;
  teamDescription: string;
  contactName: string;
  contactPhone: string;
  teamProjectId: string;
  id?: string;
  ifcGuids: string;
  camera: string;
}

export interface TeamModalData {
  teamName: string;
  teamRole: TeamRole;
  teamDescription: string;
  contactName: string;
  contactPhone: string;
}

// Class representing a team
export class Team implements ITeam {
  // Properties to satisfy ITeam
  teamName: string;
  teamRole: "BIM Manager" | "Structural" | "MEP" | "Architect" | "Contractor";
  teamDescription: string;
  contactName: string;
  contactPhone: string;
  teamProjectId: string;

  id: string;
  ifcGuids: string;
  camera: string;

  constructor(data: ITeam, id = uuidv4()) {
    for (const key in data) {
      this[key] = data[key];
    }
    this.id = id;
  }

  onCardClick = new OBC.Event();

  get numberOfElements(): number {
    if (!this.ifcGuids) return 0;
    const totalElements = JSON.parse(this.ifcGuids).length;

    return totalElements;
  }
}
