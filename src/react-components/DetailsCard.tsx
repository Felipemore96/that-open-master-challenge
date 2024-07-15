import * as React from "react";
import { Project } from "../class/projects";
import { toggleModal } from "../class/projects";

interface Props {
  project: Project;
}

export function DetailsCard(props: Props) {
  const onClickEditButton = () => {};
  const onCancelEdits = () => {};
  const onSubmitEditedProject = (e) => {};
  const onCloseErrorPopup = () => {
    toggleModal("error-popup");
  };

  return (
    <div className="dashboard-card" style={{ padding: "15px" }}>
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
      <dialog id="new-project-modal">
        <form id="new-project-form">
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
