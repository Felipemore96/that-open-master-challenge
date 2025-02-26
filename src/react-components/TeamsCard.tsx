import * as React from "react";
import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import * as THREE from "three";
import { Project, toggleModal } from "../class/projects";
import { ITeam, Team, TeamRole } from "../class/teams";
import { ProjectsManager } from "../class/projectsManager";
import { TeamElement } from "./TeamElement";
import { WorldContext } from "./IFCViewer";
import { getCollection } from "../firebase";
import * as Firestore from "firebase/firestore";

interface Props {
  project: Project;
  projectsManager: ProjectsManager;
}

export function TeamsCard(props: Props) {
  const [teams, setTeams] = React.useState<Team[]>(
    props.projectsManager.teamsList
  );
  props.projectsManager.onTeamCreated = () => {
    setTeams([...props.projectsManager.teamsList]);
  };

  const getFirestoreTeams = async () => {
    const teamsCollection = getCollection<ITeam>("/teams");
    const firebaseTeams = await Firestore.getDocs(teamsCollection);
    for (const doc of firebaseTeams.docs) {
      const data = doc.data();
      const team: ITeam = {
        ...data,
      };

      try {
        props.projectsManager.createTeam(team, doc.id);
      } catch (error) {
        const previousTeam = props.projectsManager.getTeam(doc.id);
        if (previousTeam) {
          props.projectsManager.editTeam(team, previousTeam);
        }
      }
    }
    filterTeams();
  };

  React.useEffect(() => {
    getFirestoreTeams();
  }, []);

  const filterTeams = () => {
    const filteredTeams = props.projectsManager.teamsList.filter(
      (team) => team.teamProjectId === props.project.id
    );
    setTeams(filteredTeams);
  };

  React.useEffect(() => {
    filterTeams();
  }, [props.project.id]);

  const teamsCards = teams.map((team) => {
    return (
      <TeamElement
        key={team.id}
        team={team}
        project={props.project}
        projectsManager={props.projectsManager}
        filterTeams={filterTeams}
      />
    );
  });

  const { world, components } = React.useContext(WorldContext);
  let modelLoaded: boolean = false;

  const onNewTeam = () => {
    toggleModal("new-team-modal");
  };

  const onCloseErrorPopup = () => {
    toggleModal("error-popup");
  };

  const onCancelNewTeam = () => {
    const teamForm = document.getElementById(
      "new-team-form"
    ) as HTMLFormElement;
    teamForm.reset();
    toggleModal("new-team-modal");
  };

  const onSubmitNewTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    const teamForm = document.getElementById(
      "new-team-form"
    ) as HTMLFormElement;

    const formData = new FormData(teamForm);
    const currentProjectId = props.project.id;

    let guids: string[] = [];
    let teamCamera:
      | { position: THREE.Vector3; target: THREE.Vector3 }
      | undefined = undefined;

    if (world && components) {
      const camera = world.camera;
      if (!(camera instanceof OBC.OrthoPerspectiveCamera)) {
        throw new Error(
          "TeamsCreator needs the OrthoPerspectiveCamera in order to work"
        );
      }
      modelLoaded = true;
      const fragments = components.get(OBC.FragmentsManager);
      const highlighter = components.get(OBCF.Highlighter);
      guids = fragments.fragmentIdMapToGuids(highlighter.selection.select);

      const position = new THREE.Vector3();
      camera.controls.getPosition(position);
      const target = new THREE.Vector3();
      camera.controls.getTarget(target);
      teamCamera = { position, target };
    }
    const teamData: ITeam = {
      teamName: formData.get("teamName") as string,
      teamRole: formData.get("teamRole") as TeamRole,
      teamDescription: formData.get("teamDescription") as string,
      contactName: formData.get("contactName") as string,
      contactPhone: formData.get("contactPhone") as string,
      teamProjectId: currentProjectId,
      ifcGuids: guids,
      camera: teamCamera,
    };

    try {
      const teamsCollection = getCollection<ITeam>("/teams");
      const firebaseTeamData = {
        ...teamData,
        camera: teamCamera
          ? {
              position: {
                x: teamCamera.position.x,
                y: teamCamera.position.y,
                z: teamCamera.position.z,
              },
              target: {
                x: teamCamera.target.x,
                y: teamCamera.target.y,
                z: teamCamera.target.z,
              },
            }
          : undefined,
      };
      const docRef = await Firestore.addDoc(teamsCollection, firebaseTeamData);
      const teamId = docRef.id;
      const team = props.projectsManager.createTeam(teamData, teamId);
      teamForm.reset();
      toggleModal("new-team-modal");
      filterTeams();
    } catch (err) {
      const errorMessage = document.getElementById("err") as HTMLElement;
      errorMessage.textContent = err;
      toggleModal("error-popup");
    }
  };

  return (
    <div className="dashboard-card">
      <div style={{ padding: "15px", height: "100%" }}>
        <div id="teams-header">
          <h4>Teams</h4>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              columnGap: 15,
            }}
          >
            <button
              onClick={onNewTeam}
              id="new-team-btn"
              className="btn-secondary"
            >
              <span style={{ width: "100%" }} className="material-icons-round">
                add
              </span>
            </button>
          </div>
        </div>
        {teams.length > 0 ? (
          <div id="teams-list">{teamsCards}</div>
        ) : (
          <h4
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            There is no teams to display
          </h4>
        )}
      </div>
      <dialog id="new-team-modal">
        <form id="new-team-form">
          <h2>New Team</h2>
          <div className="input-list">
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">apartment</span>Name
              </label>
              <input
                name="teamName"
                type="text"
                placeholder="Name of the Company"
              />
            </div>
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">assignment_ind</span>Role
              </label>
              <select name="teamRole">
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
                placeholder="General description or the role"
                defaultValue={""}
              />
            </div>
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">person</span>Contact
              </label>
              <div
                style={{ display: "flex", flexDirection: "column", rowGap: 2 }}
              >
                <input name="contactName" placeholder="Contact Name" />
                <input name="contactPhone" placeholder="Phone Number" />
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
                onClick={onCancelNewTeam}
                id="cancel-new-team-btn"
                type="button"
                style={{ backgroundColor: "transparent" }}
              >
                Cancel
              </button>
              <button
                onClick={(e) => onSubmitNewTeam(e)}
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
      <dialog id="error-popup">
        <div id="error-message">
          <p id="err" />
          <button
            onClick={onCloseErrorPopup}
            id="close-error-popup"
            type="button"
          >
            Close
          </button>
        </div>
      </dialog>
    </div>
  );
}
