import * as THREE from "three";
import { IProject, Project, ITeam, Team, toggleModal } from "../class/projects";
import { v4 as uuidv4 } from "uuid";

export class ProjectsManager {
  projectsList: Project[] = [];
  teamsList: Team[] = [];
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
      fragmentMap: {
        "7c7a4379-f1c5-40ce-89f2-31d207e8861f": new Set([
          "138293",
          "130448",
          "130684",
          "138578",
          "145431",
          "130212",
        ]),
        "363f376d-41bf-4c8d-b744-07bc8fc340f9": new Set(["97892"]),
      },
      camera: {
        position: new THREE.Vector3(
          81.81247929233817,
          49.0409386329085,
          130.86505719708884
        ),
        target: new THREE.Vector3(
          -14.413127277813626,
          -34.892857845120155,
          49.53080950635257
        ),
      },
    });
    this.newTeam({
      teamName: "Bridge Design Group",
      teamRole: "Structural",
      teamDescription:
        "Experts in bridge design, ensuring safety and functionality while complementing the cityscape.",
      contactName: "Emily Johnson",
      contactPhone: "+33 987 654 321",
      teamProjectId: "3826a263-f931-4406-94e7-4f62f717b2e1",
      fragmentMap: {
        "363f376d-41bf-4c8d-b744-07bc8fc340f9": new Set([
          "146976",
          "108119",
          "147970",
          "146871",
          "108014",
          "167080",
          "165758",
          "166100",
          "146766",
          "107909",
          "165145",
          "166456",
          "164588",
        ]),
      },
      camera: {
        position: new THREE.Vector3(
          -3.5619167211226213,
          -65.33176411094537,
          117.32517728289218
        ),
        target: new THREE.Vector3(
          22.520271827043366,
          3.650672103879617,
          71.925365230357
        ),
      },
    });
    //   this.newProject({
    //     projectName: "Urban Loft",
    //     projectDescription:
    //       "Structural design for a contemporary one-floor building, blending seamlessly into the urban landscape.",
    //     projectStatus: "Pending",
    //     projectCost: "350,000.00",
    //     projectType: "Mixed-use",
    //     projectAddress: "Prenzlauer Berg, Berlin, Germany",
    //     projectFinishDate: new Date(2025, 8, 15),
    //     projectProgress: "75",
    //     id: "d581f18b-8030-41f3-80c7-a8a9d9ec8031",
    //     fragRoute: "../../assets/default-model2.frag",
    //     jsonRoute: "../../assets/default-model2.json",
    //   });
    //   this.newTeam({
    //     teamName: "Urban Architects Collective",
    //     teamRole: "Architect",
    //     teamDescription:
    //       "Renowned construction company known for implementing cutting-edge techniques and delivering high-quality results.",
    //     contactName: "Sarah Johnson",
    //     contactPhone: "+49 123 456 789",
    //     teamProjectId: "d581f18b-8030-41f3-80c7-a8a9d9ec8031",
    //     fragmentMap: {
    //       "0bf94918-91fd-48e5-a9b9-c8096421ed5e": new Set([
    //         "2024",
    //         "2025",
    //         "14015",
    //         "1909",
    //         "2299",
    //       ]),
    //       "77b9dc24-8541-4c18-884d-3798e9097d75": new Set(["16022", "14749"]),
    //       "6300fe10-43bb-41a5-88fc-66913934b928": new Set(["12052"]),
    //     },
    //     camera: {
    //       position: new THREE.Vector3(
    //         37.7661077230378,
    //         16.506804101129756,
    //         34.90037938293105
    //       ),
    //       target: new THREE.Vector3(
    //         8.455718350089347,
    //         1.5425332388016395,
    //         23.60425851131652
    //       ),
    //     },
    //   });
    //   this.newTeam({
    //     teamName: "Construction Innovators Ltd.",
    //     teamRole: "Contractor",
    //     teamDescription:
    //       "Innovative architectural firm specializing in urban design, creating spaces that inspire and transform communities.",
    //     contactName: "Michael Brown",
    //     contactPhone: "+49 987 654 321",
    //     teamProjectId: "d581f18b-8030-41f3-80c7-a8a9d9ec8031",
    //     fragmentMap: {
    //       "8a846781-a5e5-448d-ab3b-69d9404ad774": new Set(["13606", "7265"]),
    //       "6300fe10-43bb-41a5-88fc-66913934b928": new Set([
    //         "2230",
    //         "13263",
    //         "13263.1",
    //         "13263.2",
    //         "13263.3",
    //         "13263.4",
    //         "13340",
    //         "13340.1",
    //         "13416",
    //         "13416.1",
    //         "13492",
    //         "13492.1",
    //         "13681",
    //         "13681.1",
    //         "13757",
    //         "13757.1",
    //         "13833",
    //         "13833.1",
    //         "13942",
    //         "15714",
    //         "15768",
    //         "1328",
    //         "1328.1",
    //         "14076",
    //         "1269",
    //         "1269.1",
    //         "2536",
    //         "2536.1",
    //         "1387",
    //         "1387.1",
    //         "2477",
    //         "2477.1",
    //         "2418",
    //         "2418.1",
    //         "1505",
    //         "1505.1",
    //         "4726",
    //         "7073",
    //         "7073.1",
    //         "7073.2",
    //         "7073.3",
    //         "7073.4",
    //         "4840",
    //         "4555",
    //         "4441",
    //         "1209",
    //         "1209.1",
    //         "1617",
    //         "1617.1",
    //         "1676",
    //         "1676.1",
    //         "1446",
    //         "1446.1",
    //         "1735",
    //         "1735.1",
    //         "7330",
    //         "4212",
    //         "4327",
    //         "4270",
    //         "7606",
    //         "4384",
    //         "7537",
    //         "4498",
    //         "7468",
    //         "4612",
    //         "7399",
    //         "4669",
    //         "4783",
    //         "7143",
    //       ]),
    //     },
    //     camera: {
    //       position: new THREE.Vector3(
    //         -37.68052988820838,
    //         7.812333124771319,
    //         40.48046677685305
    //       ),
    //       target: new THREE.Vector3(
    //         -25.987722991348015,
    //         -2.3622430229106635,
    //         17.521449428338766
    //       ),
    //     },
    //   });
    //   this.newProject({
    //     projectName: "City Plaza Office",
    //     projectDescription:
    //       "A small, sleek office space designed for efficiency and productivity in the heart of the city.",
    //     projectStatus: "Finished",
    //     projectCost: "250,000.00",
    //     projectType: "Commercial",
    //     projectAddress: "Plaça de Catalunya, Barcelona, Spain",
    //     projectFinishDate: new Date(2024, 4, 1),
    //     projectProgress: "100",
    //     id: "1cc235e1-6b55-419b-a865-d8fc7270b5fb",
    //     fragRoute: "../../assets/default-model3.frag",
    //     jsonRoute: "../../assets/default-model3.json",
    //   });
    //   this.newTeam({
    //     teamName: "City Builders Ltd.",
    //     teamRole: "Contractor",
    //     teamDescription:
    //       "Experienced in constructing commercial spaces with a focus on quality craftsmanship and attention to detail.",
    //     contactName: "David Garcia",
    //     contactPhone: "+34 987 654 321",
    //     teamProjectId: "1cc235e1-6b55-419b-a865-d8fc7270b5fb",
    //     fragmentMap: {
    //       "0b5ca25a-0513-42ad-bdde-42c8424fdec4": new Set(["373"]),
    //       "b56f98fc-3334-4875-b95f-991b3758829f": new Set([
    //         "193",
    //         "228",
    //         "286",
    //         "321",
    //         "422",
    //         "48211",
    //         "66501",
    //         "66536",
    //       ]),
    //       "cf044753-5157-4c07-aa0d-77816e479231": new Set(["131", "479"]),
    //     },
    //     camera: {
    //       position: new THREE.Vector3(
    //         -7.226429637383608,
    //         10.738794396720527,
    //         18.766907751409658
    //       ),
    //       target: new THREE.Vector3(
    //         5.054411304597669,
    //         0.5308368421946721,
    //         3.556021565268745
    //       ),
    //     },
    //   });
    //   this.newTeam({
    //     teamName: "Sustainable Solutions GmbH",
    //     teamRole: "MEP",
    //     teamDescription:
    //       "Leaders in sustainable building solutions, integrating energy-efficient systems for eco-friendly office environments.",
    //     contactName: "Maria Rodriguez",
    //     contactPhone: "+34 111 222 333",
    //     teamProjectId: "1cc235e1-6b55-419b-a865-d8fc7270b5fb",
    //     fragmentMap: {
    //       "60f58114-0178-4eee-b2c2-26a3bcdf4b93": new Set(["67778"]),
    //       "98e1a487-2746-4226-8f6d-54095258c706": new Set([
    //         "66783",
    //         "66816",
    //         "66844",
    //         "66872",
    //         "66900",
    //         "66929",
    //         "66957",
    //         "66986",
    //         "67015",
    //         "67043",
    //         "67071",
    //       ]),
    //       "660f6108-c9e3-4c47-8c2d-2b89dfd14521": new Set([
    //         "66783",
    //         "66816",
    //         "66844",
    //         "66872",
    //         "66900",
    //         "66929",
    //         "66957",
    //         "66986",
    //         "67015",
    //         "67043",
    //         "67071",
    //       ]),
    //       "cd0414ba-2f03-484e-93af-b61dcafb37b6": new Set([
    //         "66783",
    //         "66816",
    //         "66844",
    //         "66872",
    //         "66900",
    //         "66929",
    //         "66957",
    //         "66986",
    //         "67015",
    //         "67043",
    //         "67071",
    //       ]),
    //       "f6bb763a-b191-47b8-b261-0b1bbd0c2ffc": new Set([
    //         "66783",
    //         "66816",
    //         "66844",
    //         "66872",
    //         "66900",
    //         "66929",
    //         "66957",
    //         "66986",
    //         "67015",
    //         "67043",
    //         "67071",
    //       ]),
    //     },
    //     camera: {
    //       position: new THREE.Vector3(
    //         3.3353490654157847,
    //         1.9499768134226,
    //         -0.8673931329864668
    //       ),
    //       target: new THREE.Vector3(
    //         2.0024586315438944,
    //         1.059952912812076,
    //         0.7209902232022298
    //       ),
    //     },
    //   });
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
  getTeam(id: string) {
    const team = this.teamsList.find((team) => {
      return team.id === id;
    });
    return team;
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
    this.teamsList.push(team);
    this.onTeamCreated(team);
    return team;
  }

  deleteTeam(id: string) {
    const team = this.getTeam(id);
    if (!team) {
      return;
    }
    const remaining = this.teamsList.filter((team) => {
      return team.id !== id;
    });
    this.teamsList = remaining;
    this.onTeamDeleted();
  }
}
