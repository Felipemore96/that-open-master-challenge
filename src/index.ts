// Import necessary types and functions from project files
import {
  IProject,
  ProjectStatus,
  ProjectType,
  ITeam,
  TeamRole,
  toggleModal,
  Project
} from "../src/class/projects";
import { ProjectsManager } from "./class/projectsManager";

// DOM elements
const projectsListUI = document.getElementById("projects-list") as HTMLElement;
const projectForm = document.getElementById("new-project-form") as HTMLFormElement;
const cancelNewProjectBtn = document.getElementById("cancel-new-project-btn");
const submitNewProjectBtn = document.getElementById("submit-new-project-btn");
const newTeamBtn = document.getElementById("new-team-btn");
const teamForm = document.getElementById("new-team-form") as HTMLFormElement;
const cancelNewTeamBtn = document.getElementById("cancel-new-team-btn");
const submitNewTeamBtn = document.getElementById("submit-new-team-btn");
const newProjectBtn = document.getElementById("new-project-btn");
const closeErrorPopup = document.getElementById("close-error-popup");
const closeTeamInfoPopup = document.getElementById("close-team-info-popup");
const exportProjectsBtn = document.getElementById("export-projects-btn");
const navProjectsBtn = document.getElementById("nav-projects-btn");

// ProjectsManager instance
const projectsManager = new ProjectsManager(projectsListUI);

// Event listeners

// Event listener for opening the "New Project" modal
if (newProjectBtn) {
  newProjectBtn.addEventListener("click", () => {
    toggleModal("new-project-modal");
  });
} else {
  console.warn("New project button was not found");
}

// Event listener for opening the "New Team" modal
if (newTeamBtn) {
  newTeamBtn.addEventListener("click", () => {
    toggleModal("new-team-modal");
  });
} else {
  console.warn("New team button was not found");
}

// Event listener for closing the error popup modal
if (closeErrorPopup) {
  closeErrorPopup.addEventListener("click", () => {
    toggleModal("error-popup");
  });
}

// Event listener for submitting a new project form
if (projectForm) {
  submitNewProjectBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    // Gather form data and create a new project
    const formData = new FormData(projectForm);
    const projectData: IProject = {
      projectName: formData.get("project-name") as string,
      projectDescription: formData.get("project-description") as string,
      projectStatus: formData.get("project-status") as ProjectStatus,
      projectCost: formData.get("project-cost") as string,
      projectType: formData.get("project-type") as ProjectType,
      projectAddress: formData.get("project-address") as string,
      projectFinishDate: new Date(formData.get("finishDate") as string),
      projectProgress: formData.get("project-progress") as string
    };
    try {
      // Attempt to create a new project
      const project = projectsManager.newProject(projectData);
      projectForm.reset();
      toggleModal("new-project-modal");
    } catch (err) {
      // Display an error message in case of an exception
      const errorMessage = document.getElementById("err") as HTMLElement;
      errorMessage.textContent = err;
      toggleModal("error-popup");
    }
  });
  // Event listener for canceling the new project form
  cancelNewProjectBtn?.addEventListener("click", () => {
    projectForm.reset();
    toggleModal("new-project-modal");
  });
} else {
  console.warn("The project form was not found. Check the ID!");
}

// Event listener for submitting a new team form
if (teamForm) {
  submitNewTeamBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    // Gather form data and create a new team
    const formData = new FormData(teamForm);
    const teamData: ITeam = {
      teamName: formData.get("teamName") as string,
      teamRole: formData.get("teamRole") as TeamRole,
      teamDescription: formData.get("teamDescription") as string,
      contactName: formData.get("contactName") as string,
      contactPhone: formData.get("contactPhone") as string,
      teamProject: projectsManager.teamProject
    };
    try {
      // Attempt to create a new team
      const team = projectsManager.newTeam(teamData);
      teamForm.reset();
      toggleModal("new-team-modal");
    } catch (err) {
      // Display an error message in case of an exception
      const errorMessage = document.getElementById("err") as HTMLElement;
      errorMessage.textContent = err;
      toggleModal("error-popup");
    }
  });
  // Event listener for canceling the new team form
  cancelNewTeamBtn?.addEventListener("click", () => {
    teamForm.reset();
    toggleModal("new-team-modal");
  });
} else {
  console.warn("The team form was not found. Check the ID!");
}

// Event listener for closing the team info popup modal
if (closeTeamInfoPopup) {
  closeTeamInfoPopup.addEventListener("click", () => {
    toggleModal("team-info-popup");
  });
}

// Event listener for exporting projects to JSON
if (exportProjectsBtn) {
  exportProjectsBtn.addEventListener("click", () => {
    projectsManager.exportToJSON();
  });
}

const importProjectsBtn = document.getElementById("import-projects-btn")
if (importProjectsBtn) {
  importProjectsBtn.addEventListener("click", () => {
    projectsManager.importFromJSON()
  })
}

// Event listener for showing project info
if (projectsListUI) {
  projectsListUI.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const projectId = target.dataset.projectId;    
    if (projectId) {
      const clickedProject = projectsManager.projectsList.find((project) => project.id === projectId);
      if (clickedProject) {
        projectsManager.showProjectDetails(clickedProject);
      }
    }
  });
}