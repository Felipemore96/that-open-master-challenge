import * as React from "react";
import * as Router from "react-router-dom";
import { useNavigate } from "react-router-dom";
import * as OBC from "openbim-components";
import {
  IProject,
  Project,
  ProjectStatus,
  ProjectType,
  toggleModal,
} from "../class/projects";
import { ITeam } from "../class/teams";
import { ProjectsManager } from "../class/projectsManager";
import { SidebarProject } from "./SidebarProject";
import { SearchBox } from "./SearchBox";
import { getCollection } from "../firebase";
import * as Firestore from "firebase/firestore";
import * as THREE from "three";

interface Props {
  projectsManager: ProjectsManager;
}

const projectsCollection = getCollection<IProject>("/projects");

export function Sidebar(props: Props) {
  const [projects, setProjects] = React.useState<Project[]>(
    props.projectsManager.projectsList,
  );
  const [loading, setLoading] = React.useState(true);
  props.projectsManager.onProjectCreated = () => {
    setProjects([...props.projectsManager.projectsList]);
  };
  const navigate = useNavigate();

  const getFirestoreProjects = async () => {
    const firebaseProjects = await Firestore.getDocs(projectsCollection);
    for (const doc of firebaseProjects.docs) {
      const data = doc.data();
      const project: IProject = {
        ...data,
        projectFinishDate: (
          data.projectFinishDate as unknown as Firestore.Timestamp
        ).toDate(),
      };
      try {
        props.projectsManager.newProject(project, doc.id);
      } catch (error) {
        const previousProject = props.projectsManager.getProject(doc.id);
        props.projectsManager.editProject(project, previousProject);
      }
    }
    setLoading(false);
  };

  React.useEffect(() => {
    getFirestoreProjects();
  }, []);

  const projectsCards = projects.map((project) => {
    return (
      <Router.Link to={`/project/${project.id}`} key={project.id}>
        <SidebarProject project={project} />
      </Router.Link>
    );
  });

  React.useEffect(() => {}, [projects]);

  const onNewProject = () => {
    toggleModal("new-project-modal");
  };

  const onHomeClick = () => {
    navigate("/");
  };

  const onCancelNewProject = () => {
    const projectForm = document.getElementById(
      "new-project-modal",
    ) as HTMLFormElement;
    if (!(projectForm && projectForm instanceof HTMLDialogElement)) {
      return;
    }
    projectForm.close();
  };

  const onCloseErrorPopup = () => {
    toggleModal("error-popup");
  };

  const onSubmitNewProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectForm = document.getElementById(
      "new-project-form",
    ) as HTMLFormElement;
    const formData = new FormData(projectForm);
    const projectData: IProject = {
      projectName: formData.get("project-name") as string,
      projectDescription: formData.get("project-description") as string,
      projectStatus: formData.get("project-status") as ProjectStatus,
      projectCost: formData.get("project-cost") as string,
      projectType: formData.get("project-type") as ProjectType,
      projectAddress: formData.get("project-address") as string,
      projectFinishDate: new Date(formData.get("finishDate") as string),
      projectProgress: formData.get("project-progress") as string,
    };
    try {
      const docRef = await Firestore.addDoc(projectsCollection, projectData);
      const projectId = docRef.id;
      props.projectsManager.newProject(projectData, projectId);
      navigate(`/project/${projectId}`);
      projectForm.reset();
      toggleModal("new-project-modal");
    } catch (err) {
      const errorMessage = document.getElementById("err") as HTMLElement;
      errorMessage.textContent = err;
      toggleModal("error-popup");
    }
  };

  const onProjectSearch = (value: string) => {
    const filteredProjects = props.projectsManager.projectsList.filter(
      (project) => {
        return project.projectName.includes(value);
      },
    );
    setProjects(filteredProjects);
  };

  function onClickImportButton() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    const reader = new FileReader();
    reader.addEventListener("load", async () => {
      const json = reader.result;
      if (!json) {
        return;
      }
      const data = JSON.parse(json as string);

      for (const item of data) {
        try {
          if (isProject(item)) {
            item.projectFinishDate = new Date(item.projectFinishDate);
            const docRef = await Firestore.addDoc(projectsCollection, item);
            const projectId = docRef.id;
            props.projectsManager.newProject(item, projectId);
            navigate(`/project/${projectId}`);
          } else if (isTeam(item)) {
            const fragmentIdMap: OBC.FragmentIdMap = {};
            for (const key in item.fragmentMap) {
              if (Array.isArray(item.fragmentMap[key])) {
                fragmentIdMap[key] = new Set(item.fragmentMap[key]);
              }
            }
            item.fragmentMap = fragmentIdMap;
            const teamCamera:
              | { position: THREE.Vector3; target: THREE.Vector3 }
              | undefined = undefined;

            const teamsCollection = getCollection<ITeam>("/teams");
            const firebaseTeamData = {
              ...item,
              fragmentMap: fragmentIdMap
                ? Object.fromEntries(
                    Object.entries(fragmentIdMap).map(([key, value]) => [
                      key,
                      Array.from(value),
                    ]),
                  )
                : undefined,
              camera: teamCamera
                ? {
                    position: {
                      x: teamCamera.position.x,
                      y: teamCamera.position.y,
                      z: teamCamera.position.z,
                    },
                    target: {
                      x: teamCamera.target.x,
                      y: teamCamera.target.y,
                      z: teamCamera.target.z,
                    },
                  }
                : undefined,
            };
            const docRef = await Firestore.addDoc(
              teamsCollection,
              firebaseTeamData,
            );
            const teamId = docRef.id;
            props.projectsManager.newTeam(item, teamId);
            console.log("Team created");
          }
        } catch (error) {
          console.error("Error processing item:", item, error);
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
    console.log(props.projectsManager.projectsList);
    input.click();
  }

  function isProject(item: any): item is IProject {
    return (
      "projectName" in item &&
      "projectDescription" in item &&
      "projectStatus" in item &&
      "projectCost" in item &&
      "projectType" in item &&
      "projectAddress" in item &&
      "projectFinishDate" in item &&
      "projectProgress" in item
    );
  }

  function isTeam(item: any): item is ITeam {
    return (
      "teamName" in item &&
      "teamRole" in item &&
      "teamDescription" in item &&
      "contactName" in item &&
      "contactPhone" in item &&
      "teamProjectId" in item
    );
  }

  function onClickExportButton() {
    const projectsAndTeamsData = {
      projectsList: props.projectsManager.projectsList,
      teamsList: props.projectsManager.teamsList,
    };
    const json = JSON.stringify(projectsAndTeamsData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const fileName: string = "projects";
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <aside id="sidebar">
      <dialog id="new-project-modal">
        <form className="project-form" id="new-project-form">
          <h2>New Project</h2>
          <div className="input-list">
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">apartment</span>Name
              </label>
              <input
                name="project-name"
                type="text"
                placeholder="What's the name of your project?"
              />
              <p
                style={{
                  color: "gray",
                  fontSize: "var(--font-sm)",
                  marginTop: 5,
                  fontStyle: "italic",
                }}
              >
                TIP: Give it a short name
              </p>
            </div>
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">subject</span>Description
              </label>
              <textarea
                name="project-description"
                cols={30}
                rows={5}
                placeholder="Project's description"
                defaultValue={""}
              />
            </div>
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">
                  not_listed_location
                </span>
                Status
              </label>
              <select name="project-status">
                <option>Pending</option>
                <option>Active</option>
                <option>Finished</option>
              </select>
            </div>
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">euro</span>Cost
              </label>
              <input
                name="project-cost"
                type="text"
                placeholder="Project's cost"
              />
            </div>
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">category</span>Type
              </label>
              <select name="project-type">
                <option>Residential</option>
                <option>Commercial</option>
                <option>Institutional</option>
                <option>Mixed-use</option>
                <option>Industrial</option>
                <option>Heavy civil</option>
              </select>
            </div>
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">place</span>Address
              </label>
              <input
                name="project-address"
                type="text"
                placeholder="Project's address"
              />
            </div>
            <div className="form-field-container">
              <label htmlFor="finishDate">
                <span className="material-icons-round">calendar_month</span>
                Finish Date
              </label>
              <input name="finishDate" type="date" />
            </div>
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">
                  published_with_changes
                </span>
                Progress
              </label>
              <input
                name="project-progress"
                type="text"
                placeholder="Project's progress from 0 to 100"
              />
            </div>
            <div
              style={{
                display: "flex",
                margin: "10px 0px 10px auto",
                columnGap: 10,
              }}
            >
              <button
                onClick={onCancelNewProject}
                id="cancel-new-project-btn"
                type="button"
                style={{ backgroundColor: "transparent" }}
              >
                Cancel
              </button>
              <button
                onClick={(e) => onSubmitNewProject(e)}
                id="submit-new-project-btn"
                type="button"
                style={{ backgroundColor: "rgb(18, 145, 18)" }}
              >
                Accept
              </button>
            </div>
          </div>
        </form>
      </dialog>
      <dialog id="error-popup">
        <div id="error-message">
          <p id="err" />
          <button
            onClick={onCloseErrorPopup}
            id="close-error-popup"
            type="button"
          >
            Close
          </button>
        </div>
      </dialog>
      <img
        onClick={onHomeClick}
        id="company-logo"
        src="../assets/company-logo.svg"
        alt="Construction Company"
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        <button
          onClick={onClickExportButton}
          className="btn-secondary"
          style={{ width: "100%", height: "100%" }}
        >
          <p>Download Projects</p>
        </button>
        <button
          onClick={onClickImportButton}
          className="btn-secondary"
          style={{ width: "100%", height: "100%" }}
        >
          <p>Upload Projects</p>
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center", columnGap: 10 }}>
        <button
          onClick={onNewProject}
          id="new-project-btn"
          className="btn-secondary"
        >
          <span style={{ width: "100%" }} className="material-icons-round">
            add
          </span>
        </button>
        <SearchBox onChange={(value) => onProjectSearch(value)} />
      </div>
      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length > 0 ? (
        <div className="nav-buttons">{projectsCards}</div>
      ) : (
        <p>There is no projects to display</p>
      )}
    </aside>
  );
}
