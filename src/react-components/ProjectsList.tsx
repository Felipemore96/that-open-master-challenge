import * as React from "react"
import { Project } from "../class/projects"

interface Props {
    project: Project
}

export function ProjectsList(props: Props) {
    return (
    <li id="nav-project-btn" className="nav-project-btn">
        <span className="material-icons-round">Icon</span>
        {props.project.projectName}
    </li>
    )
}