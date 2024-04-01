// Import necessary modules and classes
import { IProject, Project, ITeam, Team, toggleModal } from "../class/projects";

// Class managing projects and teams
export class ProjectsManager {
  // Properties to store project and team data
  projectsList: Project[] = [];
  teamList: Team[] = [];
  currentProject: Project | null = null;
  teamProject: string;
  onProjectCreated = (project: Project) => {}
  onProjectDeleted = () => {}
  onTeamCreated = (team: Team) => {}
  onTeamDeleted = () => {}

  filterProjects(value: string) {
    const filteredProjects = this.projectsList.filter((project) => {
      return project.projectName
    })
    return filteredProjects
  }

  getProject(id: string) {
    const project = this.projectsList.find((project) => {
      return project.id === id
    })
    return project
  }

  deleteProject(id: string) {
    const project = this.getProject(id)
    if (!project) { return }
    const remaining = this.projectsList.filter((project) => {
      return project.id !== id
    })
    this.projectsList = remaining
    this.onProjectDeleted()
  }

  // Export project and team data to a JSON file
  exportToJSON(fileName: string = "project-info") {
    const json = JSON.stringify({ projects: this.projectsList, teams: this.teamList }, null, 2);    
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Export project and team data from a JSON file
  importFromJSON() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    const reader = new FileReader()
    reader.addEventListener("load", () => {
      const json =reader.result
      if (!json) { return }
      const importData = JSON.parse(json as string);
      const projects: IProject[] = importData.projects;
      const teams: ITeam[] = importData.teams;
      for (const team of teams) {
        try {
          this.createNewTeam(team)
        } catch (err) {
          const errorMessage = document.getElementById("err") as HTMLElement;
          errorMessage.textContent = err;
          toggleModal("error-popup");
        }
      }
      for (const project of projects) {
        try {
          this.newProject(project)
        } catch (err) {
          const errorMessage = document.getElementById("err") as HTMLElement;
          errorMessage.textContent = err;
          toggleModal("error-popup");
        }
      }
    })
    input.addEventListener('change', () => {
        const filesList = input.files
        if (!filesList) { return }
        reader.readAsText(filesList[0])
    })
    input.click()
  }

  // Create a new project with the provided data
  newProject(data: IProject, id?: string) {
    // Check if a project with the same name already exists
    const nameInUse = this.projectsList.some((project) => project.projectName === data.projectName);
    if (nameInUse) {
      throw new Error(`A project with name "${data.projectName}" already exists`);
    }
    // Add a click event listener to show project details when clicked
    const project = new Project(data, id);
    // Add project to the projectsList
    this.projectsList.push(project);

    // Display project details
    this.currentProject = project;
    this.teamProject = project.projectName;

    this.showProjectDetails(project);
    // this.showProjectTeams(project);

    this.onProjectCreated(project)

    return project;
  }

  // Display detailed information about a project
  showProjectDetails(project: Project) {
    // Get the project details page element
    const detailsPage = document.getElementById("project-details");
    if (!detailsPage) {
      return;
    }
    // Query selectors to update project details on the page
    const name = detailsPage.querySelector("[data-project-info='name']");
    const description = detailsPage.querySelector("[data-project-info='description']");
    const status = detailsPage.querySelector("[data-project-info='status']");
    const cost = detailsPage.querySelector("[data-project-info='cost']");
    const type = detailsPage.querySelector("[data-project-info='type']");
    const address = detailsPage.querySelector("[data-project-info='address']");
    const finishDate = detailsPage.querySelector("[data-project-info='finishDate']");
    const progress = detailsPage.querySelector("[data-project-info='progress']") as HTMLElement;
    
    // Update project details on the page
    if (name) { name.textContent = project.projectName; }
    if (description) { description.textContent = project.projectDescription; }
    if (status) { status.textContent = project.projectStatus; }
    if (cost) { cost.textContent = `$${project.projectCost}`; }
    if (type) { type.textContent = project.projectType; }
    if (address) { address.textContent = project.projectAddress; }
    if (finishDate) {
      let finishDateString = project.projectFinishDate;
      let cardFinishDate = new Date(finishDateString);
      finishDate.textContent = cardFinishDate.toDateString();
    }
    if (progress) {
      progress.style.width = project.projectProgress + "%";
      progress.textContent = project.projectProgress + "%";
    }
  }

  // showProjectTeams(project: Project) {
  //   // Clear existing teams before updating project details
  //   const teamsShown = document.getElementById("teams-list");
  //   if (teamsShown) {
  //     teamsShown.innerHTML = "";
  //   }

  //   //Update the project Teams and create their cards
  //   const teams = this.teamList;
  //   const teamsList = document.getElementById("teams-list");
  //   if (teams) {
  //     for (const teamData of teams) {
  //       if (teamData.teamProject && teamData.teamProject === project.projectName) {
  //         // Create a new Team instance
  //         if (teamsList) {
  //           teamsList.appendChild(teamData.ui);
  //         }
  //       }
  //     }
  //   }
  // }


  // Create a new team with the provided data
  createNewTeam(data: ITeam, id?: string) {
    // Create a new Team instance
    const team = new Team(data, id);
    const teamsList = document.getElementById("teams-list");
    if (teamsList) {
      teamsList.appendChild(team.ui);
    }

    // Add team to the teamList
    this.teamList.push(team);

    return team;
  }
  
  
}