// Import necessary types and functions from project files
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import * as Router from "react-router-dom"
import {
  IProject,
  ProjectStatus,
  ProjectType,
  ITeam,
  TeamRole,
  toggleModal,
  Project
} from "./class/projects";
import { Sidebar } from "./react-components/Sidebar"
import { ProjectsManager } from "./class/projectsManager";
import { DetailsPage } from './react-components/DetailsPage'
import { HomePage } from './react-components/HomePage'
import { DetailsPageHeader } from "./react-components/DetailsPageHeader";
import { ViewerProvider } from "./react-components/IFCViewer";

const projectsManager = new ProjectsManager()

const rootElement = document.getElementById("app") as HTMLDivElement
const appRoot = ReactDOM.createRoot(rootElement)
appRoot.render(
  <>
    <Router.BrowserRouter>
      <ViewerProvider>
        <Router.Routes>
          <Router.Route path="/" element={<HomePage projectsManager={projectsManager} />}></Router.Route>
          <Router.Route path="/project/:id" element={
            <>
              <Sidebar projectsManager={projectsManager} />
              <DetailsPage projectsManager={projectsManager} />
            </>
          }></Router.Route>        
        </Router.Routes>
      </ViewerProvider>
    </Router.BrowserRouter>
  </>
)

// Event listener for closing the team info popup modal
const closeTeamInfoPopup = document.getElementById("close-team-info-popup");
if (closeTeamInfoPopup) {
  closeTeamInfoPopup.addEventListener("click", () => {
    toggleModal("team-info-popup");
  });
}

// Event listener for showing project info
// if (projectsListUI) {
//   projectsListUI.addEventListener("click", (event) => {
//     const target = event.target as HTMLElement;
//     const projectId = target.dataset.projectId;    
//     if (projectId) {
//       const clickedProject = projectsManager.projectsList.find((project) => project.id === projectId);
//       if (clickedProject) {
//         projectsManager.showProjectDetails(clickedProject);
//       }
//     }
//   });
// }

