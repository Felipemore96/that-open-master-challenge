import * as React from "react";
import {
  IProject,
  Project,
  ProjectStatus,
  ProjectType,
} from "../class/projects";
import { toggleModal } from "../class/projects";
import { ProjectsManager } from "../class/projectsManager";

interface Props {
  project: Project;
  projectsManager: ProjectsManager;
}

export function DetailsCard(props: Props) {
  const onClickEditButton = () => {
    toggleModal("edit-project-modal");
  };
  const onCancelEdits = () => {
    toggleModal("edit-project-modal");
  };
  const onSubmitEditedProject = (e) => {
    e.preventDefault();
    const projectForm = document.getElementById(
      "edit-project-form",
    ) as HTMLFormElement;
    const formData = new FormData(projectForm);
    const newProjectData: IProject = {
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
      // const projectsCollection = getCollection<IProject>("/projects");
      // Firestore.addDoc(projectsCollection, projectData);

      const updatedProject = props.projectsManager.editProject(
        newProjectData,
        props.project,
      );
      console.log(updatedProject);
      // getFirestoreProjects();
      toggleModal("edit-project-modal");
    } catch (err) {
      const errorMessage = document.getElementById("err") as HTMLElement;
      errorMessage.textContent = err;
      toggleModal("error-popup");
    }
  };

  const onCloseErrorPopup = () => {
    toggleModal("error-popup");
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div>
      <div
        className="dashboard-card"
        style={{ padding: "15px", maxHeight: "30vh" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <h4 />
          <button onClick={onClickEditButton} className="btn-secondary">
            <p style={{ width: "100%" }}>Edit</p>
          </button>
        </div>
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div className="card-content">
              <div className="card-property">
                <p style={{ color: "#969696" }}>Status</p>
                <p id="project-status" data-project-info="status">
                  {props.project.projectStatus}
                </p>
              </div>
              <div className="card-property">
                <p style={{ color: "#969696" }}>Cost</p>
                <p id="project-cost" data-project-info="cost">
                  {props.project.projectCost}
                </p>
              </div>
              <div className="card-property">
                <p style={{ color: "#969696" }}>Type</p>
                <p id="project-type" data-project-info="type">
                  {props.project.projectType}
                </p>
              </div>
              <div className="card-property">
                <p style={{ color: "#969696" }}>Address</p>
                <p id="project-address" data-project-info="address">
                  {props.project.projectAddress}
                </p>
              </div>
              <div className="card-property">
                <p style={{ color: "#969696" }}>Finish Date</p>
                <p id="project-finish-date" data-project-info="finishDate">
                  {props.project.projectFinishDate.toDateString()}
                </p>
              </div>
              <div
                className="card-property"
                style={{
                  backgroundColor: "#404040",
                  borderRadius: 9999,
                  overflow: "auto",
                }}
              >
                <div
                  id="project-progress"
                  data-project-info="progress"
                  style={{
                    width: `${props.project.projectProgress}%`,
                    backgroundColor: "#468f3f",
                    padding: "4px 0",
                    textAlign: "center",
                  }}
                >
                  {props.project.projectProgress}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
      <dialog id="edit-project-modal">
        <form className="project-form" id="edit-project-form">
          <h2>Edit Project</h2>
          <div className="input-list">
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">apartment</span>Name
              </label>
              <input
                name="project-name"
                type="text"
                defaultValue={props.project.projectName}
              />
            </div>
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">subject</span>Description
              </label>
              <textarea
                name="project-description"
                cols={30}
                rows={5}
                defaultValue={props.project.projectDescription}
              />
            </div>
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">
                  not_listed_location
                </span>
                Status
              </label>
              <select
                name="project-status"
                defaultValue={props.project.projectStatus}
              >
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
                defaultValue={props.project.projectCost}
              />
            </div>
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">category</span>Type
              </label>
              <select
                name="project-type"
                defaultValue={props.project.projectType}
              >
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
                defaultValue={props.project.projectAddress}
              />
            </div>
            <div className="form-field-container">
              <label htmlFor="finishDate">
                <span className="material-icons-round">calendar_month</span>
                Finish Date
              </label>
              <input
                name="finishDate"
                type="date"
                defaultValue={formatDate(props.project.projectFinishDate)}
              />
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
                defaultValue={props.project.projectProgress}
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
                onClick={onCancelEdits}
                id="cancel-new-project-btn"
                type="button"
                style={{ backgroundColor: "transparent" }}
              >
                Cancel
              </button>
              <button
                onClick={(e) => onSubmitEditedProject(e)}
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
    </div>
  );
}
