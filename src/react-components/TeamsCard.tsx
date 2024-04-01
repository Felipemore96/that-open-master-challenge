import * as React from "react"
import * as Router from "react-router-dom"
import {
    ITeam,
    Project, Team, TeamRole, toggleModal
} from "../class/projects";
import { ProjectsManager } from "../class/projectsManager";
import * as Firestore from "firebase/firestore"
import { getCollection } from "../firebase";
import { TeamCardTeams } from "./TeamCardTeams";

interface Props {
    project: Project
    projectsManager: ProjectsManager;
}  

export function TeamsCard(props: Props) {
    const [teams, setTeams] = React.useState<Team[]>(props.projectsManager.teamList)
    props.projectsManager.onTeamCreated = () => {setTeams([...props.projectsManager.teamList])}
    // props.projectsManager.onTeamDeleted = () => {setTeams([...props.projectsManager.teamList])}
    
    const getFirestoreTeams = async () => {
        const teamsCollenction = getCollection<ITeam>("/teams")
        const firebaseTeams = await Firestore.getDocs(teamsCollenction)
        for (const doc of firebaseTeams.docs) {
            const data = doc.data()
            const team: ITeam = {
                ...data
            }
            console.log("team", team)
            try {
                if (team.teamProjectId === props.project.id) {
                    props.projectsManager.createNewTeam(team, doc.id);
                }
            } catch (error) {}
        }
    }
  
    React.useEffect(() => {
        getFirestoreTeams()
    }, [props.project.id])

    const teamsCards = teams.map((team) => {
        return (
            <TeamCardTeams team={team} key={team.id}/>
        )
    })

    // Event listener for opening the "New Team" modal
    const onNewTeam = () => {
        toggleModal("new-team-modal");
    }

    // Event listener for closing the error popup modal
    const onCloseErrorPopup = () => {
        toggleModal("error-popup");
    }


    // Event listener for canceling the new team form
    const onCancelNewTeam = () => {
        const teamForm = document.getElementById("new-team-form") as HTMLFormElement;
        teamForm.reset();
        toggleModal("new-team-modal");
    }

    // Event listener for submitting a new team form
    const onSubmitNewTeam = (e: React.FormEvent) => {
        const teamForm = document.getElementById("new-team-form") as HTMLFormElement;
        e.preventDefault();
        // Gather form data and create a new team
        const formData = new FormData(teamForm);
        const currentProjectId = props.project.id;
        const teamData: ITeam = {
        teamName: formData.get("teamName") as string,
        teamRole: formData.get("teamRole") as TeamRole,
        teamDescription: formData.get("teamDescription") as string,
        contactName: formData.get("contactName") as string,
        contactPhone: formData.get("contactPhone") as string,
        teamProjectId: currentProjectId as string
        };
        try {
        const teamsCollection = getCollection<ITeam>("/teams")
        Firestore.addDoc(teamsCollection, teamData)
        // Attempt to create a new team
        const team = props.projectsManager.createNewTeam(teamData);
        teamForm.reset();
        toggleModal("new-team-modal");
        } catch (err) {
        // Display an error message in case of an exception
        const errorMessage = document.getElementById("err") as HTMLElement;
        errorMessage.textContent = err;
        toggleModal("error-popup");
        }
    }


    return (
        <div className="dashboard-card" style={{ flexGrow: 1 }}>
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
                    <div style={{ display: "flex", flexDirection: "column", rowGap: 2 }}>
                        <input name="contactName" placeholder="Contact Name" />
                        <input name="contactPhone" placeholder="Phone Number" />
                    </div>
                    </div>
                    <div
                    style={{
                        display: "flex",
                        margin: "10px 0px 10px auto",
                        columnGap: 10
                    }}
                    >
                    <button onClick={onCancelNewTeam}
                        id="cancel-new-team-btn"
                        type="button"
                        style={{ backgroundColor: "transparent" }}
                    >
                        Cancel
                    </button>
                    <button onClick={(e) => onSubmitNewTeam(e)}
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
                <button onClick={onCloseErrorPopup} id="close-error-popup" type="button">
                    Close
                </button>
                </div>
            </dialog>
            <dialog id="team-info-popup">
                <div id="team-info-message">
                <p id="team-info" />
                <button id="close-team-info-popup" type="button">
                    Close
                </button>
                </div>
            </dialog>
            <div id="teams-header">
                <h4>Teams</h4>
                <div
                    style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "end",
                    columnGap: 15
                    }}
                >
                    <button onClick={onNewTeam} id="new-team-btn" className="btn-secondary">
                    <p style={{ width: "100%" }}>
                        <span className="material-icons-round">add</span>
                    </p>
                    </button>
                </div>
            </div>
            {
                teams.length > 0 ? 
                <div id="teams-list" className="nav-buttons">{ teamsCards }</div> 
                : 
                <h4>There is no teams to display</h4>
            }
        </div>
    )
}