import * as React from "react"
import {
    Project
} from "../class/projects";
import { ProjectsManager } from "../class/projectsManager";

interface Props {
    project: Project
  }  

export function DetailsPageHeader(props: Props) {
    const projectsManager = new ProjectsManager();

    // Event listener for exporting projects to JSON
    const onExportProjects = () => {
        projectsManager.exportToJSON();
    }
    // Event listener for exporting projects to JSON
    const onImportProjects = () => {
        projectsManager.importFromJSON()
    }

    return (
        <header>
            <div>
            <h2 id="project-name" data-project-info="name">{props.project.projectName}</h2> 
            <p
                id="project-description"
                data-project-info="description"
                style={{ color: "#969696" }}
            >{props.project.projectDescription}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "row", rowGap: 20 }}>
            <button onClick={onExportProjects} id="export-projects-btn">
                <p>Export</p>
            </button>
            <button onClick={onImportProjects} id="import-projects-btn">
                <p>Import</p>
            </button>
            </div>
        </header>
    )
}