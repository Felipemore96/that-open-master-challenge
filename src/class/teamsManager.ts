import { ITeam, Team } from "./teams"

export class TeamsManager {
  list: Team[] = []
  ui: HTMLElement

  constructor(container: HTMLElement) {
    this.ui = container
    this.newTeam({
        teamName: "X Company",
        teamRole: "BIM Manager",
        teamDescription: "This is just a default app team",
        contactName: "X Name",
        contactPhone: "123-456-789"
    })
  }

  newTeam(data: ITeam) {
    const teamNames = this.list.map((team) => {
      return team.teamName
    })
    const nameInUse = teamNames.includes(data.teamName)
    if (nameInUse) {
      throw new Error(`A project with the name "${data.teamName}" already exists`)
    }
    const team = new Team(data)
// 
// 
    // 
    this.ui.append(team.ui)
    this.list.push(team)	
    return team
  }

//   private setDetailsPage(project: Team) {
//     const detailsPage = document.getElementById("project-details")
//     if (!detailsPage) { return }
//     const name = detailsPage.querySelector("[data-project-info='name']")
//     if (name) { name.textContent = project.name }
//     const description = detailsPage.querySelector("[data-project-info='description']")
//     if (description) { description.textContent = project.description }
//     const cardName = detailsPage.querySelector("[data-project-info='cardName']")
//     if (cardName) { cardName.textContent = project.name }
//     const cardDescription = detailsPage.querySelector("[data-project-info='cardDescription']")
//   }

//   getProject(id: string) {
//     const project = this.list.find((project) => {
//       return project.id === id
//     })
//     return project
//   }
  
//   deleteProject(id: string) {
//     const project = this.getProject(id)
//     if (!project) { return }
//     project.ui.remove()
//     const remaining = this.list.filter((project) => {
//       return project.id !== id
//     })
//     this.list = remaining
//   }
  
//   exportToJSON(fileName: string = "projects") {
//     const json = JSON.stringify(this.list, null, 2)
//     const blob = new Blob([json], { type: 'application/json' })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement('a')
//     a.href = url
//     a.download = fileName
//     a.click()
//     URL.revokeObjectURL(url)
//   }
  
//   importFromJSON() {
//     const input = document.createElement('input')
//     input.type = 'file'
//     input.accept = 'application/json'
//     const reader = new FileReader()
//     reader.addEventListener("load", () => {
//       const json = reader.result
//       if (!json) { return }
//       const projects: IProject[] = JSON.parse(json as string)
//       for (const project of projects) {
//         try {
//           this.newProject(project)
//         } catch (error) {
          
//         }
//       }
//     })
//     input.addEventListener('change', () => {
//       const filesList = input.files
//       if (!filesList) { return }
//       reader.readAsText(filesList[0])
//     })
//     input.click()
//   }
}