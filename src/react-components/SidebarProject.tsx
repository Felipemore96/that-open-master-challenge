import * as React from "react"
import { Project, ProjectType } from "../class/projects"

interface Props {
    project: Project
}

export function SidebarProject(props: Props) {

    const iconConversion = (projectType: ProjectType): string => {
        switch (projectType) {
            case "Residential":
                return "home";
            case "Commercial":
                return "corporate_fare";
            case "Institutional":
                return "school";
            case "Mixed-use":
                return "emoji_transportation";
            case "Industrial":
                return "factory";
            case "Heavy civil":
                return "stadium";
            default:
                return ""; // Default icon if type not recognized
        }
    };

    return (
        <li id="nav-project-btn" className="nav-project-btn">
            <span className="material-icons-round">{iconConversion(props.project.projectType)}</span>
            {props.project.projectName}
        </li>
    )
}