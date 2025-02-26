import * as React from "react";
import * as ReactDOM from "react-dom/client";
import * as Router from "react-router-dom";
import { Sidebar } from "./react-components/Sidebar";
import { ProjectsManager } from "./class/projectsManager";
import { DetailsPage } from "./react-components/DetailsPage";
import { HomePage } from "./react-components/HomePage";
import { WorldProvider } from "./react-components/IFCViewer";
import * as BUI from "@thatopen/ui";
import * as OBC from "@thatopen/components";

BUI.Manager.init();

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "bim-button": any;
      "bim-checkbox": any;
      "bim-color-input": any;
      "bim-context-menu": any;
      "bim-dropdown": any;
      "bim-grid": any;
      "bim-icon": any;
      "bim-input": any;
      "bim-label": any;
      "bim-number-input": any;
      "bim-option": any;
      "bim-panel": any;
      "bim-panel-section": any;
      "bim-selector": any;
      "bim-table": any;
      "bim-tabs": any;
      "bim-tab": any;
      "bim-table-cell": any;
      "bim-table-children": any;
      "bim-table-group": any;
      "bim-table-row": any;
      "bim-text-input": any;
      "bim-toolbar": any;
      "bim-toolbar-group": any;
      "bim-toolbar-section": any;
      "bim-viewport": any;
    }
  }
}

const projectsManager = new ProjectsManager();

const rootElement = document.getElementById("app") as HTMLDivElement;
const appRoot = ReactDOM.createRoot(rootElement);
appRoot.render(
  <Router.BrowserRouter>
    <WorldProvider>
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
    </WorldProvider>
  </Router.BrowserRouter>
);
