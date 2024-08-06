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

  const onTeamInfoButton = () => {
    toggleModal("info-popup");
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
      <div className="team-card">
        <div>
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
            <p style={{ fontSize: "15px", margin: "5px 10px" }}>
              {props.team.teamName}
            </p>
          </div>
          <div
            style={{
              alignItems: "center",
              width: "100%",
              padding: 3,
            }}
          >
            <p>Contact name: {props.team.contactName}</p>
            <p>Contact number: {props.team.contactPhone}</p>
            <p>Number of elements: {props.team.numberOfElements}</p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            rowGap: "5px",
            cursor: "pointer",
          }}
        >
          <span
            className="material-icons-round"
            style={{
              padding: 10,
              backgroundColor: "#686868",
              borderRadius: 10,
              fontSize: 17,
            }}
            onClick={onDeleteTeamButton}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#ff4d4d";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#686868";
            }}
          >
            delete
          </span>
          <span
            className="material-icons-round"
            style={{
              padding: 10,
              backgroundColor: "#686868",
              borderRadius: 10,
              fontSize: 17,
            }}
            onClick={onTeamInfoButton}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#468f3f";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#686868";
            }}
          >
            info
          </span>
        </div>
      </div>
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
      <dialog id="info-popup">
        <div id="info-message"></div>
      </dialog>
    </div>
  );
}
