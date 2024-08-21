import * as React from "react";
import * as OBC from "openbim-components";
import * as THREE from "three";
import { IProject, Project, toggleModal } from "../class/projects";
import { ITeam, Team, TeamRole } from "../class/teams";
import { ProjectsManager } from "../class/projectsManager";
// import * as Firestore from "firebase/firestore";
// import { getCollection } from "../firebase";
import { TeamElement } from "./TeamElement";
import { ViewerContext } from "./IFCViewer";
import { getCollection } from "../firebase";
import * as Firestore from "firebase/firestore";
import { Simulate } from "react-dom/test-utils";
import keyDown = Simulate.keyDown;

interface Props {
  project: Project;
  projectsManager: ProjectsManager;
}

export function TeamsCard(props: Props) {
  const [teams, setTeams] = React.useState<Team[]>(
    props.projectsManager.teamsList,
  );
  props.projectsManager.onTeamCreated = () => {
    setTeams([...props.projectsManager.teamsList]);
  };

  const getFirestoreTeams = async () => {
    const teamsCollection = getCollection<ITeam>("/teams");
    const firebaseTeams = await Firestore.getDocs(teamsCollection);
    for (const doc of firebaseTeams.docs) {
      const data = doc.data();
      const fragmentIdMap: OBC.FragmentIdMap = {};
      for (const key in data.fragmentMap) {
        if (Object.prototype.hasOwnProperty.call(data.fragmentMap, key)) {
          const value = data.fragmentMap[key];
          if (Array.isArray(value)) {
            fragmentIdMap[key] = new Set(value);
          }
        }
      }
      const team: ITeam = {
        ...data,
        fragmentMap: fragmentIdMap,
      };

      try {
        props.projectsManager.newTeam(team, doc.id);
      } catch (error) {
        //project already exists so update its properties
      }
    }
    filterTeams();
  };

  React.useEffect(() => {
    getFirestoreTeams();
  }, []);

  const filterTeams = () => {
    const filteredTeams = props.projectsManager.teamsList.filter(
      (team) => team.teamProjectId === props.project.id,
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

  const { viewer } = React.useContext(ViewerContext);
  let modelLoaded: boolean = false;

  const onNewTeam = () => {
    toggleModal("new-team-modal");
  };

  const onCloseErrorPopup = () => {
    toggleModal("error-popup");
  };

  const onCancelNewTeam = () => {
    const teamForm = document.getElementById(
      "new-team-form",
    ) as HTMLFormElement;
    teamForm.reset();
    toggleModal("new-team-modal");
  };

  const onSubmitNewTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    const teamForm = document.getElementById(
      "new-team-form",
    ) as HTMLFormElement;

    const formData = new FormData(teamForm);
    const currentProjectId = props.project.id;

    let fragmentMap: OBC.FragmentIdMap | undefined = undefined;
    let teamCamera:
      | { position: THREE.Vector3; target: THREE.Vector3 }
      | undefined = undefined;

    if (viewer) {
      const camera = viewer.camera;
      if (!(camera instanceof OBC.OrthoPerspectiveCamera)) {
        throw new Error(
          "TeamsCreator needs the OrthoPerspectiveCamera in order to work",
        );
      }
      modelLoaded = true;
      const highlighter = await viewer.tools.get(OBC.FragmentHighlighter);

      fragmentMap = highlighter.selection.select;

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
      fragmentMap: fragmentMap,
      camera: teamCamera,
    };

    try {
      const team = props.projectsManager.newTeam(teamData);
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
    <div>
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
      <div
        className="dashboard-card"
        style={{ padding: "15px", height: "calc(100vh - 330px)" }}
      >
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
    </div>
  );
}
