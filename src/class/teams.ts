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
  fragmentMap?: OBC.FragmentIdMap;
  camera?: { position: THREE.Vector3; target: THREE.Vector3 };
}

// DOM element to display team information
const teamInfo = document.getElementById("team-info") as HTMLElement;

// Function to update team information in the UI
function updateTeamInfo(team: Team) {
  if (team) {
    teamInfo.innerHTML = `
      <p>Company in charge: ${team.teamName}</p>
      <p>Company's role: ${team.teamRole}</p>
      <p>Description: ${team.teamDescription}</p>
      <p>Contact Name: ${team.contactName}</p>
      <p>Phone number: ${team.contactPhone}</p>
      <p>Project: Arreglar esto !!!</p>`;
  }
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
}
