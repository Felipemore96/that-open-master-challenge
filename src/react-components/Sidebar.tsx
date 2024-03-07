import * as React from "react"
import {
    IProject,
    ProjectStatus,
    ProjectType,
    ITeam,
    TeamRole,
    toggleModal,
    Project
  } from "../class/projects";
  import { ProjectsManager } from "../class/projectsManager";
  import { ProjectsList } from "./ProjectsList";


export function Sidebar() {
    const [projectsManager] = React.useState(new ProjectsManager())
    const [projects, setProjects] = React.useState<Project[]>(projectsManager.projectsList)
    projectsManager.onProjectCreated = () => {setProjects([...projectsManager.projectsList])}

    const updatedProjectsList = projects.map((project) => {
        return <ProjectsList project={project} key={project.id} />
    })

    React.useEffect(() => {}, [projects])

    // React Event listener
    const onNewProject = () => {
        toggleModal("new-project-modal");
    } 

    const onCancelNewProject = () => {
        const projectForm = document.getElementById("new-project-modal") as HTMLFormElement
        if (!(projectForm && projectForm instanceof HTMLDialogElement)) {return}
        projectForm.close();
    }

    const onCloseErrorPopup = () => {
        toggleModal("error-popup");
    }

    const onSubmitNewProject = (e: React.FormEvent) => {
        e.preventDefault();
        const projectForm = document.getElementById("new-project-form") as HTMLFormElement;
        // Gather form data and create a new project
        const formData = new FormData(projectForm);
        const projectData: IProject = {
          projectName: formData.get("project-name") as string,
          projectDescription: formData.get("project-description") as string,
          projectStatus: formData.get("project-status") as ProjectStatus,
          projectCost: formData.get("project-cost") as string,
          projectType: formData.get("project-type") as ProjectType,
          projectAddress: formData.get("project-address") as string,
          projectFinishDate: new Date(formData.get("finishDate") as string),
          projectProgress: formData.get("project-progress") as string
        };
        try {
          // Attempt to create a new project
          const project = projectsManager.newProject(projectData);
          projectForm.reset();
          toggleModal("new-project-modal");
        } catch (err) {
          // Display an error message in case of an exception
          const errorMessage = document.getElementById("err") as HTMLElement;
          errorMessage.textContent = err;
          toggleModal("error-popup");
        }
    }
    
    return (
        <aside id="sidebar">
            <dialog id="new-project-modal">
                <form id="new-project-form">
                <h2>New Project</h2>
                <div className="input-list">
                    <div className="form-field-container">
                    <label>
                        <span className="material-icons-round">apartment</span>Name
                    </label>
                    <input
                        name="project-name"
                        type="text"
                        placeholder="What's the name of your project?"
                    />
                    <p
                        style={{
                        color: "gray",
                        fontSize: "var(--font-sm)",
                        marginTop: 5,
                        fontStyle: "italic"
                        }}
                    >
                        TIP: Give it a short name
                    </p>
                    </div>
                    <div className="form-field-container">
                    <label>
                        <span className="material-icons-round">subject</span>Description
                    </label>
                    <textarea
                        name="project-description"
                        cols={30}
                        rows={5}
                        placeholder="Project's description"
                        defaultValue={""}
                    />
                    </div>
                    <div className="form-field-container">
                    <label>
                        <span className="material-icons-round">not_listed_location</span>
                        Status
                    </label>
                    <select name="project-status">
                        <option>Pending</option>
                        <option>Active</option>
                        <option>Finished</option>
                    </select>
                    </div>
                    <div className="form-field-container">
                    <label>
                        <span className="material-icons-round">euro</span>Cost
                    </label>
                    <input name="project-cost" type="text" placeholder="Project's cost" />
                    </div>
                    <div className="form-field-container">
                    <label>
                        <span className="material-icons-round">category</span>Type
                    </label>
                    <select name="project-type">
                        <option>Residential</option>
                        <option>Commercial</option>
                        <option>Institutional</option>
                        <option>Mixed-use</option>
                        <option>Industrial</option>
                        <option>Heavy civil</option>
                    </select>
                    </div>
                    <div className="form-field-container">
                    <label>
                        <span className="material-icons-round">place</span>Address
                    </label>
                    <input
                        name="project-address"
                        type="text"
                        placeholder="Project's address"
                    />
                    </div>
                    <div className="form-field-container">
                    <label htmlFor="finishDate">
                        <span className="material-icons-round">calendar_month</span>Finish
                        Date
                    </label>
                    <input name="finishDate" type="date" />
                    </div>
                    <div className="form-field-container">
                    <label>
                        <span className="material-icons-round">published_with_changes</span>
                        Progress
                    </label>
                    <input
                        name="project-progress"
                        type="text"
                        placeholder="Project's progress from 0 to 100"
                    />
                    </div>
                    <div
                    style={{
                        display: "flex",
                        margin: "10px 0px 10px auto",
                        columnGap: 10
                    }}
                    >
                    <button onClick={onCancelNewProject}
                        id="cancel-new-project-btn"
                        type="button"
                        style={{ backgroundColor: "transparent" }}
                    >
                        Cancel
                    </button>
                    <button onClick={(e) => onSubmitNewProject(e)}
                        id="submit-new-project-btn"
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
            <img
                id="company-logo"
                src="./assets/company-logo.svg"
                alt="Construction Company"
            />
            <div style={{ display: "flex", alignItems: "center", columnGap: 10 }}>
                <button onClick={onNewProject} id="new-project-btn" className="btn-secondary">
                <p style={{ width: "100%" }}>
                    <span className="material-icons-round">add</span>
                </p>
                </button>
                <input type="text" placeholder="Search Project" style={{ width: "100%" }} />
            </div>
            <div id="projects-list" className="nav-buttons">{ updatedProjectsList }
            </div>
        </aside>
    )
}