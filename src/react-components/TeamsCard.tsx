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
import { TeamsCreator } from "../bim-components/TeamsCreator/src/TeamsCreator";

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
  const currentProjectId = props.project.id;

  React.useEffect(() => {
    const handleTeamCreated = (data: ITeam) => submitNewTeam(data);
    teamsCreator.onTeamCreated.add(handleTeamCreated);

    return () => {
      teamsCreator.onTeamCreated.remove(handleTeamCreated);
    };
  }, [teamsCreator]);

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
    const teamsButton = teamTool({ components });
    teamsContainer.current?.appendChild(teamsButton);

    teamsCreator.onDisposed.add(() => {
      teamsButton.remove();
    });
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
        components={components}
      />
    );
  });

  const onCloseErrorPopup = () => {
    toggleModal("error-popup");
  };

  const submitNewTeam = async (data: ITeam) => {
    const teamData: ITeam = {
      teamName: data.teamName as string,
      teamRole: data.teamRole as unknown as TeamRole,
      teamDescription: data.teamDescription as string,
      contactName: data.contactName as string,
      contactPhone: data.contactName as string,
      teamProjectId: currentProjectId as string,
      camera: data.camera as string,
      ifcGuids: data.ifcGuids as string,
    };
    try {
      const teamsCollection = getCollection<ITeam>("/teams");
      const docRef = await Firestore.addDoc(teamsCollection, teamData);
      const teamId = docRef.id;
      props.projectsManager.createTeam(teamData, teamId);
      filterTeams();
    } catch (err) {
      const errorMessage = document.getElementById("err") as HTMLElement;
      errorMessage.textContent = err;
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
