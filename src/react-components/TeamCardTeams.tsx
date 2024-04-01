import * as React from "react"
import { Project, ProjectType, Team, TeamRole } from "../class/projects"

interface Props {
    team: Team
}

export function TeamCardTeams(props: Props) {

    // // Add click interaction to display team information
    // this.ui.addEventListener("click", (e) => {
    //     e.preventDefault();
    //     updateTeamInfo(this);
    //     toggleModal("team-info-popup");
    //     });

    const iconConversion = (teamRole: TeamRole): string => {
        switch (teamRole) {
            case "BIM Manager":
                return "computer";
            case "Structural":
                return "foundation";
            case "MEP":
                return "plumbing";
            case "Architect":
                return "architecture";
            case "Contractor":
                return "construction";
            default:
                return ""; // Default icon if type not recognized
        }
    };

    return (
        <div className="team-card">
            <span className="material-icons-round"
                style={{
                padding: 10,
                backgroundColor: "#686868",
                borderRadius: 10,
                fontSize: 20
                }}>{iconConversion(props.team.teamRole)}
            </span>
            <p>{props.team.teamRole}</p>
            <p>{props.team.teamName}</p>
        </div>
    )
}