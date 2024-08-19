import * as React from "react";
import { IProject, Project } from "../class/projects";
import { ITeam } from "../class/teams";
import { ProjectsManager } from "../class/projectsManager";

interface Props {
  project: Project;
}

export function DetailsPageHeader(props: Props) {
  return (
    <header style={{ height: "60px", overflow: "hidden" }}>
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
