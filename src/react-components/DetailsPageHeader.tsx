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

    const [projects, setProjects] = React.useState<Project[]>(props.projectsManager.projectsList)
    

    const routeParams = Router.useParams<{ id: string }>()
    if (!routeParams.id) {return (<p>Project ID is needed to see this page</p>)}
    const currentProject = props.projectsManager.getProject(routeParams.id)
    if (!currentProject) { return (<p>The project with ID {routeParams.id} wasn't found.</p>) }

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
            <h2 id="project-name" data-project-info="name">{currentProject.projectName}</h2> 
            <p
                id="project-description"
                data-project-info="description"
                style={{ color: "#969696" }}
            >{currentProject.projectDescription}</p>
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