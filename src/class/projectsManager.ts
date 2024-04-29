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

  constructor() {
    this.newProject({
      projectName: "Riverside Bridge",
      projectDescription:
        "A modern bridge spanning the river, connecting two bustling districts.",
      projectStatus: "Active",
      projectCost: "500,000.00",
      projectType: "Heavy civil",
      projectAddress: "Seine River, Paris, France",
      projectFinishDate: new Date(2025, 4, 30),
      projectProgress: "30",
      id: "3826a263-f931-4406-94e7-4f62f717b2e1",
      fragRoute: "../../assets/default-model1.frag",
      // fragRoute: "../../assets/small.frag",
      jsonRoute: "../../assets/default-model1.json",
    });
    this.newTeam({
      teamName: "Bridge Builders Ltd.",
      teamRole: "Contractor",
      teamDescription:
        "Experienced in constructing bridges of all sizes, specializing in structural integrity and on-time delivery.",
      contactName: "John Smith",
      contactPhone: "+33 123 456 789",
      teamProjectId: "3826a263-f931-4406-94e7-4f62f717b2e1",
    });
    this.newTeam({
      teamName: "Bridge Design Group",
      teamRole: "Structural",
      teamDescription:
        "Experts in bridge design, ensuring safety and functionality while complementing the cityscape.",
      contactName: "Emily Johnson",
      contactPhone: "+33 987 654 321",
      teamProjectId: "3826a263-f931-4406-94e7-4f62f717b2e1",
    });
    this.newProject({
      projectName: "Urban Loft",
      projectDescription:
        "Structural design for a contemporary one-floor building, blending seamlessly into the urban landscape.",
      projectStatus: "Pending",
      projectCost: "350,000.00",
      projectType: "Mixed-use",
      projectAddress: "Prenzlauer Berg, Berlin, Germany",
      projectFinishDate: new Date(2025, 8, 15),
      projectProgress: "75",
      id: "d581f18b-8030-41f3-80c7-a8a9d9ec8031",
      fragRoute: "../../assets/default-model2.frag",
      jsonRoute: "../../assets/default-model2.json",
    });
    this.newTeam({
      teamName: "Urban Architects Collective",
      teamRole: "Architect",
      teamDescription:
        "Renowned construction company known for implementing cutting-edge techniques and delivering high-quality results.",
      contactName: "Sarah Johnson",
      contactPhone: "+49 123 456 789",
      teamProjectId: "d581f18b-8030-41f3-80c7-a8a9d9ec8031",
    });
    this.newTeam({
      teamName: "Construction Innovators Ltd.",
      teamRole: "Contractor",
      teamDescription:
        "Innovative architectural firm specializing in urban design, creating spaces that inspire and transform communities.",
      contactName: "Michael Brown",
      contactPhone: "+49 987 654 321",
      teamProjectId: "d581f18b-8030-41f3-80c7-a8a9d9ec8031",
    });
    this.newTeam({
      teamName: "MEP Solutions GmbH",
      teamRole: "MEP",
      teamDescription:
        "Leaders in mechanical, electrical, and plumbing engineering, ensuring sustainable and efficient building systems.",
      contactName: "Thomas Müller",
      contactPhone: "+49 111 222 333",
      teamProjectId: "d581f18b-8030-41f3-80c7-a8a9d9ec8031",
    });
    this.newProject({
      projectName: "City Plaza Office",
      projectDescription:
        "A small, sleek office space designed for efficiency and productivity in the heart of the city.",
      projectStatus: "Finished",
      projectCost: "250,000.00",
      projectType: "Commercial",
      projectAddress: "Plaça de Catalunya, Barcelona, Spain",
      projectFinishDate: new Date(2024, 4, 1),
      projectProgress: "100",
      id: "1cc235e1-6b55-419b-a865-d8fc7270b5fb",
      fragRoute: "../../assets/default-model3.frag",
      jsonRoute: "../../assets/default-model3.json",
    });
    this.newTeam({
      teamName: "City Builders Ltd.",
      teamRole: "Contractor",
      teamDescription:
        "Experienced in constructing commercial spaces with a focus on quality craftsmanship and attention to detail.",
      contactName: "David Garcia",
      contactPhone: "+34 987 654 321",
      teamProjectId: "1cc235e1-6b55-419b-a865-d8fc7270b5fb",
    });
    this.newTeam({
      teamName: "Sustainable Solutions GmbH",
      teamRole: "MEP",
      teamDescription:
        "Leaders in sustainable building solutions, integrating energy-efficient systems for eco-friendly office environments.",
      contactName: "Maria Rodriguez",
      contactPhone: "+34 111 222 333",
      teamProjectId: "1cc235e1-6b55-419b-a865-d8fc7270b5fb",
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
