import * as React from "react"
import * as Router from "react-router-dom"
import { ProjectsManager } from "../class/projectsManager"
import { IProject, Project } from "../class/projects"
import { HomePageProjectCard } from "./HomePageProjectCard"
import { firebaseDB } from "../firebase"
import * as Firestore from "firebase/firestore"
import { getCollection } from "../firebase";

interface Props {
    projectsManager: ProjectsManager
}
  
export function HomePage(props: Props) {
    
    const [projects, setProjects] = React.useState<Project[]>(props.projectsManager.projectsList)
    props.projectsManager.onProjectCreated = () => {setProjects([...props.projectsManager.projectsList])}
    // props.projectsManager.onProjectDeleted = () => { setProjects([...props.projectsManager.projectsList]) }

    const getFirestoreProjects = async () => {
      // const projectsCollenction = Firestore.collection(firebaseDB, "/projects") as Firestore.CollectionReference<IProject>
      const projectsCollenction = getCollection<IProject>("/projects")
      const firebaseProjects = await Firestore.getDocs(projectsCollenction)
      for (const doc of firebaseProjects.docs) {
        const data = doc.data()
        const project: IProject = {
          ...data,
          projectFinishDate: (data.projectFinishDate as unknown as Firestore.Timestamp).toDate()
        }
        try {
          props.projectsManager.newProject(project, doc.id)
        } catch (error) {

        }
      }
    }

    React.useEffect(() => {
      getFirestoreProjects()
    }, [])
  
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
          gap: "150px"
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