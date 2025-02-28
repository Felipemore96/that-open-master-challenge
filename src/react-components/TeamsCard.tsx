import * as React from "react";
import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import * as THREE from "three";
import { Project, toggleModal } from "../class/projects";
import { ITeam, Team, TeamRole } from "../class/teams";
import { ProjectsManager } from "../class/projectsManager";
import { TeamElement } from "./TeamElement";
import { getCollection } from "../firebase";
import * as Firestore from "firebase/firestore";
import { teamTool } from "../bim-components/TeamsCreator/src/Template";
import {
  TeamModalData,
  TeamsCreator,
} from "../bim-components/TeamsCreator/src/TeamsCreator";

interface Props {
  project: Project;
  projectsManager: ProjectsManager;
  components: OBC.Components;
}

export function TeamsCard(props: Props) {
  const [teams, setTeams] = React.useState<Team[]>(
    props.projectsManager.teamsList
  );
  props.projectsManager.onTeamCreated = () => {
    setTeams([...props.projectsManager.teamsList]);
  };
  const components = props.components;
  const teamsContainer = React.useRef<HTMLDivElement>(null);
  const teamsCreator = components.get(TeamsCreator);
  teamsCreator.onTeamCreated.add((data) => submitNewTeam(data));

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

  // const world = [];
  let modelLoaded: boolean = false;

  const onCloseErrorPopup = () => {
    toggleModal("error-popup");
  };

  const submitNewTeam = (data: TeamModalData) => {};

  const onSubmitNewTeam = async (e: React.FormEvent) => {
    // e.preventDefault();
    // const teamForm = document.getElementById(
    //   "new-team-form"
    // ) as HTMLFormElement;
    // const formData = new FormData(teamForm);
    // const currentProjectId = props.project.id;
    // let guids: string[] = [];
    // let teamCamera:
    //   | { position: THREE.Vector3; target: THREE.Vector3 }
    //   | undefined = undefined;
    // if (world && components) {
    //   const camera = world.camera;
    //   if (!(camera instanceof OBC.OrthoPerspectiveCamera)) {
    //     throw new Error(
    //       "TeamsCreator needs the OrthoPerspectiveCamera in order to work"
    //     );
    //   }
    //   modelLoaded = true;
    //   const fragments = components.get(OBC.FragmentsManager);
    //   const highlighter = components.get(OBCF.Highlighter);
    //   guids = fragments.fragmentIdMapToGuids(highlighter.selection.select);
    //   const position = new THREE.Vector3();
    //   camera.controls.getPosition(position);
    //   const target = new THREE.Vector3();
    //   camera.controls.getTarget(target);
    //   teamCamera = { position, target };
    // }
    // const teamData: ITeam = {
    //   teamName: formData.get("teamName") as string,
    //   teamRole: formData.get("teamRole") as TeamRole,
    //   teamDescription: formData.get("teamDescription") as string,
    //   contactName: formData.get("contactName") as string,
    //   contactPhone: formData.get("contactPhone") as string,
    //   teamProjectId: currentProjectId,
    //   ifcGuids: guids,
    //   camera: teamCamera,
    // };
    // try {
    //   const teamsCollection = getCollection<ITeam>("/teams");
    //   const firebaseTeamData = {
    //     ...teamData,
    //     camera: teamCamera
    //       ? {
    //           position: {
    //             x: teamCamera.position.x,
    //             y: teamCamera.position.y,
    //             z: teamCamera.position.z,
    //           },
    //           target: {
    //             x: teamCamera.target.x,
    //             y: teamCamera.target.y,
    //             z: teamCamera.target.z,
    //           },
    //         }
    //       : undefined,
    //   };
    //   const docRef = await Firestore.addDoc(teamsCollection, firebaseTeamData);
    //   const teamId = docRef.id;
    //   const team = props.projectsManager.createTeam(teamData, teamId);
    //   teamForm.reset();
    //   toggleModal("new-team-modal");
    //   filterTeams();
    // } catch (err) {
    //   const errorMessage = document.getElementById("err") as HTMLElement;
    //   errorMessage.textContent = err;
    //   toggleModal("error-popup");
    // }
  };

  React.useEffect(() => {
    const teamsButton = teamTool({ components });
    teamsContainer.current?.appendChild(teamsButton);
  }, []);

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
            <div
              // onClick={onNewTeam}
              id="new-team-btn"
              className="btn-secondary"
              ref={teamsContainer}
            >
              <span style={{ width: "100%" }} className="material-icons-round">
                add
              </span>
            </div>
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
