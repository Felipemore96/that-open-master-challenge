import { v4 as uuidv4 } from 'uuid'

export type ProjectStatus = "Pending" | "Active" | "Finished"

export interface IProject {
    projectName: string
    projectDescription: string
    projectStatus: ProjectStatus
    projectType: string
    projectAddress: string
    projectFinishDate: Date
    projectProgress: string
}

export class Project implements IProject {
    // To satisfy IProject
    projectName: string
    projectDescription: string
    projectStatus: "Pending" | "Active" | "Finished"
    projectType: string
    projectAddress: string
    projectFinishDate: Date
    projectProgress: string

    // Class internals
    ui: HTMLDivElement
    id: string

    constructor(data: IProject) {
        for (const key in data) {
            this[key] = data[key]
        }
        this.id = uuidv4()
        this.setUI()
    }

    // setUI() {    
    //     if (this.ui) {return}    
    //     this.ui = document.createElement("div")
    //     this.ui.className = "project-card"
    //     this.ui.innerHTML = `          
    //     <div class="card-header">
    //         <p style="background-color: #ca8134; padding: 10px; border-radius: 8px; aspect-ratio: 1;">HC</p>
    //         <div>
    //             <h5>${this.name}</h5>
    //             <p>${this.description}</p>
    //         </div>
    //     </div>
    //     <div class="card-content">
    //         <div class="card-property">
    //             <p style="color: #969696;">Status</p>
    //             <p>${this.status}</p>
    //         </div>
    //         <div class="card-property">
    //             <p style="color: #969696;">Role</p>
    //             <p>${this.userRole}</p>
    //         </div>
    //         <div class="card-property">
    //             <p style="color: #969696;">Cost</p>
    //             <p>$${this.cost}</p>
    //         </div>
    //         <div class="card-property">
    //             <p style="color: #969696;">Estimated Progress</p>
    //             <p>${this.progress * 100}</p>
    //         </div>
    //     </div>`
    // }
}



