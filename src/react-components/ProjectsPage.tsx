import * as React from "react"
import * as Router from "react-router-dom"
import { ProjectsManager } from "../class/projectsManager"
import { Sidebar } from "./Sidebar"
import { DetailsPage } from "./DetailsPage"

interface Props {
  projectsManager: ProjectsManager
}

export function ProjectsPage(props: Props) {

    const routeParams = Router.useParams<{id: string}>()
    if (!routeParams.id) {return (<p>Project ID is needed to see this page</p>)}
    const project = props.projectsManager.getProject(routeParams.id)
    if (!project) {return (<p>The project with ID {routeParams.id} wasn't found</p>)}

    return (
        <div className="page" id="project-details">
            <Sidebar projectsManager={new ProjectsManager} />
            <DetailsPage projectsManager={new ProjectsManager} />
        </div>
    )
}