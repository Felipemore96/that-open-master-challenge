import * as React from "react";
import * as Router from "react-router-dom";
import { Project } from "../class/projects";
import { ProjectsManager } from "../class/projectsManager";
import { DetailsPageHeader } from "./DetailsPageHeader";
import { DetailsCard } from "./DetailsCard";
import { IFCViewer } from "./IFCViewer";
import { TeamsCard } from "./TeamsCard";

interface Props {
  projectsManager: ProjectsManager;
}

export function DetailsPage(props: Props) {
  const [projects, setProjects] = React.useState<Project[]>(
    props.projectsManager.projectsList
  );
  props.projectsManager.onProjectCreated = () => {
    setProjects([...props.projectsManager.projectsList]);
  };

  const routeParams = Router.useParams<{ id: string }>();
  if (!routeParams.id) {
    return <p>Project ID is needed to see this page</p>;
  }
  const currentProject = props.projectsManager.getProject(routeParams.id);
  if (!currentProject) {
    return <p>The project with ID {routeParams.id} wasn't found.</p>;
  }

  React.useEffect(() => {}, [currentProject]);

  return (
    <div className="page" id="project-details">
      <DetailsPageHeader project={currentProject} />
      <div className="main-page-content">
        <div style={{ display: "flex", flexDirection: "column", rowGap: 20 }}>
          <DetailsCard project={currentProject} />
          <TeamsCard
            project={currentProject}
            projectsManager={props.projectsManager}
          />
        </div>
        <IFCViewer project={currentProject} />
      </div>
    </div>
  );
}
