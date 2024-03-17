import * as React from "react"
import {
    IProject,
    ProjectStatus,
    ProjectType,
    ITeam,
    TeamRole,
    toggleModal,
    Project
} from "../class/projects";
import * as Router from "react-router-dom"
import { ProjectsManager } from "../class/projectsManager";

interface Props {
    projectsManager: ProjectsManager
  }

export function DetailsPageHeader(props: Props) {
    const projectsManager = new ProjectsManager();

    const routeParams = Router.useParams<{ id: string }>()
    if (!routeParams.id) {return (<p>Project ID is needed to see this page</p>)}
    console.log("routeParams", routeParams.id)
    console.log("projectsList", props.projectsManager.projectsList)
    const project = props.projectsManager.getProject(routeParams.id)
    console.log("project", project)
    if (!project) {return (<p>The project with ID {routeParams.id} wasn't found.</p>)}

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
            <h2 id="project-name" data-project-info="name">{project.projectName}</h2> 
            <p
                id="project-description"
                data-project-info="description"
                style={{ color: "#969696" }}
            >{project.projectDescription}</p>
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