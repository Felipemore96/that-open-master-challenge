import * as React from "react";
import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import * as BUI from "@thatopen/ui";
import * as CUI from "@thatopen/ui-obc";
import { Project } from "../class/projects";
import { FragmentsGroup } from "@thatopen/fragments";

interface Props {
  project: Project;
}

interface IViewerContext {
  viewer: OBC.Components | null;
  setViewer: (viewer: OBC.Components | null) => void;
}

export const ViewerContext = React.createContext<IViewerContext>({
  viewer: null,
  setViewer: () => {},
});

export function ViewerProvider(props: { children: React.ReactNode }) {
  const [viewer, setViewer] = React.useState<OBC.Components | null>(null);
  return (
    <ViewerContext.Provider value={{ viewer, setViewer }}>
      {props.children}
    </ViewerContext.Provider>
  );
}

export function IFCViewer(props: Props) {
  let defaultProject: boolean = false;
  if (props.project.fragRoute) {
    defaultProject = true;
  }
  const components = new OBC.Components();
  let fragmentModel: FragmentsGroup | undefined;

  const setViewer = () => {
    const worlds = components.get(OBC.Worlds);

    const world = worlds.create<
      OBC.SimpleScene,
      OBC.OrthoPerspectiveCamera,
      OBCF.PostproductionRenderer
    >();

    const sceneComponent = new OBC.SimpleScene(components);
    world.scene = sceneComponent;
    world.scene.setup();
    world.scene.three.background = null;

    const viewerContainer = document.getElementById(
      "viewer-container",
    ) as HTMLElement;
    const rendererComponent = new OBCF.PostproductionRenderer(
      components,
      viewerContainer,
    );
    world.renderer = rendererComponent;

    const cameraComponent = new OBC.OrthoPerspectiveCamera(components);
    world.camera = cameraComponent;

    components.init();

    world.camera.controls.setLookAt(3, 3, 3, 0, 0, 0);
    world.camera.updateAspect();

    const ifcLoader = components.get(OBC.IfcLoader);
    ifcLoader.setup();

    const fragmentsManager = components.get(OBC.FragmentsManager);
    fragmentsManager.onFragmentsLoaded.add(async (model) => {
      world.scene.three.add(model);

      const indexer = components.get(OBC.IfcRelationsIndexer);
      await indexer.process(model);

      fragmentModel = model;
    });

    const highlighter = components.get(OBCF.Highlighter);
    highlighter.setup({ world });
    highlighter.zoomToSelection = true;

    viewerContainer.addEventListener("resize", () => {
      rendererComponent.resize();
      cameraComponent.updateAspect();
    });
  };

  const onToggleVisibility = () => {
    const highlighter = components.get(OBCF.Highlighter);
    const fragments = components.get(OBC.FragmentsManager);
    const selection = highlighter.selection.select;
    if (Object.keys(selection).length === 0) return;
    for (const fragmentID in selection) {
      const fragment = fragments.list.get(fragmentID);
      const expressIDs = selection[fragmentID];
      for (const id of Array.from(expressIDs)) {
        if (!fragment) continue;
        const isHidden = fragment.hiddenItems.has(id);
        if (isHidden) {
          fragment.setVisibility(true, [id]);
        } else {
          fragment.setVisibility(false, [id]);
        }
      }
    }
  };

  const onIsolate = () => {
    const highlighter = components.get(OBCF.Highlighter);
    const hider = components.get(OBC.Hider);
    const selection = highlighter.selection.select;
    hider.isolate(selection);
  };

  const onShow = () => {
    const hider = components.get(OBC.Hider);
    hider.set(true);
  };

  const onShowProperty = () => {
    if (!fragmentModel) return;
    const highlighter = components.get(OBCF.Highlighter);
    const selection = highlighter.selection.select;
    const indexer = components.get(OBC.IfcRelationsIndexer);
    for (const fragmentID in selection) {
      const expressIDs = selection[fragmentID];
      for (const id of Array.from(expressIDs)) {
        const psets = indexer.getEntityRelations(
          fragmentModel,
          id,
          "IsDefinedBy",
        );
        console.log(psets);
      }
    }
  };

  const setupUI = () => {
    const viewerContainer = document.getElementById(
      "viewer-container",
    ) as HTMLElement;
    if (!viewerContainer) return;

    const floatingGrid = BUI.Component.create<BUI.Grid>(() => {
      return BUI.html`
        <bim-grid floating style="padding: 20px"></bim-grid>
      `;
    });

    const toolbar = BUI.Component.create<BUI.Toolbar>(() => {
      const [loadIfcBtn] = CUI.buttons.loadIfc({ components: components });

      return BUI.html`
        <bim-toolbar style="justify-self: center">
            <bim-toolbar-section label="Import">
                ${loadIfcBtn}
            </bim-toolbar-section>
            <bim-toolbar-section label="Selection">
                <bim-button 
                    label="Visibility" 
                    icon="material-symbols:visibility-outline"
                    @click="${onToggleVisibility}"
                ></bim-button>
                <bim-button 
                    label="Show all" 
                    icon="tabler:eye-filled"
                    @click="${onShow}"
                ></bim-button>
                <bim-button 
                    label="Isolate" 
                    icon="mdi:filter"
                    @click="${onIsolate}"
                ></bim-button>
            </bim-toolbar-section>
            <bim-toolbar-section label="Property">
                <bim-button 
                    label="Show" 
                    icon="clarity:list-line"
                    @click="${onShowProperty}"
                ></bim-button>
            </bim-toolbar-section>
        </bim-toolbar>
      `;
    });

    floatingGrid.layouts = {
      main: {
        template: `
        "empty" 1fr
        "toolbar" auto
        /1fr
        `,
        elements: {
          toolbar,
        },
      },
    };

    floatingGrid.layout = "main";

    viewerContainer.appendChild(floatingGrid);
  };

  React.useEffect(() => {
    setViewer();
    setupUI();
    return () => {
      if (components) {
        components.dispose();
      }

      if (fragmentModel) {
        fragmentModel.dispose();
        fragmentModel = undefined;
      }
    };
  }, []);

  return (
    <bim-viewport
      id="viewer-container"
      style={{
        minWidth: 0,
        position: "relative",
        maxHeight: "calc(100vh - 100px)",
        background: "var(--background-200)",
        borderRadius: "8px",
      }}
    />
  );
}
