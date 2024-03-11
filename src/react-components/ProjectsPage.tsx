import * as React from "react"
import * as Router from "react-router-dom"
import { ProjectsManager } from "../class/projectsManager"
import { Sidebar } from "./Sidebar"
import { DetailsPage } from "./DetailsPage"

interface Props {
  projectsManager: ProjectsManager
}

export function ProjectsPage(props: Props) {
    const routeParams = Router.useParams<{ id: string }>()
    console.log("I'm the ID ma boys:", routeParams.id)
    const project = props.projectsManager.getProject()

    return (
        <div className="page" id="project-details">
            <Sidebar projectsManager={new ProjectsManager} />
            <DetailsPage projectsManager={new ProjectsManager} />
        </div>
    )
}