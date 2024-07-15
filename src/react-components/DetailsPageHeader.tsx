import * as React from "react";
import { Project } from "../class/projects";
import { ProjectsManager } from "../class/projectsManager";

interface Props {
  project: Project;
}

export function DetailsPageHeader(props: Props) {
  const projectsManager = new ProjectsManager();

  function onClickImportButton() {}
  function onClickExportButton() {}

  return (
    <header>
      <div>
        <h2 id="project-name" data-project-info="name">
          {props.project.projectName}
        </h2>
        <p
          id="project-description"
          data-project-info="description"
          style={{ color: "#969696" }}
        >
          {props.project.projectDescription}
        </p>
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={onClickImportButton} className="btn-secondary">
          <span style={{ width: "100%" }} className="material-icons-round">
            file_upload
          </span>
        </button>
        <button onClick={onClickExportButton} className="btn-secondary">
          <span style={{ width: "100%" }} className="material-icons-round">
            file_download
          </span>
        </button>
      </div>
    </header>
  );
}
