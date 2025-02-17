import * as React from "react";
import * as OBC from "@thatopen/components";
import { FragmentIdMap } from "@thatopen/fragments";
import { Project, toggleModal } from "../class/projects";
import { ITeam, Team, TeamRole } from "../class/teams";
import { ProjectsManager } from "../class/projectsManager";
import { ViewerContext } from "./IFCViewer";
import { useNavigate } from "react-router-dom";
import { deleteDocument, getCollection, updateDocument } from "../firebase";

interface Props {
  team: Team;
  project: Project;
  projectsManager: ProjectsManager;
  filterTeams: () => void;
}

export function TeamElement(props: Props) {
  const navigate = useNavigate();

  props.projectsManager.onTeamDeleted = async (id) => {
    await deleteDocument("/teams", id);
    props.filterTeams();
    toggleModal(`delete-modal-${props.team.id}`);
  };

  const onDeleteTeamButton = () => {
    toggleModal(`delete-modal-${props.team.id}`);
  };

  const onTeamInfoButton = () => {
    const teamForm = document.getElementById(
      "team-info-form"
    ) as HTMLFormElement;
    teamForm.reset();
    toggleModal(`info-modal-${props.team.id}`);
  };

  const onCloseDeletePopup = () => {
    toggleModal(`delete-modal-${props.team.id}`);
  };

  const onCloseInfoPopup = () => {
    toggleModal(`info-modal-${props.team.id}`);
  };

  const onEditTeamInfo = () => {
    const editTeamForm = document.getElementById(
      `edit-team-form-${props.team.id}`
    ) as HTMLFormElement;
    editTeamForm.reset();
    toggleModal(`info-modal-${props.team.id}`);
    toggleModal(`edit-info-modal-${props.team.id}`);
  };

  const onCloseEditTeamPopup = () => {
    toggleModal(`edit-info-modal-${props.team.id}`);
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

  const { viewer } = React.useContext(ViewerContext);
  let modelLoaded: boolean = false;

  const onTeamClicked = async (team: Team) => {
    if (!viewer) return;
    // const camera = viewer.camera;
    // if (!(camera instanceof OBC.OrthoPerspectiveCamera)) {
    //   throw new Error(
    //     "TeamsCreator needs the OrthoPerspectiveCamera in order to work",
    //   );
    // }
    // modelLoaded = true;
    // const highlighter = await viewer.tools.get(OBC.FragmentHighlighter);

    // if (team.camera) {
    //   camera.controls.setLookAt(
    //     team.camera.position.x,
    //     team.camera.position.y,
    //     team.camera.position.z,
    //     team.camera.target.x,
    //     team.camera.target.y,
    //     team.camera.target.z,
    //     true,
    //   );
    // }
    // if (team.fragmentMap && Object.keys(team.fragmentMap).length > 0) {
    //   highlighter.highlightByID("select", team.fragmentMap);
    // }
  };

  const onSubmitEditedTeam = async (e) => {
    e.preventDefault();
    const editTeamForm = document.getElementById(
      `edit-team-form-${props.team.id}`
    ) as HTMLFormElement;
    const formData = new FormData(editTeamForm);
    const newTeamData: ITeam = {
      teamName: formData.get("team-name") as string,
      teamRole: formData.get("team-role") as TeamRole,
      teamDescription: formData.get("team-description") as string,
      contactName: formData.get("contact-name") as string,
      contactPhone: formData.get("contact-phone") as string,
      teamProjectId: props.team.teamProjectId,
      id: props.team.id,
    };
    try {
      const updatedTeam = props.projectsManager.editTeam(
        {
          ...newTeamData,
          fragmentMap: props.team.fragmentMap,
          camera: props.team.camera,
        },
        props.team
      );
      console.log(updatedTeam);
      editTeamForm.reset();
      props.filterTeams();
      toggleModal(`edit-info-modal-${props.team.id}`);
      await updateDocument<ITeam>("/teams", props.team.id, newTeamData);
    } catch (err) {
      const errorMessage = document.getElementById("err") as HTMLElement;
      errorMessage.textContent = err;
      toggleModal("error-popup");
    }
  };

  return (
    <div>
      <div className="team-card" onClick={() => onTeamClicked(props.team)}>
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
            onClick={() => onDeleteTeamButton()}
            className="material-icons-round"
            style={{
              padding: 10,
              backgroundColor: "#686868",
              borderRadius: 10,
              fontSize: 17,
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
          <span
            onClick={() => onTeamInfoButton()}
            className="material-icons-round"
            style={{
              padding: 10,
              backgroundColor: "#686868",
              borderRadius: 10,
              fontSize: 17,
            }}
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
      <dialog id={`delete-modal-${props.team.id}`}>
        <div className="error-modal">
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
      <dialog id={`info-modal-${props.team.id}`}>
        <form className="project-form" id="team-info-form">
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
      <dialog id={`edit-info-modal-${props.team.id}`}>
        <form className="project-form" id={`edit-team-form-${props.team.id}`}>
          <h2>Edit Team's Information</h2>
          <div className="input-list">
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">apartment</span>Name
              </label>
              <input
                name="team-name"
                type="text"
                defaultValue={props.team.teamName}
              />
            </div>
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">assignment_ind</span>Role
              </label>
              <select name="team-role" defaultValue={props.team.teamRole}>
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
                name="team-description"
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
                  name="contact-name"
                  defaultValue={props.team.contactName}
                />
                <input
                  name="contact-phone"
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
                onClick={(e) => onSubmitEditedTeam(e)}
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
