import { IProject, ProjectStatus, ProjectType, ITeam, TeamRole, toggleModal} from "../src/class/projects"
import { ProjectsManager } from "./class/projectsManager"

const projectsListUI = document.getElementById("projects-list") as HTMLElement
const projectsManager = new ProjectsManager(projectsListUI)

const projectForm = document.getElementById("new-project-form")
const cancelNewProjectBtn = document.getElementById("cancel-new-project-btn")
const submitNewProjectBtn = document.getElementById("submit-new-project-btn")
const newTeamBtn = document.getElementById("new-team-btn")
const teamForm = document.getElementById("new-team-form")
const cancelNewTeamBtn = document.getElementById("cancel-new-team-btn")
const submitNewTeamBtn = document.getElementById("submit-new-team-btn")

const newProjectBtn = document.getElementById("new-project-btn")
if (newProjectBtn) {
  newProjectBtn.addEventListener("click", () => {toggleModal("new-project-modal")})
} else {
  console.warn("New projects button was not found")
}

if (newTeamBtn) {
  newTeamBtn.addEventListener("click", () => {toggleModal("new-team-modal")})
} else {
  console.warn("New projects button was not found")
}

const closeErrorPopup = document.getElementById("close-error-popup")
if (closeErrorPopup) {
  closeErrorPopup.addEventListener("click", () => {
    toggleModal("error-popup");
  });
}

if (projectForm && projectForm instanceof HTMLFormElement) {
  submitNewProjectBtn?.addEventListener("click", (e) => {
    e.preventDefault()
    const formData = new FormData(projectForm)
    const projectData: IProject = {
      projectName: formData.get("project-name") as string,
      projectDescription: formData.get("project-description") as string,
      projectStatus: formData.get("project-status") as ProjectStatus,
      projectCost: formData.get("project-cost") as string,
      projectType: formData.get("project-type") as ProjectType,
      projectAddress: formData.get("project-address") as string,
      projectFinishDate: new Date(formData.get("finishDate") as string),
      projectProgress: formData.get("project-progress") as string,
      projectTeams: []
    }
    try {
      const project = projectsManager.newProject(projectData)
      console.log(project)
      projectForm.reset()
      toggleModal("new-project-modal")
    } catch (err) {
      const errorMessage = document.getElementById("err") as HTMLElement
      errorMessage.textContent = err
      toggleModal("error-popup")
    }
  })
  cancelNewProjectBtn?.addEventListener("click", () => {
    projectForm.reset()
    toggleModal("new-project-modal") 
  })
} else {
  console.warn("The project form was not found. Check the ID!")
}

if (teamForm && teamForm instanceof HTMLFormElement) {
  submitNewTeamBtn?.addEventListener("click", (e) => {
    e.preventDefault()
    const formData = new FormData(teamForm)
    const teamData: ITeam = {
      teamName: formData.get("teamName") as string,
      teamRole: formData.get("teamRole") as TeamRole,
      teamDescription: formData.get("teamDescription") as string,
      contactName: formData.get("contactName") as string,
      contactPhone: formData.get("contactPhone") as string
    }
    try {
      const team = projectsManager.newTeam(teamData)
      teamForm.reset()
      toggleModal("new-team-modal")
    } catch (err) {
      const errorMessage = document.getElementById("err") as HTMLElement
      errorMessage.textContent = err
      toggleModal("error-popup")
    }
  })
  cancelNewTeamBtn?.addEventListener("click", () => {
    teamForm.reset()
    toggleModal("new-team-modal") 
  })
} else {
  console.warn("The team form was not found. Check the ID!")
}

const closeTeamInfoPopup = document.getElementById("close-team-info-popup")
if (closeTeamInfoPopup) {
  closeTeamInfoPopup.addEventListener("click", () => {
    toggleModal("team-info-popup");
  })
}

const exportProjectsBtn = document.getElementById("export-projects-btn")
if (exportProjectsBtn) {
  exportProjectsBtn.addEventListener("click", () => {
    projectsManager.exportToJSON()
  })
}


