import * as React from "react";
import { Project } from "../class/projects";
import { ProjectsManager } from "../class/projectsManager";

interface Props {
  project: Project;
}

export function DetailsCard(props: Props) {
  return (
    <div className="dashboard-card" style={{ padding: "20px 0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0px 30px",
          marginBottom: 10,
        }}
      >
        <h4 />
        <button className="btn-secondary">
          <p style={{ width: "100%" }}>Edit</p>
        </button>
      </div>
      <div style={{ padding: "0 30px" }}>
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
  );
}
