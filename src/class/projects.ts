// Importing necessary dependencies and modules
import { v4 as uuidv4 } from 'uuid';

// Define types for project status, project type, and team role
export type ProjectStatus = "Pending" | "Active" | "Finished";
export type ProjectType = "Residential" | "Commercial" | "Institutional" | "Mixed-use" | "Industrial" | "Heavy civil";
export type TeamRole = "BIM Manager" | "Structural" | "MEP" | "Architect" | "Contractor";

// Define the structure for a team
export interface ITeam {
  teamName: string;
  teamRole: TeamRole;
  teamDescription: string;
  contactName: string;
  contactPhone: string;
  teamProjectId: string;
}

// Define the structure for a project
export interface IProject {
  projectName: string;
  projectDescription: string;
  projectStatus: ProjectStatus;
  projectCost: string;
  projectType: ProjectType;
  projectAddress: string;
  projectFinishDate: Date;
  projectProgress: string;
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
  projectType: "Residential" | "Commercial" | "Institutional" | "Mixed-use" | "Industrial" | "Heavy civil";
  projectAddress: string;
  projectFinishDate: Date;
  projectProgress: string;

  id: string;

  constructor(data: IProject, id = uuidv4()) {
    // Initialize properties with data
    for (const key in data) {
      this[key] = data[key];
    }
    this.id = id;
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

  // Class internals
  // ui: HTMLDivElement;
  id: string;

  constructor(data: ITeam, id = uuidv4()) {
    // Initialize properties with data
    for (const key in data) {
      this[key] = data[key];
    }
    this.id = id;
    // Set up the UI for the team
    // this.setTeamUI();
  }

  // // Method to create the team card UI
  // setTeamUI() {
  //   // Check if UI element already exists
  //   if (this.ui) { return; }
  //   // Map team role to corresponding material icon
  //   const roleToIcon: Record<TeamRole, string> = {
  //     "BIM Manager": "computer",
  //     "Structural": "foundation",
  //     "MEP": "plumbing",
  //     "Architect": "architecture",
  //     "Contractor": "construction"
  //   };
  //   // Select the appropriate icon or use a default ("computer")
  //   const icon = roleToIcon[this.teamRole] || "computer";
  //   // Create a div element for the team card
  //   this.ui = document.createElement("div");
  //   this.ui.className = "team-card";
  //   // Set inner HTML with material icon, team role, and team name
  //   this.ui.innerHTML = `
  //   <span class="material-icons-round" style="padding: 10px; background-color: #686868; border-radius: 10px; font-size: 20px;">${icon}</span>
  //   <p>${this.teamRole}</p>
  //   <p>${this.teamName}</p>
  //   `;
  //   // Add click interaction to display team information
  //   this.ui.addEventListener("click", (e) => {
  //     e.preventDefault();
  //     updateTeamInfo(this);
  //     toggleModal("team-info-popup");
  //   });
  // }
}
