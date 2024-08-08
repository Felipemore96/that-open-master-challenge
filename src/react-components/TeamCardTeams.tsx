import * as React from "react";
import { Project, ProjectType, toggleModal } from "../class/projects";
import { ITeam, Team, TeamRole } from "../class/teams";
import { ProjectsManager } from "../class/projectsManager";
import { cloneUniformsGroups } from "three";

interface Props {
  team: Team;
  projectsManager: ProjectsManager;
  onTeamDeleted: () => void;
}

export function TeamCardTeams(props: Props) {
  const [teams, setTeams] = React.useState<Team[]>(
    props.projectsManager.teamsList
  );
  const [selectedTeam, setSelectedTeam] = React.useState<Team | null>(null);

  props.projectsManager.onProjectDeleted = () => {
    setTeams([...props.projectsManager.teamsList]);
  };

  const onDeleteTeamButton = () => {
    setSelectedTeam(props.team);
    toggleModal("delete-popup");
  };

  const onCloseDeletePopup = () => {
    toggleModal("delete-popup");
  };

  props.projectsManager.onTeamDeleted = (id) => {
    props.onTeamDeleted();
    toggleModal("delete-popup");
  };

  const onTeamInfoButton = () => {
    setSelectedTeam(props.team);
    toggleModal("info-popup");
  };

  const onCloseInfoPopup = () => {
    toggleModal("info-popup");
  };

  const onEditTeamInfo = () => {
    toggleModal("info-popup");
    toggleModal("edit-info-popup");
  };

  const onCloseEditTeamPopup = () => {
    toggleModal("edit-info-popup");
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
            onClick={() => onTeamInfoButton()}
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
              onClick={onCloseDeletePopup}
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
              onClick={() => {
                props.projectsManager.deleteTeam(props.team.id);
              }}
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
        <form>
          <h2>Team's Information</h2>
          <div className="input-list">
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">apartment</span>Name
              </label>
              <p>{props.team.teamName}</p>
            </div>
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">assignment_ind</span>Role
              </label>
              <p>{props.team.teamRole}</p>
            </div>
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">subject</span>Description
              </label>
              <p>{props.team.teamDescription}</p>
            </div>
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">person</span>Contact
              </label>
              <p>{props.team.contactName}</p>
              <p>{props.team.contactPhone}</p>
            </div>
            <div
              style={{
                display: "flex",
                margin: "10px 0px 10px auto",
                columnGap: 10,
              }}
            >
              <button
                onClick={onCloseInfoPopup}
                id="cancel-new-team-btn"
                type="button"
                style={{ backgroundColor: "transparent" }}
              >
                Close
              </button>
              <button
                onClick={() => onEditTeamInfo()}
                id="submit-new-team-btn"
                type="button"
                style={{ backgroundColor: "rgb(18, 145, 18)" }}
              >
                Edit Information
              </button>
            </div>
          </div>
        </form>
      </dialog>
      <dialog id="edit-info-popup">
        <form>
          <h2>Edit Team's Information</h2>
          <div className="input-list">
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">apartment</span>Name
              </label>
              <input
                name="teamName"
                type="text"
                defaultValue={props.team.teamName}
              />
            </div>
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">assignment_ind</span>Role
              </label>
              <select name="teamRole" defaultValue={props.team.teamRole}>
                <option>BIM Manager</option>
                <option>Structural</option>
                <option>MEP</option>
                <option>Architect</option>
                <option>Contractor</option>
              </select>
            </div>
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">subject</span>Description
              </label>
              <textarea
                name="teamDescription"
                cols={30}
                rows={5}
                defaultValue={props.team.teamDescription}
              />
            </div>
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">person</span>Contact
              </label>
              <div
                style={{ display: "flex", flexDirection: "column", rowGap: 2 }}
              >
                <input
                  name="contactName"
                  defaultValue={props.team.contactName}
                />
                <input
                  name="contactPhone"
                  defaultValue={props.team.contactPhone}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                margin: "10px 0px 10px auto",
                columnGap: 10,
              }}
            >
              <button
                onClick={onCloseEditTeamPopup}
                id="cancel-new-team-btn"
                type="button"
                style={{ backgroundColor: "transparent" }}
              >
                Cancel
              </button>
              <button
                // onClick={(e) => onSubmitNewTeam(e)}
                id="submit-new-team-btn"
                type="button"
                style={{ backgroundColor: "rgb(18, 145, 18)" }}
              >
                Accept
              </button>
            </div>
          </div>
        </form>
      </dialog>
    </div>
  );
}
