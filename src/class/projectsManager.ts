import { IProject, Project } from "../class/projects";
import { ITeam, Team } from "../class/teams";

export class ProjectsManager {
  projectsList: Project[] = [];
  teamsList: Team[] = [];
  onProjectCreated = (project: Project) => {};
  onProjectDeleted = (id: string) => {};
  onTeamCreated = (team: Team) => {};
  onTeamDeleted = (id: string) => {};

  getProject(id: string) {
    const project = this.projectsList.find((project) => {
      return project.id === id;
    });
    return project;
  }

  getTeam(id: string) {
    const team = this.teamsList.find((team) => {
      return team.id === id;
    });
    return team;
  }

  deleteProject(id: string) {
    const initialLength = this.projectsList.length;
    this.projectsList = this.projectsList.filter(
      (project) => project.id !== id
    );
    if (this.projectsList.length < initialLength) {
      this.onProjectDeleted(id);
    }
  }

  exportToJSON(fileName: string = "project-info") {
    const json = JSON.stringify(
      { projects: this.projectsList, teams: this.teamsList },
      null,
      2
    );
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  createProject(data: IProject, id?: string) {
    const nameInUse = this.projectsList.some(
      (project) => project.projectName === data.projectName
    );

    const idInUse = this.projectsList.some((project) => project.id === id);

    if (nameInUse) {
      throw new Error(
        `A project with the name "${data.projectName}" already exists.`
      );
    }
    if (idInUse) {
      throw new Error(`A project with the ID "${id}" already exists.`);
    }

    if (!id) {
      throw new Error("Project ID is required.");
    }

    const project = new Project(data, id);
    this.projectsList.push(project);
    this.onProjectCreated(project);

    return project;
  }

  createTeam(data: ITeam, id?: string) {
    const idInUse = this.teamsList.some((team) => team.id === id);

    if (idInUse) {
      throw new Error(`A project with the ID "${id}" already exists`);
    }
    const team = new Team(data, id);
    this.teamsList.push(team);
    this.onTeamCreated(team);
    return team;
  }

  deleteTeam(id: string) {
    const initialLength = this.teamsList.length;
    this.teamsList = this.teamsList.filter((team) => team.id !== id);
    if (this.teamsList.length < initialLength) {
      this.onTeamDeleted(id);
    }
  }

  editProject(newData: IProject, originalData: IProject) {
    if (!originalData.id) {
      throw new Error("Project ID is required.");
    }

    const nameKept = newData.projectName === originalData.projectName;
    const nameInUse = this.projectsList.some(
      (project) => project.projectName === newData.projectName
    );

    if (!nameKept && nameInUse) {
      throw new Error(
        `A project with name "${newData.projectName}" already exists`
      );
    }

    const originalProjectIndex = this.projectsList.findIndex(
      (project) => project.id === originalData.id
    );

    if (originalProjectIndex === -1) {
      throw new Error(`Project with ID "${originalData.id}" not found.`);
    }

    const updatedProject = new Project(newData, originalData.id);
    this.projectsList[originalProjectIndex] = updatedProject;

    return updatedProject;
  }

  editTeam(newData: ITeam, originalData: ITeam) {
    const nameKept = newData.teamName === originalData.teamName;
    const nameInUse = this.teamsList.some(
      (team) => team.teamName === newData.teamName
    );

    if (!nameKept && nameInUse) {
      throw new Error(`A team with name "${newData.teamName}" already exists`);
    }

    const originalTeamIndex = this.teamsList.findIndex(
      (team) => team.id === originalData.id
    );

    if (originalTeamIndex === -1) {
      throw new Error(`Team with ID "${originalData.id}" not found.`);
    }

    const updatedTeam = new Team(newData, originalData.id);
    this.teamsList[originalTeamIndex] = updatedTeam;

    return updatedTeam;
  }
}
