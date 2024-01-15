import { v4 as uuidv4 } from 'uuid'

export type TeamRole = "BIM Manager" | "Structural" | "MEP" | "Architect" | "Contractor"

export interface ITeam {
  teamName: string
  teamRole: TeamRole
  teamDescription: string
  contactName: string
  contactPhone: string
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
    this.ui.id = "team-card"
    this.ui.innerHTML = `
    <span class="material-icons-round" style="padding: 10px; background-color: #686868; border-radius: 10px; font-size: 20px;">${icon}</span>
    <p>${this.teamRole}</p>
    <p>${this.teamName}</p>
    `
  }
}