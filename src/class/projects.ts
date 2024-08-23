export type ProjectStatus = "Pending" | "Active" | "Finished";
export type ProjectType =
  | "Residential"
  | "Commercial"
  | "Institutional"
  | "Mixed-use"
  | "Industrial"
  | "Heavy civil";

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

  constructor(data: IProject, id: string) {
    // Initialize properties with data
    for (const key in data) {
      if (key === "fragRoute") {
        this.fragRoute = data[key];
      } else if (key === "jsonRoute") {
        this.jsonRoute = data[key];
      } else {
        this[key] = data[key];
      }
    }
    this.id = id;
    console.log(id);
  }
}
