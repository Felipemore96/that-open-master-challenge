import * as React from "react";
import * as Router from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ProjectsManager } from "../class/projectsManager";
import {
  IProject,
  Project,
  ProjectStatus,
  ProjectType,
  toggleModal,
} from "../class/projects";
import { HomePageProjectCard } from "./HomePageProjectCard";
import * as Firestore from "firebase/firestore";
import { getCollection } from "../firebase";
import { v4 as uuidv4 } from "uuid";

interface Props {
  projectsManager: ProjectsManager;
}

const projectsCollection = getCollection<IProject>("/projects");

export function HomePage(props: Props) {
  const [projects, setProjects] = React.useState<Project[]>(
    props.projectsManager.projectsList
  );
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
        props.projectsManager.createProject(project, doc.id);
      } catch (error) {
        //project already exists so update its properties
      }
    }
  };

  React.useEffect(() => {
    getFirestoreProjects();
  }, []);

  const projectCards = projects.map((project) => {
    return (
      <Router.Link to={`/project/${project.id}`} key={project.id}>
        <HomePageProjectCard project={project} />
      </Router.Link>
    );
  });

  React.useEffect(() => {}, [projects]);

  const onNewProject = () => {
    toggleModal("new-project-modal");
  };

  const onCancelNewProject = () => {
    const projectForm = document.getElementById(
      "new-project-modal"
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
      "new-project-form"
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
      props.projectsManager.createProject(projectData, projectId);
      navigate(`/project/${projectId}`);
      projectForm.reset();
      toggleModal("new-project-modal");
    } catch (err) {
      const errorMessage = document.getElementById("err") as HTMLElement;
      errorMessage.textContent = err;
      toggleModal("error-popup");
    }
  };

  return (
    <div className="homepage">
      <div className="homepage-header">
        <img
          id="homepage-company-logo"
          src="./assets/company-logo.svg"
          alt="Construction Company"
        />
        <button
          onClick={onNewProject}
          id="homepage-new-project-btn"
          className="btn-secondary"
          style={{ width: "150px", height: "60px", padding: 15, fontSize: 12 }}
        >
          <h4
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              width: "100%",
            }}
          >
            Add New Project
          </h4>
        </button>
      </div>
      <div id="projects-list" className="projects-list">
        {projectCards}
      </div>
      <dialog id="new-project-modal">
        <form id="new-project-form" className="project-form">
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
    </div>
  );
}
