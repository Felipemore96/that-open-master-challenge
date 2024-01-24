// Import necessary modules and classes
import { IProject, Project, ITeam, Team } from "../class/projects";

// Class managing projects and teams
export class ProjectsManager {
  // Properties to store project and team data
  projectsList: Project[] = [];
  ui: HTMLElement;
  teamList: Team[] = [];

  // Constructor initializes the ProjectsManager with a container element
  constructor(container: HTMLElement) {
    this.ui = container;

    // Create an example project and team for demonstration
    this.newProject({
      projectName: "Project #1",
      projectDescription: "Description of this project",
      projectStatus: "Active",
      projectCost: "500,000.00",
      projectType: "Residential",
      projectAddress: "Madrid, Spain",
      projectFinishDate: new Date("2025-01-02"),
      projectProgress: "50",
      projectTeams: {
        teamName: "X Company",
        teamRole: "BIM Manager",
        teamDescription: "This is just a default app team",
        contactName: "X Name",
        contactPhone: "123-456-789",
      },
    });
    this.newTeam({
      teamName: "X Company",
      teamRole: "BIM Manager",
      teamDescription: "This is just a default app team",
      contactName: "X Name",
      contactPhone: "123-456-789",
    });
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

  // Create a new project with the provided data
  newProject(data: IProject) {
    // Check if a project with the same name already exists
    const nameInUse = this.projectsList.some((project) => project.projectName === data.projectName);
    if (nameInUse) {
      throw new Error(`A project with name "${data.projectName}" already exists`);
    }

    // Create a new Project instance
    const project = new Project(data);
    // Add a click event listener to show project details when clicked
    project.ui.addEventListener("click", () => {
      this.showProjectDetails(project);
    });
    // Append project UI to the container
    this.ui.append(project.ui);
    // Add project to the projectsList
    this.projectsList.push(project);
    // Display project details
    this.showProjectDetails(project);
    console.log(project);
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

  // Create a new team with the provided data
  newTeam(data: ITeam) {
    // Check if a team with the same name already exists
    const nameInUse = this.teamList.some((team) => team.teamName === data.teamName);
    if (nameInUse) {
      throw new Error(`A team with the name "${data.teamName}" already exists`);
    }

    // Create a new Team instance
    const team = new Team(data);
    // Get the teams list container element
    const teamsList = document.getElementById("teams-list");
    // Append team UI to the teams list container
    if (teamsList) {
      teamsList.appendChild(team.ui);
    }
    // Add team to the teamList
    this.teamList.push(team);
    return team;
  }
}