import * as React from "react";
import * as ReactDOM from "react-dom/client";
import * as Router from "react-router-dom";
import { Sidebar } from "./react-components/Sidebar";
import { ProjectsManager } from "./class/projectsManager";
import { DetailsPage } from "./react-components/DetailsPage";
import { HomePage } from "./react-components/HomePage";
import { ViewerProvider } from "./react-components/IFCViewer";
import * as BUI from "@thatopen/ui";

BUI.Manager.init();
declare global {
  namespace JSX {
    interface IntrinsicElements {}
  }
}

const projectsManager = new ProjectsManager();

const rootElement = document.getElementById("app") as HTMLDivElement;
const appRoot = ReactDOM.createRoot(rootElement);
appRoot.render(
  <Router.BrowserRouter>
    <ViewerProvider>
      <Router.Routes>
        <Router.Route
          path="/"
          element={<HomePage projectsManager={projectsManager} />}
        ></Router.Route>
        <Router.Route
          path="/project/:id"
          element={
            <>
              <Sidebar projectsManager={projectsManager} />
              <DetailsPage projectsManager={projectsManager} />
            </>
          }
        ></Router.Route>
      </Router.Routes>
    </ViewerProvider>
  </Router.BrowserRouter>,
);
