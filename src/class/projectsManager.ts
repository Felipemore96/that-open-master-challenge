import * as THREE from "three";
import * as OBC from "openbim-components";
import { IProject, Project, toggleModal } from "../class/projects";
import { ITeam, Team } from "../class/teams";
import { v4 as uuidv4 } from "uuid";

export class ProjectsManager {
  projectsList: Project[] = [];
  teamsList: Team[] = [];
  onProjectCreated = (project: Project) => {};
  onProjectDeleted = (id: string) => {};
  onTeamCreated = (team: Team) => {};
  onTeamDeleted = (id: string) => {};

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
          130.86505719708884,
        ),
        target: new THREE.Vector3(
          -14.413127277813626,
          -34.892857845120155,
          49.53080950635257,
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
          117.32517728289218,
        ),
        target: new THREE.Vector3(
          22.520271827043366,
          3.650672103879617,
          71.925365230357,
        ),
      },
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
      fragmentMap: {
        "0bf94918-91fd-48e5-a9b9-c8096421ed5e": new Set([
          "2024",
          "2025",
          "14015",
          "1909",
          "2299",
        ]),
        "77b9dc24-8541-4c18-884d-3798e9097d75": new Set(["16022", "14749"]),
        "6300fe10-43bb-41a5-88fc-66913934b928": new Set(["12052"]),
      },
      camera: {
        position: new THREE.Vector3(
          37.7661077230378,
          16.506804101129756,
          34.90037938293105,
        ),
        target: new THREE.Vector3(
          8.455718350089347,
          1.5425332388016395,
          23.60425851131652,
        ),
      },
    });
    this.newTeam({
      teamName: "Construction Innovators Ltd.",
      teamRole: "Contractor",
      teamDescription:
        "Innovative architectural firm specializing in urban design, creating spaces that inspire and transform communities.",
      contactName: "Michael Brown",
      contactPhone: "+49 987 654 321",
      teamProjectId: "d581f18b-8030-41f3-80c7-a8a9d9ec8031",
      fragmentMap: {
        "8a846781-a5e5-448d-ab3b-69d9404ad774": new Set(["13606", "7265"]),
        "6300fe10-43bb-41a5-88fc-66913934b928": new Set([
          "2230",
          "13263",
          "13263.1",
          "13263.2",
          "13263.3",
          "13263.4",
          "13340",
          "13340.1",
          "13416",
          "13416.1",
          "13492",
          "13492.1",
          "13681",
          "13681.1",
          "13757",
          "13757.1",
          "13833",
          "13833.1",
          "13942",
          "15714",
          "15768",
          "1328",
          "1328.1",
          "14076",
          "1269",
          "1269.1",
          "2536",
          "2536.1",
          "1387",
          "1387.1",
          "2477",
          "2477.1",
          "2418",
          "2418.1",
          "1505",
          "1505.1",
          "4726",
          "7073",
          "7073.1",
          "7073.2",
          "7073.3",
          "7073.4",
          "4840",
          "4555",
          "4441",
          "1209",
          "1209.1",
          "1617",
          "1617.1",
          "1676",
          "1676.1",
          "1446",
          "1446.1",
          "1735",
          "1735.1",
          "7330",
          "4212",
          "4327",
          "4270",
          "7606",
          "4384",
          "7537",
          "4498",
          "7468",
          "4612",
          "7399",
          "4669",
          "4783",
          "7143",
        ]),
      },
      camera: {
        position: new THREE.Vector3(
          -37.68052988820838,
          7.812333124771319,
          40.48046677685305,
        ),
        target: new THREE.Vector3(
          -25.987722991348015,
          -2.3622430229106635,
          17.521449428338766,
        ),
      },
    });
    this.newProject({
      projectName: "Heritage Townhouses",
      projectDescription:
        "A residential complex of townhouses designed to blend with the historic charm of the neighborhood while offering modern amenities and sustainable features.",
      projectStatus: "Finished",
      projectCost: "2,000,000.00",
      projectType: "Residential",
      projectAddress: "Montmartre, Paris, France",
      projectFinishDate: new Date("2023-06-15T06:00:00.000Z"),
      projectProgress: "100",
      id: "d9b1c5e8-7c7a-4a0f-8d6b-5e9f5b9e7e7d",
      fragRoute: "../../assets/default-model5.frag",
      jsonRoute: "../../assets/default-model5.json",
    });
    this.newTeam({
      teamName: "EcoSmart Solutions Ltd.",
      teamRole: "MEP",
      teamDescription:
        "Innovative MEP firm specializing in integrating eco-friendly and energy-efficient systems into high-rise buildings.",
      contactName: "Greta Weber",
      contactPhone: "+33 456 789 123",
      teamProjectId: "d9b1c5e8-7c7a-4a0f-8d6b-5e9f5b9e7e7d",
      fragmentMap: {
        "e3b65195-9478-4256-bf27-b06345a17396": new Set(["81052"]),
      },
      camera: {
        position: new THREE.Vector3(
          31.21658384570606,
          9.364908702705275,
          -8.762025929547349,
        ),
        target: new THREE.Vector3(
          3.68089317098457,
          -0.701106895541809,
          -13.794756569717139,
        ),
      },
    });
    this.newTeam({
      teamName: "Heritage Construction Co.",
      teamRole: "Contractor",
      teamDescription:
        "Specializes in constructing residential buildings that integrate modern living with historical aesthetics.",
      contactName: "Charlie Black",
      contactPhone: "+49 30 123 456 789",
      teamProjectId: "d9b1c5e8-7c7a-4a0f-8d6b-5e9f5b9e7e7d",
      fragmentMap: {
        "e3b65195-9478-4256-bf27-b06345a17396": new Set(["73107"]),
        "c4b0c4f7-8871-423a-aea4-14ba6496c4b2": new Set([
          "89272",
          "89384",
          "89221",
          "89326",
        ]),
      },
      camera: {
        position: new THREE.Vector3(
          30.42105940882714,
          63.40220165196557,
          -15.257009466545652,
        ),
        target: new THREE.Vector3(
          7.003759375987601,
          45.058352706257274,
          -15.280961159818538,
        ),
      },
    });
    this.newTeam({
      teamName: "Skyline Engineers AG",
      teamRole: "Structural",
      teamDescription:
        "Expert structural engineering firm with extensive experience in designing high-rise buildings for durability and strength.",
      contactName: "Anna Schmidt",
      contactPhone: "+49 30 987 654 321",
      teamProjectId: "d9b1c5e8-7c7a-4a0f-8d6b-5e9f5b9e7e7d",
      fragmentMap: {
        "c4b0c4f7-8871-423a-aea4-14ba6496c4b2": new Set([
          "82444",
          "82490",
          "82526",
          "82562",
          "82598",
          "82667",
          "82713",
          "82749",
          "82797",
          "82842",
          "82878",
          "82914",
          "82950",
          "82986",
          "83022",
          "83058",
          "83094",
          "83130",
          "83166",
          "83214",
          "83259",
          "83295",
          "83331",
          "83367",
          "83403",
          "83439",
          "83475",
          "83523",
          "83568",
          "83604",
          "83640",
          "83676",
          "83712",
          "83748",
          "83784",
          "83820",
          "83856",
          "83892",
          "83928",
          "83964",
          "84000",
          "84036",
          "84072",
          "84108",
          "84144",
          "84180",
          "84216",
          "84252",
          "84288",
          "84324",
          "84360",
          "84396",
          "84432",
          "84468",
          "84504",
          "84540",
          "84576",
          "84612",
          "84648",
          "84684",
          "84720",
          "84756",
          "84792",
          "84828",
          "84864",
          "84900",
          "84936",
          "84972",
          "85008",
          "85044",
          "85080",
          "85116",
          "85152",
          "85188",
          "85224",
          "85260",
          "85296",
          "85332",
          "85368",
          "85404",
          "85440",
          "85476",
          "85512",
          "85548",
          "85584",
          "85620",
          "85656",
          "85692",
          "85728",
          "85797",
          "85843",
          "85912",
          "85958",
          "85994",
          "86030",
          "86066",
          "86114",
          "86171",
          "86216",
          "86252",
          "86288",
          "86324",
          "86360",
          "86396",
        ]),
      },
      camera: {
        position: new THREE.Vector3(
          30.464836359113487,
          -84.48082651604888,
          -5.86570866471228,
        ),
        target: new THREE.Vector3(
          -4.166282100135081,
          -24.63835969782891,
          -16.395126182877952,
        ),
      },
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
    this.onProjectDeleted(id);
  }

  exportToJSON(fileName: string = "project-info") {
    const json = JSON.stringify(
      { projects: this.projectsList, teams: this.teamsList },
      null,
      2,
    );
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  newProject(data: IProject, id?: string, modelRoute?: string) {
    const nameInUse = this.projectsList.some(
      (project) => project.projectName === data.projectName,
    );

    const projectId = data.id;
    const idInUse = this.projectsList.some(
      (project) => project.id === projectId,
    );

    if (nameInUse) {
      throw new Error(
        `A project with name "${data.projectName}" already exists`,
      );
    }
    if (idInUse) {
      throw new Error(`A project with the ID "${projectId}" already exists`);
    }

    const project = new Project(data, data.id);
    this.projectsList.push(project);
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
    this.onTeamDeleted(id);
  }

  editProject(newData: IProject, originalData: IProject) {
    const nameKept = newData.projectName === originalData.projectName;
    const nameInUse = this.projectsList.some(
      (project) => project.projectName === newData.projectName,
    );

    if (!nameKept && nameInUse) {
      throw new Error(
        `A project with name "${newData.projectName}" already exists`,
      );
    }

    const originalProjectIndex = this.projectsList.findIndex(
      (project) => project.id === originalData.id,
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
      (team) => team.teamName === newData.teamName,
    );

    if (!nameKept && nameInUse) {
      throw new Error(`A team with name "${newData.teamName}" already exists`);
    }

    const originalTeamIndex = this.teamsList.findIndex(
      (team) => team.id === originalData.id,
    );

    if (originalTeamIndex === -1) {
      throw new Error(`Team with ID "${originalData.id}" not found.`);
    }

    const updatedTeam = new Team(newData, originalData.id);
    this.teamsList[originalTeamIndex] = updatedTeam;

    return updatedTeam;
  }
}
