import { IProject, Project, ITeam, Team, toggleModal } from "../class/projects";
import { v4 as uuidv4 } from "uuid";

export class ProjectsManager {
  projectsList: Project[] = [];
  teamList: Team[] = [];
  currentProject: Project | null = null;
  teamProject: string;
  onProjectCreated = (project: Project) => {};
  onProjectDeleted = () => {};
  onTeamCreated = (team: Team) => {};
  onTeamDeleted = () => {};

  constructor(container: HTMLElement) {
    this.newProject({
      projectName: "Default Project",
      projectDescription: "This is just a default app project",
      projectStatus: "Pending",
      projectCost: "architect",
      projectType: "Industrial",
      projectAddress: "",
      projectFinishDate: new Date(),
      projectProgress: "",
      id: "3826a263-f931-4406-94e7-4f62f717b2e1",
      projectModelRoute: "../../assets/IFC1",
    });
    this.newTeam({
      teamName: "Default Project",
      teamRole: "BIM Manager",
      teamDescription: "This is just a default app project",
      contactName: "Industrial",
      contactPhone: "",
      teamProjectId: "",
    });
    this.newProject({
      projectName: "zdfsdfg Project",
      projectDescription: "This is just a default app project",
      projectStatus: "Pending",
      projectCost: "architect",
      projectType: "Industrial",
      projectAddress: "",
      projectFinishDate: new Date(),
      projectProgress: "",
      id: "d581f18b-8030-41f3-80c7-a8a9d9ec8031",
      projectModelRoute: "../../assets/IFC2",
    });
    this.newProject({
      projectName: "Defsdfgault Project",
      projectDescription: "This is just a default app project",
      projectStatus: "Pending",
      projectCost: "architect",
      projectType: "Industrial",
      projectAddress: "",
      projectFinishDate: new Date(),
      projectProgress: "",
      id: "1cc235e1-6b55-419b-a865-d8fc7270b5fb",
      projectModelRoute: "../../assets/IFC3",
    });
  }

  filterProjects(value: string) {
    const filteredProjects = this.projectsList.filter((project) => {
      return project.projectName;
    });
    return filteredProjects;
  }

  getProject(id: string) {
    const project = this.projectsList.find((project) => {
      return project.id === id;
    });
    return project;
  }

  deleteProject(id: string) {
    const project = this.getProject(id);
    if (!project) {
      return;
    }
    const remaining = this.projectsList.filter((project) => {
      return project.id !== id;
    });
    this.projectsList = remaining;
    this.onProjectDeleted();
  }

  exportToJSON(fileName: string = "project-info") {
    const json = JSON.stringify(
      { projects: this.projectsList, teams: this.teamList },
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

  importFromJSON() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const json = reader.result;
      if (!json) {
        return;
      }
      const importData = JSON.parse(json as string);
      const projects: IProject[] = importData.projects;
      const teams: ITeam[] = importData.teams;
      for (const team of teams) {
        try {
          this.newTeam(team);
        } catch (err) {
          const errorMessage = document.getElementById("err") as HTMLElement;
          errorMessage.textContent = err;
          toggleModal("error-popup");
        }
      }
      for (const project of projects) {
        try {
          this.newProject(project);
        } catch (err) {
          const errorMessage = document.getElementById("err") as HTMLElement;
          errorMessage.textContent = err;
          toggleModal("error-popup");
        }
      }
    });
    input.addEventListener("change", () => {
      const filesList = input.files;
      if (!filesList) {
        return;
      }
      reader.readAsText(filesList[0]);
    });
    input.click();
  }

  newProject(data: IProject, id?: string, modelRoute?: string) {
    const nameInUse = this.projectsList.some(
      (project) => project.projectName === data.projectName
    );

    const projectId = data.id;
    const idInUse = this.projectsList.some(
      (project) => project.id === projectId
    );

    if (nameInUse) {
      throw new Error(
        `A project with name "${data.projectName}" already exists`
      );
    }
    if (idInUse) {
      throw new Error(`A project with the ID "${projectId}" already exists`);
    }

    const project = new Project(data, data.id);
    this.projectsList.push(project);
    this.currentProject = project;
    this.teamProject = project.projectName;
    this.onProjectCreated(project);

    return project;
  }

  newTeam(data: ITeam, id?: string) {
    const team = new Team(data, id);
    this.teamList.push(team);
    this.onTeamCreated(team);
    return team;
  }
}
