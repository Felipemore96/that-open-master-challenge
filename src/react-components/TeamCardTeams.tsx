import * as React from "react";
import { Project, ProjectType, Team, TeamRole } from "../class/projects";

interface Props {
  team: Team;
  // projectsManager: ProjectsManager;
}

export function TeamCardTeams(props: Props) {
  const onDeleteTeam = () => {};

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
        return "";
    }
  };

  return (
    <div className="team-card">
      <div style={{ paddingRight: "20px" }}>
        <span
          className="material-icons-round"
          style={{
            padding: 10,
            backgroundColor: "#686868",
            borderRadius: 10,
            fontSize: 20,
          }}
        >
          {iconConversion(props.team.teamRole)}
        </span>
      </div>
      <div style={{ flex: "1" }}>
        <p style={{ fontSize: "18px", fontWeight: "bold", margin: "5px 0" }}>
          {props.team.teamRole}
        </p>
        <p style={{ fontSize: "16px", margin: "5px 0" }}>
          {props.team.teamName}
        </p>
        <p style={{ margin: "5px 0" }}>Contact: {props.team.contactName}</p>
        <p style={{ margin: "5px 0" }}>Phone: {props.team.contactPhone}</p>
      </div>
      <div
        style={{ paddingLeft: "20px", cursor: "pointer" }}
        onClick={onDeleteTeam}
      >
        <span
          className="material-icons-round"
          style={{
            padding: 10,
            backgroundColor: "#686868",
            borderRadius: 10,
            fontSize: 20,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#ff4d4d";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#686868";
          }}
        >
          delete
        </span>
      </div>
    </div>
  );
}
