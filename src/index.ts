import { ITeam, TeamRole, toggleModal } from "./class/teams"
import { TeamsManager } from "./class/projectsManager"

const teamsListUI = document.getElementById("teams-list") as HTMLElement
const teamsManager = new TeamsManager(teamsListUI)

const newTeamBtn = document.getElementById("new-team-btn")
const teamForm = document.getElementById("new-team-form")
const cancelNewTeamBtn = document.getElementById("cancel-new-team-btn")
const submitNewTeamBtn = document.getElementById("submit-new-team-btn")

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
      const team = teamsManager.newTeam(teamData)
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
  console.warn("The project form was not found. Check the ID!")
}

const closeTeamInfoPopup = document.getElementById("close-team-info-popup")
if (closeTeamInfoPopup) {
  closeTeamInfoPopup.addEventListener("click", () => {
    toggleModal("team-info-popup");
  })
}
