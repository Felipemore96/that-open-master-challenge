import * as React from "react";
import * as OBC from "@thatopen/components";
import * as OBF from "@thatopen/components-front";
import * as BUI from "@thatopen/ui";
import * as CUI from "@thatopen/ui-obc";
import { FragmentsGroup } from "@thatopen/fragments";
import { ToDoCreator } from "../bim-components/ToDoCreator";
import { SimpleQTO } from "../bim-components/SimpleQTO";
import { Project } from "../class/projects";
// BUI.Manager.init();
// CUI.Manager.init();

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
  BUI.Manager.init();
  const { setViewer } = React.useContext(ViewerContext);
  let viewer: OBC.Components;

  // openBIM-components viewer
  const createViewer = async () => {
    let defaultProject: boolean = false;
    if (props.project.fragRoute) {
      defaultProject = true;
    }

    viewer = new OBC.Components();
    setViewer(viewer);

    //Scene tool setup
    const components = new OBC.Components();
    const worlds = components.get(OBC.Worlds);

    const world = worlds.create<
      OBC.SimpleScene,
      OBC.OrthoPerspectiveCamera,
      OBF.PostproductionRenderer
    >();

    const sceneComponent = new OBC.SimpleScene(components);
    world.scene = sceneComponent;
    const scene = world.scene.three;
    sceneComponent.setup();
    scene.background = null;

    const viewerContainer = document.getElementById(
      "viewer-container",
    ) as HTMLDivElement;
    const rendererComponent = new OBF.PostproductionRenderer(
      viewer,
      viewerContainer,
    );
    world.renderer = rendererComponent;

    //Camera tool setup
    const cameraComponent = new OBC.OrthoPerspectiveCamera(components);
    world.camera = cameraComponent;

    components.init();
    rendererComponent.postproduction.enabled = true; //Outlines

    viewerContainer.addEventListener("resize", () => {
      cameraComponent.updateAspect(); //Camera aspect fix
      rendererComponent.resize();
    });

    // const fragmentManager = new OBC.FragmentManager(viewer);
    const fragments = components.get(OBC.FragmentsManager);
    const ifcLoader = components.get(OBC.IfcLoader);

    //Highlighter tool setup based on Raycaster
    const highlighter = components.get(OBF.Highlighter);
    highlighter.setup({ world });

    // //Culler tool setup to optimize the viewer performace
    // const culler = new OBC.ScreenCuller(viewer);
    // cameraComponent.controls.addEventListener("sleep", () => {
    //   culler.needsUpdate = true;
    // });
    //
    // //Classifier tool definition
    // const classifier = new OBC.FragmentClassifier(viewer);
    //
    // //IFC Properies processor tool setup
    const indexer = components.get(OBC.IfcRelationsIndexer);
    // highlighter.events.select.onClear.add(() => {
    //   propertiesProcessor.cleanPropertiesList();
    // });

    fragments.onFragmentsLoaded.add(async (model) => {
      world.scene.three.add(model);
      if (model.hasProperties) await indexer.process(model);
      await onModelLoaded(model);
      // exportToFRAG(model);
      // exportToJSON(model);
      // importJSONProperties(model); // Added for challenge class 3.10.
    });

    let propsRoute: string | undefined;
    async function onModelLoaded(model: FragmentsGroup) {
      if (propsRoute) {
        const properties = await fetch(propsRoute);
        // model.properties = await properties.json();
        propsRoute = undefined;
      }
      // highlighter.update();
      // for (const fragment of model.items) {
      //   culler.add(fragment.mesh);
      // }
      // culler.needsUpdate = true;
      // try {
      // classifier.byModel(model.name, model);
      // classifier.byStorey(model);
      // classifier.byEntity(model);
      //   // console.log("Finished classification");
      //   // const tree = await createModelTree();
      //   await classificationWindow.slots.content.dispose(true);
      //   // classificationWindow.addChild(tree);
      //   propertiesProcessor.process(model); //IFC properties processor setup
      //   highlighter.events.select.onHighlight.add((fragmentMap) => {
      //     //Callback event to find the express ID of the selected element
      //     highlighter.update();
      //     const expressID = [...Object.values(fragmentMap)[0]][0];
      //     propertiesProcessor.renderProperties(model, Number(expressID)); //Method to show properties of selected elements
      //   });
      // } catch (error) {
      //   alert(error);
      // }
    }

    await ifcLoader.setup();

    if (
      defaultProject === true &&
      props.project &&
      props.project.fragRoute &&
      props.project.jsonRoute
    ) {
      const file = await fetch(props.project.fragRoute);
      const data = await file.arrayBuffer();
      const fragmentBinary = new Uint8Array(data);
      propsRoute = props.project.jsonRoute;
      const model = fragments.load(fragmentBinary);
    }

    //Import fragment button setup
    const importFragmentBtn = new BUI.Button();
    importFragmentBtn.icon = "upload";
    importFragmentBtn.tooltipTitle = "Load FRAG";
    importFragmentBtn.onclick.call(() => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".frag";
      const reader = new FileReader();
      reader.addEventListener("load", async () => {
        const binary = reader.result;
        if (!(binary instanceof ArrayBuffer)) {
          return;
        }
        const fragmentBinary = new Uint8Array(binary);
        fragments.load(fragmentBinary);
      });
      input.addEventListener("change", () => {
        const filesList = input.files;
        if (!filesList) {
          return;
        }
        reader.readAsArrayBuffer(filesList[0]);
      });
      input.click();
    });

    // //Function to import json file with properties
    // function importJSONProperties(model: FragmentsGroup) {
    //   // Added for challenge class 3.10.
    //   const input = document.createElement("input");
    //   input.type = "file";
    //   input.accept = "application/json";
    //   const reader = new FileReader();
    //   reader.addEventListener("load", async () => {
    //     const json = reader.result;
    //     if (!json) {
    //       return;
    //     }
    //     const importedPropertiesFromJSON = JSON.parse(json as string);
    //     model.properties = importedPropertiesFromJSON;
    //   });
    //   input.addEventListener("change", () => {
    //     const filesList = input.files;
    //     if (!filesList) {
    //       return;
    //     }
    //     reader.readAsText(filesList[0]);
    //   });
    //   input.click();
    // }

    // // Export model into FRAG file
    // function exportToJSON(model: FragmentsGroup) {
    //   const json = JSON.stringify(model.properties, null, 2);
    //   const blob = new Blob([json], { type: "application/json" });
    //   const url = URL.createObjectURL(blob);
    //   const a = document.createElement("a");
    //   a.href = url;
    //   a.download = `${model.name.replace(".ifc", "")}`;
    //   a.click();
    //   URL.revokeObjectURL(url);
    // }

    // // Export model into FRAG file
    // function exportToFRAG(model: FragmentsGroup) {
    //   const fragmentBinary = fragmentManager.export(model);
    //   const blob = new Blob([fragmentBinary]);
    //   const url = URL.createObjectURL(blob);
    //   const a = document.createElement("a");
    //   a.href = url;
    //   a.download = `${model.name.replace(".ifc", "")}.frag`;
    //   a.click();
    //   URL.revokeObjectURL(url);
    // }

    // //Instance of ToDoCreator and setup method
    // const toDoCreator = new ToDoCreator(viewer);
    // await toDoCreator.setup();
    // toDoCreator.onProjectCreated.add((toDo) => {
    //   console.log(toDo);
    // });
    //
    // // Instance of Quentity takeoff tool and setup method
    //
    // const simpleQTO = new SimpleQTO(viewer);
    // await simpleQTO.setup();
    //
    // //Instance properties finder tool
    // const propsFinder = new OBC.IfcPropertiesFinder(viewer);
    // await propsFinder.init();
    // propsFinder.onFound.add((fragmentIdMap) => {
    //   highlighter.highlightByID("select", fragmentIdMap);
    // });

    const panel = BUI.Component.create<BUI.Panel>(() => {
      const [modelList] = CUI.tables.modelsList({ components });
      const [properties, updateProperties] = CUI.tables.elementProperties({
        components,
        fragmentIdMap: {},
      });
      highlighter.events.select.onHighlight.add((fragmentIdMap) =>
        updateProperties({ fragmentIdMap: {} }),
      );
      highlighter.events.select.onClear.add(() => updateProperties());
      return BUI.html`
        <bim-panel>
            <bim-panel-section label="Models Lists">${modelList}</bim-panel-section>
            <bim-panel-section label="Properties">${properties}</bim-panel-section>
            <bim-panel-section label="Groupings"></bim-panel-section>
            <bim-panel-section label="Spatial Structure"></bim-panel-section>
        </bim-panel>
      `;
    });

    //Toolbar tool definition, addChild funciton adds buttons to it
    const toolbar = BUI.Component.create<BUI.Toolbar>(() => {
      const [loadIfc] = CUI.buttons.loadIfc({ components });
      return BUI.html`
        <bim-toolbar>
            <bim-toolbar-section>
                ${loadIfc}
            </bim-toolbar-section>
        </bim-toolbar>
      `;
    });

    const viewportGrid = document.getElementById("viewport-grid") as BUI.Grid;
    viewportGrid.layouts = {
      main: {
        template: `
          "empty panel" 1fr
          "toolbar panel" auto
        `,
        elements: {
          toolbar,
          panel,
        },
      },
    };

    viewportGrid.layout = "main";
  };

  //   const toolbar = new OBC.Toolbar(viewer);
  //   if (defaultProject === false) {
  //     toolbar.addChild(ifcLoader.uiElement.get("main"));
  //   }
  //   toolbar.addChild(
  //     classificationsBtn,
  //     propertiesProcessor.uiElement.get("main"),
  //     simpleQTO.uiElement.get("activationBtn"),
  //     toDoCreator.uiElement.get("activationButton"),
  //     propsFinder.uiElement.get("main"),
  //     fragmentManager.uiElement.get("main"),
  //   );
  //   viewer.ui.addToolbar(toolbar);
  // };

  // This useEffect hook runs whenever props.project changes
  React.useEffect(() => {
    console.log("use effect in IFC Viewer");
    createViewer(); // Create a new viewer instance with updated project
    return () => {
      viewer.dispose(); // Dispose the previous viewer instance
      setViewer(null);
    };
  }, [props.project.id]); // Dependency on props.project

  return (
    // <BUI.Viewport id="viewer-container">
    //   <BUI.Grid id="viewport-grid" floating></BUI.Grid>
    // </BUI.Viewport>

    <bim-viewport
      id="viewer-container"
      // className="dashboard-card"
      // style={{ minWidth: 0, position: "relative" }}
    >
      <bim-grid id="viewport-grid" floating></bim-grid>
    </bim-viewport>
  );
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "bim-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "bim-checkbox": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "bim-color-input": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "bim-context-menu": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "bim-dropdown": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "bim-grid": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "bim-icon": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "bim-input": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "bim-label": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "bim-number-input": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "bim-option": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "bim-panel": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "bim-panel-section": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "bim-selector": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "bim-table": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "bim-tabs": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "bim-tab": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "bim-table-cell": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "bim-table-children": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "bim-table-group": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "bim-table-row": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "bim-text-input": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "bim-toolbar": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "bim-toolbar-group": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "bim-toolbar-section": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "bim-viewport": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
