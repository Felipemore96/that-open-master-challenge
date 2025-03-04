import * as React from "react";
import * as Router from "react-router-dom";
import { Project } from "../class/projects";
import { ProjectsManager } from "../class/projectsManager";
import { DetailsPageHeader } from "./DetailsPageHeader";
import { DetailsCard } from "./DetailsCard";
import { IFCViewer } from "./IFCViewer";
import { TeamsCard } from "./TeamsCard";
import * as OBC from "@thatopen/components";

interface Props {
  projectsManager: ProjectsManager;
}

export function DetailsPage(props: Props) {
  const [projects, setProjects] = React.useState<Project[]>(
    props.projectsManager.projectsList
  );
  const components = new OBC.Components();
  props.projectsManager.onProjectCreated = () => {
    setProjects([...props.projectsManager.projectsList]);
  };

  const routeParams = Router.useParams<{ id: string }>();
  if (!routeParams.id) {
    return <p>Project ID is needed to see this page</p>;
  }

  const currentProject = props.projectsManager.getProject(routeParams.id);
  React.useEffect(() => {}, [currentProject]);

  if (!currentProject) {
    return <p>The project with ID {routeParams.id} wasn't found.</p>;
  }

  return (
    <div className="page" id="project-details">
      <DetailsPageHeader project={currentProject} />
      <div className="main-page-content">
        <div className="project-column">
          <DetailsCard
            project={currentProject}
            projectsManager={props.projectsManager}
          />
          <TeamsCard
            project={currentProject}
            projectsManager={props.projectsManager}
            components={components}
          />
        </div>

        <IFCViewer project={currentProject} components={components} />
      </div>
    </div>
  );
}
