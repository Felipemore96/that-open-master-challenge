import { IProject, Project, ITeam, Team} from "../class/projects"

export class ProjectsManager {
  list: Project[] = []
  ui: HTMLElement

  constructor(container: HTMLElement) {
    this.ui = container
    this.newProject({
      projectName: "Project #1",
      projectDescription: "Description of this project",
      projectStatus: "Active",
      projectCost: "500,000.00",
      projectType: "Residential",
      projectAddress: "Madrid, Spain",
      projectFinishDate: new Date("2025-01-02"),
      projectProgress: "50",
      projectTeams: ({
        teamName: "X Company",
        teamRole: "BIM Manager",
        teamDescription: "This is just a default app team",
        contactName: "X Name",
        contactPhone: "123-456-789"
      }) 
    })
    this.newProject({
      projectName: "Project #2",
      projectDescription: "Another description of a project",
      projectStatus: "Pending",
      projectCost: "250,000.00",
      projectType: "Commercial",
      projectAddress: "Lisbon, Portugal",
      projectFinishDate: new Date("2026-06-02"),
      projectProgress: "10",
      projectTeams: ({
        teamName: "Hello Company",
        teamRole: "BIM Manager",
        teamDescription: "This is just a default app team",
        contactName: "XYZ Name",
        contactPhone: "123-456-789"
      }) 
    })
    this.newProject({
      projectName: "Project #3",
      projectDescription: "Last description of some project",
      projectStatus: "Finished",
      projectCost: "1,000,000.00",
      projectType: "Institutional",
      projectAddress: "Barcelona, Spain",
      projectFinishDate: new Date("2022-06-02"),
      projectProgress: "100",
      projectTeams: (
        {
        teamName: "BIM Company",
        teamRole: "BIM Manager",
        teamDescription: "This is just a default app team",
        contactName: "XYZ Name",
        contactPhone: "123-456-789"
      }{
        teamName: "MEP Company",
        teamRole: "MEP",
        teamDescription: "This is just a default app team",
        contactName: "XYZ Name",
        contactPhone: "123-456-789"
      })  
    })
  }

  exportToJSON(fileName: string = "project-info") {
    const json = JSON.stringify(this.list, null, 2)
    const blob = new Blob([json], { type: 'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
  }

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
    this.showProjectDetails(project)
    console.log(project)
    return project
  } 

  showProjectDetails(project: Project) {
    const detailsPage = document.getElementById("project-details")
    if(!detailsPage) { return }
    const name = detailsPage.querySelector("[data-project-info='name']")
    const description = detailsPage.querySelector("[data-project-info='description']")
    const status = detailsPage.querySelector("[data-project-info='status']")
    const cost = detailsPage.querySelector("[data-project-info='cost']")
    const type = detailsPage.querySelector("[data-project-info='type']")
    const address = detailsPage.querySelector("[data-project-info='address']")
    const finishDate = detailsPage.querySelector("[data-project-info='finishDate']")
    const progress = detailsPage.querySelector("[data-project-info='progress']") as HTMLElement
    if (name) { name.textContent = project.projectName }
    if (description) { description.textContent = project.projectDescription }
    if (status) { status.textContent = project.projectStatus }
    if (cost) { cost.textContent = `$${project.projectCost}` }
    if (type) { type.textContent = project.projectType }
    if (address) { address.textContent = project.projectAddress }
    if (finishDate) { 
        let finishDateString = project.projectFinishDate
        let cardFinishDate = new Date(finishDateString)
        finishDate.textContent = cardFinishDate.toDateString()
    }
    if (progress) { 
        progress.style.width = project.projectProgress + "%"
        progress.textContent = project.projectProgress + "%"
    }
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