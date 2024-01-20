import { v4 as uuidv4 } from 'uuid'

export type ProjectStatus = "Pending" | "Active" | "Finished"
export type ProjectType = "Residential" | "Commercial" | "Institutional" | "Mixed-use" | "Industrial" | "Heavy civil"
export type TeamRole = "BIM Manager" | "Structural" | "MEP" | "Architect" | "Contractor"

export interface ITeam {
    teamName: string
    teamRole: TeamRole
    teamDescription: string
    contactName: string
    contactPhone: string
}

export interface IProject {
    projectName: string
    projectDescription: string
    projectStatus: ProjectStatus
    projectCost: string
    projectType: ProjectType
    projectAddress: string
    projectFinishDate: Date
    projectProgress: string
    projectTeams: ITeam
}

export function toggleModal(id: string) {
    const modal = document.getElementById(id)
    if (modal && modal instanceof HTMLDialogElement) {
      if (modal.open) {
        modal.close()
      } else modal.showModal()
    } else {
      console.warn("The provided modal wasn't found. ID: ", id)
    }
}

const teamInfo = document.getElementById("team-info") as HTMLElement
function updateTeamInfo(team: Team) {
  if (team) {
    teamInfo.innerHTML = `
      <p>Company in charge: ${team.teamName}</p>
      <p>Company's role: ${team.teamRole}</p>
      <p>Description: ${team.teamDescription}</p>
      <p>Contact Name: ${team.contactName}</p>
      <p>Phone number: ${team.contactPhone}</p>`
  }
}

export class Project implements IProject {
    // To satisfy IProject
    projectName: string
    projectDescription: string
    projectStatus: "Pending" | "Active" | "Finished"
    projectCost: string    
    projectType: "Residential" | "Commercial" | "Institutional" | "Mixed-use" | "Industrial" | "Heavy civil"
    projectAddress: string
    projectFinishDate: Date
    projectProgress: string
    projectTeams: ITeam

    // Class internals
    ui: HTMLLIElement
    id: string
    
    constructor(data: IProject) {
        for (const key in data) {
            this[key] = data[key]
        }
        this.id = uuidv4()
        this.setUI()
    }


    setUI() {    
        if (this.ui) {return}
        const roleToIcon: Record<ProjectType, string> = {
            "Residential": "home",
            "Commercial": "corporate_fare",
            "Institutional": "school",
            "Mixed-use": "emoji_transportation",
            "Industrial": "factory",
            "Heavy civil": "stadium"
        }
        const icon = roleToIcon[this.projectType] || "home"
        this.ui = document.createElement("li")
        this.ui.className = "nav-project-btn"
        this.ui.id = "nav-project-btn"
        this.ui.innerHTML = `<span class="material-icons-round">${icon}</span></span>${this.projectName}`
    }


}

export class Team implements ITeam {
	//To satisfy ITeam
  teamName: string
  teamRole: "BIM Manager" | "Structural" | "MEP" | "Architect" | "Contractor"
  teamDescription: string
  contactName: string
  contactPhone: string
  
  //Class internals
  ui: HTMLDivElement
  id: string

  constructor(data: ITeam) {
    for (const key in data) {
      this[key] = data[key]
    }
    this.id = uuidv4()
    this.setUI()
  }

  //creates the project card UI
  setUI() {
    if (this.ui) {return}
    const roleToIcon: Record<TeamRole, string> = {
      "BIM Manager": "computer",
      "Structural": "foundation",
      "MEP": "plumbing",
      "Architect": "architecture",
      "Contractor": "construction"
    }
    const icon = roleToIcon[this.teamRole] || "computer"
    this.ui = document.createElement("div")
    this.ui.className = "team-card"
    this.ui.innerHTML = `
    <span class="material-icons-round" style="padding: 10px; background-color: #686868; border-radius: 10px; font-size: 20px;">${icon}</span>
    <p>${this.teamRole}</p>
    <p>${this.teamName}</p>
    `
    //CLICK INTERACTION
    this.ui.addEventListener("click", (e) => {
      e.preventDefault()
      updateTeamInfo(this)
      toggleModal("team-info-popup")
    });
  }
}

