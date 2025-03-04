import * as React from "react";
import { Project } from "../class/projects";

interface Props {
  project: Project;
}

export function HomePageProjectCard(props: Props) {
  return (
    <div className="homepage-project-card">
      <div className="homepage-card-content">
        <h2 id="project-name" data-project-info="name">
          {props.project.projectName}
        </h2>
        <div className="homepage-card-property">
          <h5>Status</h5>
          <h5 id="project-status" data-project-info="status">
            {props.project.projectStatus}
          </h5>
        </div>
        <div className="homepage-card-property">
          <h5>Address</h5>
          <h5 id="project-address" data-project-info="address">
            {props.project.projectAddress}
          </h5>
        </div>
        <div className="progress-bar">
          <div className="progress-label">Progress</div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${props.project.projectProgress}%` }}
            ></div>
          </div>
          <div className="progress-percentage">
            {props.project.projectProgress}%
          </div>
        </div>
      </div>
    </div>
  );
}
