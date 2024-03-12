import * as React from "react"
import * as Router from "react-router-dom"
import { ProjectsManager } from "../class/projectsManager"
import { ProjectsPage } from "./ProjectsPage"
import { Project } from "../class/projects"
import { HomePageProjectCard } from "./HomePageProjectCard"

interface Props {
    projectsManager: ProjectsManager
}
  
export function HomePage(props: Props) {
    
    const [projects, setProjects] = React.useState<Project[]>(props.projectsManager.projectsList)
    props.projectsManager.onProjectCreated = () => {setProjects([...props.projectsManager.projectsList])}
    // props.projectsManager.onProjectDeleted = () => { setProjects([...props.projectsManager.projectsList]) }
  
    const projectCards = projects.map((project) => {
      return (
        <Router.Link to={`/project/${project.id}`} key={project.id}>
          <HomePageProjectCard project={project} />
        </Router.Link>
      )
    })

    React.useEffect(() => {
        console.log("Projects state updated", projects)
    }, [projects])



    return (
      <div className="homepage" 
        style={{
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          padding: "100px",
          gap: "50px"
        }}>
        <img
              id="homepage-company-logo"
              src="./assets/company-logo.svg"
              alt="Construction Company"
          />
        <div id="projects-list" 
          style={{
            display: "flex",
            gap: "40px",
            justifyContent: "center"
          }}>{ projectCards }</div>
      </div>
    )
}