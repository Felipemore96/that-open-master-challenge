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
import { TeamsCard } from "./TeamsCard";

interface Props {
    projectsManager: ProjectsManager
  }

export function DetailsPage(props: Props) {

    const [projects, setProjects] = React.useState<Project[]>(props.projectsManager.projectsList)
    props.projectsManager.onProjectCreated = () => {setProjects([...props.projectsManager.projectsList])}

    const routeParams = Router.useParams<{ id: string }>()
    if (!routeParams.id) {return (<p>Project ID is needed to see this page</p>)}
    const currentProject = props.projectsManager.getProject(routeParams.id)
    if (!currentProject) { return (<p>The project with ID {routeParams.id} wasn't found.</p>) }
    const navigateTo = Router.useNavigate()
    // props.projectsManager.onProjectDeleted = async (id) => {
    //   await deleteDocument("/projects", id)
    //   navigateTo("/")
    // }

    return (
        <div className="page" id="project-details">
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
                    <TeamsCard project={currentProject}/>
                </div>  
                <IFCViewer/>
            </div>
        </div>
    )
}