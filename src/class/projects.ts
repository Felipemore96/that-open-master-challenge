import { v4 as uuidv4 } from "uuid";
import * as OBC from "openbim-components";

export type ProjectStatus = "Pending" | "Active" | "Finished";
export type ProjectType =
  | "Residential"
  | "Commercial"
  | "Institutional"
  | "Mixed-use"
  | "Industrial"
  | "Heavy civil";
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

// New created projects
export interface IProject {
  projectName: string;
  projectDescription: string;
  projectStatus: ProjectStatus;
  projectCost: string;
  projectType: ProjectType;
  projectAddress: string;
  projectFinishDate: Date;
  projectProgress: string;
  id?: string;
  fragRoute?: string;
  jsonRoute?: string;
}

// Function to toggle a modal based on its ID
export function toggleModal(id: string) {
  const modal = document.getElementById(id);
  if (modal && modal instanceof HTMLDialogElement) {
    if (modal.open) {
      modal.close();
    } else modal.showModal();
  } else {
    console.warn("The provided modal wasn't found. ID: ", id);
  }
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

// Class representing a project
export class Project implements IProject {
  // Properties to satisfy IProject
  projectName: string;
  projectDescription: string;
  projectStatus: "Pending" | "Active" | "Finished";
  projectCost: string;
  projectType:
    | "Residential"
    | "Commercial"
    | "Institutional"
    | "Mixed-use"
    | "Industrial"
    | "Heavy civil";
  projectAddress: string;
  projectFinishDate: Date;
  projectProgress: string;

  id: string;
  fragRoute?: string;
  jsonRoute?: string;

  constructor(data: IProject, id = uuidv4()) {
    // Initialize properties with data
    for (const key in data) {
      if (key === "id") {
        this.id = data[key] || id;
      } else if (key === "fragRoute") {
        this.fragRoute = data[key];
      } else if (key === "jsonRoute") {
        this.jsonRoute = data[key];
      } else {
        this[key] = data[key];
      }
    }
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
