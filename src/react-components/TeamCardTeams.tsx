import * as React from "react";
import { Project, ProjectType, toggleModal } from "../class/projects";
import { ITeam, Team, TeamRole } from "../class/teams";
import { ProjectsManager } from "../class/projectsManager";

interface Props {
  team: Team;
  projectsManager: ProjectsManager;
  onTeamDeleted: () => void;
}

export function TeamCardTeams(props: Props) {
  const [teams, setTeams] = React.useState<Team[]>(
    props.projectsManager.teamsList
  );
  props.projectsManager.onProjectDeleted = () => {
    setTeams([...props.projectsManager.teamsList]);
  };
  const onDeleteTeam = () => {
    props.projectsManager.deleteTeam(props.team.id);
    props.onTeamDeleted();
    console.log(props.projectsManager.teamsList);
    toggleModal("delete-popup");
  };

  const onDeleteTeamButton = () => {
    toggleModal("delete-popup");
  };

  const onClosePopup = () => {
    toggleModal("delete-popup");
  };

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
    <div>
      <dialog id="delete-popup">
        <div id="error-message">
          <section style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "16px", margin: "10px" }}>
              Are you sure you want to delete the team: "
              <strong>{props.team.teamName}</strong>"?
            </p>
          </section>
          <footer
            style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
          >
            <button
              onClick={onClosePopup}
              type="button"
              style={{
                padding: "10px 20px",
                backgroundColor: "#535353",
                color: "#fff",
              }}
            >
              Close
            </button>
            <button
              onClick={(e) => onDeleteTeam()}
              type="button"
              style={{
                padding: "10px 20px",
                backgroundColor: "#ff4d4d",
                color: "#fff",
              }}
            >
              Delete
            </button>
          </footer>
        </div>
      </dialog>
      <div className="team-card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div>
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
          <p style={{ fontSize: "15px", margin: "10px" }}>
            {props.team.teamName}
          </p>
          <div
            style={{ paddingLeft: "20px", cursor: "pointer" }}
            onClick={onDeleteTeamButton}
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: 3,
          }}
        >
          <p>{props.team.contactName}</p>
          <p>{props.team.contactPhone}</p>
        </div>
        <div>
          <p>Number of elements: {props.team.numberOfElements}</p>
        </div>
      </div>
    </div>
  );
}
