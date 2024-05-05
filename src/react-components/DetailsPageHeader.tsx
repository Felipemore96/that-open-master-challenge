import * as React from "react";
import { Project } from "../class/projects";
import { ProjectsManager } from "../class/projectsManager";

interface Props {
  project: Project;
}

export function DetailsPageHeader(props: Props) {
  const projectsManager = new ProjectsManager();

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
    </header>
  );
}
