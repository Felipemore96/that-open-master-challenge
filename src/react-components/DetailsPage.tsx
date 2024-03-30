import * as React from "react"
import * as Router from "react-router-dom"
import {
    IProject,
    ProjectStatus,
    ProjectType,
    ITeam,
    TeamRole,
    toggleModal,
    Project,
    Team
} from "../class/projects";
import { ProjectsManager } from "../class/projectsManager";
import { DetailsPageHeader } from "./DetailsPageHeader";
import { IFCViewer } from "./IFCViewer";
import { getCollection } from "../firebase";
import * as Firestore from "firebase/firestore"
import { deleteDocument } from "../firebase";

interface Props {
    projectsManager: ProjectsManager
  }

export function DetailsPage(props: Props) {

    const [projects, setProjects] = React.useState<Project[]>(props.projectsManager.projectsList)
    props.projectsManager.onProjectCreated = () => {setProjects([...props.projectsManager.projectsList])}

    const [teams, setTeams] = React.useState<Team[]>(props.projectsManager.teamList)
    props.projectsManager.onTeamCreated = () => {setTeams([...props.projectsManager.teamList])}
    // props.projectsManager.onTeamDeleted = () => {setTeams([...props.projectsManager.teamList])}

    const routeParams = Router.useParams<{ id: string }>()
    if (!routeParams.id) {return (<p>Project ID is needed to see this page</p>)}
    const currentProject = props.projectsManager.getProject(routeParams.id)
    if (!currentProject) { return (<p>The project with ID {routeParams.id} wasn't found.</p>) }
    const navigateTo = Router.useNavigate()
    // props.projectsManager.onProjectDeleted = async (id) => {
    //   await deleteDocument("/projects", id)
    //   navigateTo("/")
    // }

    const getFirestoreTeams = async () => {
      const teamsCollenction = getCollection<ITeam>("/teams")
      const firebaseTeams = await Firestore.getDocs(teamsCollenction)
      for (const doc of firebaseTeams.docs) {
        const data = doc.data()
        const team: ITeam = {
          ...data
        }
        try {
          props.projectsManager.createNewTeam(team, doc.id)
        } catch (error) {

        }
      }
    }

    React.useEffect(() => {
      getFirestoreTeams()
    }, [])

    // Event listener for closing the error popup modal
    const onCloseErrorPopup = () => {
        toggleModal("error-popup");
    }

    // Event listener for opening the "New Team" modal
    const onNewTeam = () => {
        toggleModal("new-team-modal");
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
        const currentProjectName = currentProject.projectName;
        console.log(currentProjectName)
        const teamData: ITeam = {
        teamName: formData.get("teamName") as string,
        teamRole: formData.get("teamRole") as TeamRole,
        teamDescription: formData.get("teamDescription") as string,
        contactName: formData.get("contactName") as string,
        contactPhone: formData.get("contactPhone") as string,
        teamProject: currentProjectName as string
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
        <div className="page" id="project-details">
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
            <DetailsPageHeader project={currentProject}/>
            <div className="main-page-content">
                <div style={{ display: "flex", flexDirection: "column", rowGap: 20 }}>
                    <div className="dashboard-card" style={{ padding: "20px 0" }}>
                        <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "0px 30px",
                            marginBottom: 10
                        }}
                        >
                        <h4 />
                        <button className="btn-secondary">
                            <p style={{ width: "100%" }}>Edit</p>
                        </button>
                        </div>
                        <div style={{ padding: "0 30px" }}>
                        <div
                            style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between"
                            }}
                        >
                            <div className="card-content">
                            <div className="card-property">
                                <p style={{ color: "#969696" }}>Status</p>
                                <p id="project-status" data-project-info="status">{currentProject.projectStatus}</p>
                            </div>
                            <div className="card-property">
                                <p style={{ color: "#969696" }}>Cost</p>
                                <p id="project-cost" data-project-info="cost">{currentProject.projectCost}</p>
                            </div>
                            <div className="card-property">
                                <p style={{ color: "#969696" }}>Type</p>
                                <p id="project-type" data-project-info="type">{currentProject.projectType}</p>
                            </div>
                            <div className="card-property">
                                <p style={{ color: "#969696" }}>Address</p>
                                <p id="project-address" data-project-info="address">{currentProject.projectAddress}</p>
                            </div>
                            <div className="card-property">
                                <p style={{ color: "#969696" }}>Finish Date</p>
                                <p id="project-finish-date" data-project-info="finishDate">{currentProject.projectFinishDate.toDateString()}</p>
                            </div>
                            <div
                                className="card-property"
                                style={{
                                backgroundColor: "#404040",
                                borderRadius: 9999,
                                overflow: "auto"
                                }}
                            >
                                <div
                                id="project-progress"
                                data-project-info="progress"
                                style={{
                                    width: `${currentProject.projectProgress}%`,
                                    backgroundColor: "#468f3f",
                                    padding: "4px 0",
                                    textAlign: "center"
                                }}
                                >
                                    {currentProject.projectProgress}%
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                <div className="dashboard-card" style={{ flexGrow: 1 }}>
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
                    <div id="teams-list" />
                    </div>
                </div>
                <IFCViewer/>
            </div>
        </div>
    )
}