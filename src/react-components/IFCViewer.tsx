import * as React from "react";
import * as OBC from "@thatopen/components";

import { FragmentsGroup } from "bim-fragment";
import { ToDoCreator } from "../bim-components/ToDoCreator";
import { SimpleQTO } from "../bim-components/SimpleQTO";
import { Project } from "../class/projects";
import { cameraPosition } from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";

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
  const setViewer = () => {
    const viewer = new OBC.Components();
    const worlds = viewer.get(OBC.Worlds);

    const world = worlds.create<
      OBC.SimpleScene,
      OBC.OrthoPerspectiveCamera,
      OBC.SimpleRenderer
    >();

    const sceneComponent = new OBC.SimpleScene(viewer);
    world.scene = sceneComponent;
    world.scene.setup();
    world.scene.three.background = null;

    const viewerContainer = document.getElementById(
      "viewer-container",
    ) as HTMLElement;
    const rendererComponent = new OBC.SimpleRenderer(viewer, viewerContainer);
    world.renderer = rendererComponent;

    const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer);
    world.camera = cameraComponent;

    viewer.init();

    world.camera.controls.setLookAt(3, 3, 3, 0, 0, 0);
    world.camera.updateAspect();
  };

  React.useEffect(() => {
    setViewer();
    return () => {};
  }, []);

  return (
    <div
      id="viewer-container"
      className="dashboard-card"
      style={{ minWidth: 0, position: "relative" }}
    />
  );
}
