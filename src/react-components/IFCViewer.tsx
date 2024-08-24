import * as React from "react";
import * as OBC from "openbim-components";
import { FragmentsGroup } from "bim-fragment";
import { ToDoCreator } from "../bim-components/ToDoCreator";
import { SimpleQTO } from "../bim-components/SimpleQTO";
import { Project } from "../class/projects";

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
    const sceneComponent = new OBC.SimpleScene(viewer);
    viewer.scene = sceneComponent;
    const scene = sceneComponent.get();
    sceneComponent.setup();
    scene.background = null;

    const viewerContainer = document.getElementById(
      "viewer-container",
    ) as HTMLDivElement;
    const rendererComponent = new OBC.PostproductionRenderer(
      viewer,
      viewerContainer,
    );
    viewer.renderer = rendererComponent;

    //Camera tool setup
    const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer);
    viewer.camera = cameraComponent;

    //Raycaster tool setup
    const raycasterComponent = new OBC.SimpleRaycaster(viewer);
    viewer.raycaster = raycasterComponent;

    //Renderer setup, viewer initialization after defining basic objects (scene, camera...)
    viewer.init();
    cameraComponent.updateAspect(); //Camera aspect fix
    rendererComponent.postproduction.enabled = true; //Outlines

    const fragmentManager = new OBC.FragmentManager(viewer);
    const ifcLoader = new OBC.FragmentIfcLoader(viewer);

    //Highlighter tool setup based on Raycaster
    const highlighter = new OBC.FragmentHighlighter(viewer);
    highlighter.setup();

    //Culler tool setup to optimize the viewer performace
    const culler = new OBC.ScreenCuller(viewer);
    cameraComponent.controls.addEventListener("sleep", () => {
      culler.needsUpdate = true;
    });

    //Classifier tool definition
    const classifier = new OBC.FragmentClassifier(viewer);

    //IFC Properies processor tool setup
    const propertiesProcessor = new OBC.IfcPropertiesProcessor(viewer);
    highlighter.events.select.onClear.add(() => {
      propertiesProcessor.cleanPropertiesList();
    });

    ifcLoader.onIfcLoaded.add(async (model) => {
      onModelLoaded(model);
      // exportToFRAG(model);
      // exportToJSON(model);
    });

    fragmentManager.onFragmentsLoaded.add((model) => {
      // importJSONProperties(model); // Added for challenge class 3.10.
      onModelLoaded(model);
    });

    let propsRoute: string | undefined;
    async function onModelLoaded(model: FragmentsGroup) {
      if (propsRoute) {
        const properties = await fetch(propsRoute);
        model.properties = await properties.json();
        propsRoute = undefined;
      }
      highlighter.update();
      for (const fragment of model.items) {
        culler.add(fragment.mesh);
      }
      culler.needsUpdate = true;
      try {
        classifier.byModel(model.name, model);
        classifier.byStorey(model);
        classifier.byEntity(model);
        console.log("Finished classification");
        const tree = await createModelTree();
        await classificationWindow.slots.content.dispose(true);
        classificationWindow.addChild(tree);
        propertiesProcessor.process(model); //IFC properties processor setup
        highlighter.events.select.onHighlight.add((fragmentMap) => {
          //Callback event to find the express ID of the selected element
          highlighter.update();
          const expressID = [...Object.values(fragmentMap)[0]][0];
          propertiesProcessor.renderProperties(model, Number(expressID)); //Method to show properties of selected elements
        });
      } catch (error) {
        alert(error);
      }
    }

    ifcLoader.settings.wasm = {
      path: "https://unpkg.com/web-ifc@0.0.44/",
      absolute: true,
    };

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
      const model = await fragmentManager.load(fragmentBinary);
    }

    //Classifier doesn't have UI elements, so button and window must be defined
    const classificationWindow = new OBC.FloatingWindow(viewer); //UI Component - floating window
    viewer.ui.add(classificationWindow);
    classificationWindow.title = "Model Groups";
    classificationWindow.visible = false;
    //UI Component and button
    const classificationsBtn = new OBC.Button(viewer);
    classificationsBtn.materialIcon = "account_tree";
    classificationsBtn.tooltip = "Classification";
    classificationsBtn.onClick.add(() => {
      classificationWindow.visible = !classificationWindow.visible;
      classificationWindow.active = classificationWindow.visible;
    });

    async function createModelTree() {
      const fragmentTree = new OBC.FragmentTree(viewer); //Fragment tree tool setup, organizing information from classifier tool
      await fragmentTree.init();
      await fragmentTree.update(["model", "storeys", "entities"]);
      const tree = fragmentTree.get().uiElement.get("tree");
      fragmentTree.onHovered.add((fragmentMap) => {
        //On hover method for the fragment map
        highlighter.highlightByID("hover", fragmentMap);
      });
      fragmentTree.onSelected.add((fragmentMap) => {
        //On selected method for fragment map
        highlighter.highlightByID("select", fragmentMap);
      });
      return tree; //Final result is the Fragment Tree
    }

    // //Import fragment button setup
    // const importFragmentBtn = new OBC.Button(viewer);
    // importFragmentBtn.materialIcon = "upload";
    // importFragmentBtn.tooltip = "Load FRAG";
    // importFragmentBtn.onClick.add(() => {
    //   const input = document.createElement("input");
    //   input.type = "file";
    //   input.accept = ".frag";
    //   const reader = new FileReader();
    //   reader.addEventListener("load", async () => {
    //     const binary = reader.result;
    //     if (!(binary instanceof ArrayBuffer)) {
    //       return;
    //     }
    //     const fragmentBinary = new Uint8Array(binary);
    //     await fragmentManager.load(fragmentBinary);
    //   });
    //   input.addEventListener("change", () => {
    //     const filesList = input.files;
    //     if (!filesList) {
    //       return;
    //     }
    //     reader.readAsArrayBuffer(filesList[0]);
    //   });
    //   input.click();
    // });

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

    //Instance of ToDoCreator and setup method
    const toDoCreator = new ToDoCreator(viewer);
    await toDoCreator.setup();
    toDoCreator.onProjectCreated.add((toDo) => {
      console.log(toDo);
    });

    // Instance of Quentity takeoff tool and setup method

    const simpleQTO = new SimpleQTO(viewer);
    await simpleQTO.setup();

    //Instance properties finder tool
    const propsFinder = new OBC.IfcPropertiesFinder(viewer);
    await propsFinder.init();
    propsFinder.onFound.add((fragmentIdMap) => {
      highlighter.highlightByID("select", fragmentIdMap);
    });

    //Toolbar tool definition, addChild funciton adds buttons to it
    const toolbar = new OBC.Toolbar(viewer);
    if (defaultProject === false) {
      toolbar.addChild(ifcLoader.uiElement.get("main"));
    }
    toolbar.addChild(
      classificationsBtn,
      propertiesProcessor.uiElement.get("main"),
      simpleQTO.uiElement.get("activationBtn"),
      toDoCreator.uiElement.get("activationButton"),
      propsFinder.uiElement.get("main"),
      fragmentManager.uiElement.get("main"),
    );
    viewer.ui.addToolbar(toolbar);
  };

  const updateAndDisposeViewer = () => {};
  // This useEffect hook runs whenever props.project changes
  React.useEffect(() => {
    createViewer(); // Create a new viewer instance with updated project
    return () => {
      viewer.dispose(); // Dispose the previous viewer instance
      setViewer(null);
    };
  }, [props.project.id]); // Dependency on props.project

  return (
    <div
      id="viewer-container"
      className="dashboard-card"
      style={{ minWidth: 0, position: "relative" }}
    />
  );
}
