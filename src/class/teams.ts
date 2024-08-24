import { v4 as uuidv4 } from "uuid";
import * as OBC from "openbim-components";

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
  fragmentMap?: OBC.FragmentIdMap | { [k: string]: string[] };
  camera?:
    | { position: THREE.Vector3; target: THREE.Vector3 }
    | {
        position: { x: number; y: number; z: number };
        target: { x: number; y: number; z: number };
      };
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
  fragmentMap?: OBC.FragmentIdMap;
  camera?: { position: THREE.Vector3; target: THREE.Vector3 };

  constructor(data: ITeam, id = uuidv4()) {
    for (const key in data) {
      this[key] = data[key];
    }
    this.id = id;
  }

  onCardClick = new OBC.Event();

  get numberOfElements(): number {
    if (!this.fragmentMap) return 0;

    let totalElements = 0;
    for (const set of Object.values(this.fragmentMap)) {
      totalElements += set.size;
    }
    return totalElements;
  }
}
