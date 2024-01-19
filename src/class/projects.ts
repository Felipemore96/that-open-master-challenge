import { v4 as uuidv4 } from 'uuid'

export type ProjectStatus = "Pending" | "Active" | "Finished"
export type ProjectType = "Residential" | "Commercial" | "Institutional" | "Mixed-use" | "Industrial" | "Heavy civil"

export interface IProject {
    projectName: string
    projectDescription: string
    projectStatus: ProjectStatus
    projectCost: string
    projectType: ProjectType
    projectAddress: string
    projectFinishDate: Date
    projectProgress: string
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
