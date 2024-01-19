import { IProject, Project } from "../class/projects"
import { ITeam, Team } from "./teams"

export class ProjectsManager {
  list: Project[] = []
  ui: HTMLElement

  constructor(container: HTMLElement) {
    this.ui = container
    this.newProject({
      projectName: "Project #1",
      projectDescription: "Description of this project",
      projectStatus: "Active",
      projectCost: "$500,000.00",
      projectType: "Residential",
      projectAddress: "Madrid, Spain",
      projectFinishDate: new Date(0o1-0o1-2025),
      projectProgress: "50"
    })
  }

  // exportToJSON(fileName: string = "project-info") {
  //   const json = JSON.stringify(this.list, null, 2)
  //   const blob = new Blob([json], { type: 'application/json'})
  //   const url = URL.createObjectURL(blob)
  //   const a = document.createElement('a')
  //   a.href = url
  //   a.download = fileName
  //   a.click()
  //   URL.revokeObjectURL(url)
  // }

  newProject(data: IProject) {
    const projectNames = this.list.map((project) => {
        return project.projectName
    })
    const nameInUse = projectNames.includes(data.projectName)
    if (nameInUse) {
      throw new Error(`A project with name "${data.projectName}" already exists`)
    }
    const project = new Project(data)
    this.ui.append(project.ui)
    this.list.push(project)
    return project
  } 
}

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
      this.ui.append(team.ui)
      this.list.push(team)	
      return team
    }
}