import * as React from "react";
import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import * as BUI from "@thatopen/ui";
import * as CUI from "@thatopen/ui-obc";
import { Project } from "../class/projects";
import { FragmentsGroup } from "@thatopen/fragments";
import { SimpleQTO } from "../bim-components/SimpleQTO/src/SimpleQTO";
import { TeamsCreator } from "../bim-components/TeamsCreator/src/TeamsCreator";
import { qtoTool } from "../bim-components/SimpleQTO/src/Template";

interface Props {
  project: Project;
  components: OBC.Components;
}

export function IFCViewer(props: Props) {
  const components = props.components;

  let defaultProject: boolean = false;
  if (props.project.fragRoute) {
    defaultProject = true;
  }
  let fragmentModel: FragmentsGroup | undefined;
  const [classificationsTree, updateClassificationsTree] =
    CUI.tables.classificationTree({
      components: components!,
      classifications: [],
    });

  const floatingGridRef = React.useRef<BUI.Grid | null>(null);

  async function loadModelCheck() {
    let propsRoute: string | undefined;
    if (
      components &&
      defaultProject === true &&
      props.project &&
      props.project.fragRoute &&
      props.project.jsonRoute
    ) {
      try {
        const file = await fetch(props.project.fragRoute);
        const data = await file.arrayBuffer();
        const fragmentBinary = new Uint8Array(data);
        const fragmentsManager = components.get(OBC.FragmentsManager);
        const model = await fragmentsManager.load(fragmentBinary);

        // Fetch and apply properties from the JSON file
        propsRoute = props.project.jsonRoute;
        const jsonProperties = await fetch(propsRoute);
        const properties = await jsonProperties.json();

        // Apply properties to the model
        model.setLocalProperties(properties);
        await processModel(model);
      } catch (error) {
        console.error("Error loading model or properties:", error);
      }
    }
  }

  const setViewer = () => {
    const worlds = components.get(OBC.Worlds);
    const world = worlds.create<
      OBC.SimpleScene,
      OBC.OrthoPerspectiveCamera,
      OBCF.PostproductionRenderer
    >();

    const sceneComponent = new OBC.SimpleScene(components);

    world.scene = sceneComponent;
    (world.scene as OBC.SimpleScene).setup();
    (world.scene as OBC.SimpleScene).three.background = null;

    const viewerContainer = document.getElementById(
      "viewer-container"
    ) as HTMLElement;
    const rendererComponent = new OBCF.PostproductionRenderer(
      components,
      viewerContainer
    );
    world.renderer = rendererComponent;

    const cameraComponent = new OBC.OrthoPerspectiveCamera(components);
    world.camera = cameraComponent;

    components.init();

    (world.renderer as OBCF.PostproductionRenderer).postproduction.enabled =
      true;
    (world.camera as OBC.OrthoPerspectiveCamera).controls.setLookAt(
      3,
      3,
      3,
      0,
      0,
      0
    );
    (world.camera as OBC.OrthoPerspectiveCamera).updateAspect();

    const ifcLoader = components.get(OBC.IfcLoader);
    ifcLoader.setup();
    loadModelCheck();

    const cullers = components.get(OBC.Cullers);
    const culler = cullers.create(world);

    const highlighter = components.get(OBCF.Highlighter);
    highlighter.setup({ world });
    highlighter.zoomToSelection = true;

    viewerContainer.addEventListener("resize", () => {
      rendererComponent.resize();
      cameraComponent.updateAspect();
    });

    (world.camera as OBC.OrthoPerspectiveCamera).controls.addEventListener(
      "controlend",
      () => {
        culler.needsUpdate = true;
      }
    );

    const fragmentsManager = components.get(OBC.FragmentsManager);
    fragmentsManager.onFragmentsLoaded.add(async (model) => {
      world.scene.three.add(model);

      if (model.hasProperties) {
        await processModel(model);
      }

      // for (const fragment of model.items) {
      //   culler.add(fragment.mesh);
      // }
      // culler.needsUpdate = true;

      fragmentModel = model;
    });

    const teamsCreator = components.get(TeamsCreator);
    teamsCreator.world = world;
  };

  const processModel = async (model: FragmentsGroup) => {
    if (!components) return;
    const indexer = components.get(OBC.IfcRelationsIndexer);
    await indexer.process(model);

    const classifier = components.get(OBC.Classifier);
    await classifier.bySpatialStructure(model);
    await classifier.byPredefinedType(model);
    classifier.byEntity(model);

    const classifications = [
      {
        system: "entities",
        label: "Entities",
      },
      {
        system: "spatialStructures",
        label: "Spatial Containers",
      },
      {
        system: "predefinedTypes",
        label: "Predefined Types",
      },
    ];
    if (updateClassificationsTree) {
      updateClassificationsTree({ classifications });
    }
  };

  const onFragmentExport = () => {
    if (!components) return;

    const fragmentsManager = components.get(OBC.FragmentsManager);

    if (!fragmentModel) return;
    const fragmentBinary = fragmentsManager.export(fragmentModel);
    const blob = new Blob([fragmentBinary]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fragmentModel.name}.frag`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onFragmentImport = async () => {
    if (!components) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".frag";
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const binary = reader.result;
      if (!(binary instanceof ArrayBuffer)) return;
      const fragmentBinary = new Uint8Array(binary);
      const fragmentsManager = components.get(OBC.FragmentsManager);
      fragmentsManager.load(fragmentBinary);
    });
    input.addEventListener("change", () => {
      const filesList = input.files;
      if (!filesList) return;
      reader.readAsArrayBuffer(filesList[0]);
    });
    input.click();
  };

  const onPropertyExport = () => {
    if (!fragmentModel) return;
    const properties = fragmentModel.getLocalProperties();
    const json = JSON.stringify(properties, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fragmentModel.name.replace(".ifc", "")}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onPropertyImport = () => {
    if (!fragmentModel) {
      console.error("fragmentModel is not defined.");
      return;
    }

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    const reader = new FileReader();

    reader.addEventListener("load", async () => {
      if (!fragmentModel) {
        console.error("fragmentModel is not defined.");
        return;
      }

      const json = reader.result;
      if (typeof json !== "string") {
        console.error("File read result is not a string.");
        return;
      }

      try {
        const properties = JSON.parse(json);
        fragmentModel.setLocalProperties(properties);
        await processModel(fragmentModel);
      } catch (error) {
        console.error("Failed to parse JSON:", error);
      }

      reader.addEventListener("error", () => {
        console.error("Error reading file:", reader.error);
      });
    });

    input.addEventListener("change", () => {
      const filesList = input.files;
      if (!filesList || filesList.length === 0) {
        console.error("No file selected.");
        return;
      }

      reader.readAsText(filesList[0]);
    });

    input.click();
  };

  const onToggleVisibility = () => {
    if (!components) return;

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
    if (!components) return;

    const highlighter = components.get(OBCF.Highlighter);
    const hider = components.get(OBC.Hider);
    const selection = highlighter.selection.select;
    hider.isolate(selection);
  };

  const onShow = () => {
    if (!components) return;

    const hider = components.get(OBC.Hider);
    hider.set(true);
  };

  // const getProperties = async () => {
  //   if (!components) return;
  //   if (!fragmentModel) return;

  //   const highlighter = components.get(OBCF.Highlighter);
  //   const selection = highlighter.selection.select;
  //   const indexer = components.get(OBC.IfcRelationsIndexer);
  //   for (const fragmentID in selection) {
  //     const expressIDs = selection[fragmentID];
  //     for (const id of Array.from(expressIDs)) {
  //       const psets = indexer.getEntityRelations(
  //         fragmentModel,
  //         id,
  //         "ContainedInStructure"
  //       );
  //       if (psets) {
  //         for (const expressId of psets) {
  //           const prop = await fragmentModel.getProperties(expressId);
  //         }
  //       }
  //     }
  //   }
  // };

  const setupUI = () => {
    const viewerContainer = document.getElementById("viewer-container");
    if (!viewerContainer) return;
    if (!components) return;

    const floatingGrid = BUI.Component.create<BUI.Grid>(() => {
      return BUI.html`
        <bim-grid floating style="padding: 20px"></bim-grid>
      `;
    });

    floatingGridRef.current = floatingGrid;

    const elementPropertyPanel = BUI.Component.create<BUI.Panel>(() => {
      const [propsTable, updatePropsTable] = CUI.tables.elementProperties({
        components,
        fragmentIdMap: {},
      });
      const highlighter = components.get(OBCF.Highlighter);

      highlighter.events.select.onHighlight.add(async (fragmentIdMap) => {
        if (!floatingGrid) return;
        floatingGrid.layout = "main";
        updatePropsTable({ fragmentIdMap });
        propsTable.expanded = false;

        const simpleQto = components.get(SimpleQTO);
        await simpleQto.sumQuantities(fragmentIdMap);
      });

      highlighter.events.select.onClear.add(() => {
        updatePropsTable({ fragmentIdMap: {} });
        if (!floatingGrid) return;
        floatingGrid.layout = "main";

        const simpleQto = components.get(SimpleQTO);
        simpleQto.resetQuantities();
      });

      const search = (e: Event) => {
        const input = e.target as BUI.TextInput;
        propsTable.queryString = input.value;
      };

      return BUI.html`
        <bim-panel>
            <bim-panel-section
             name="property"
             label="Property Information"
             icon="solar:document-bold"
             fixed
            >
                <bim-text-input @input="${search}" placeholder="Search..."></bim-text-input>
                ${propsTable}
            </bim-panel-section>
        </bim-panel>
      `;
    });

    const worldPanel = BUI.Component.create<BUI.Panel>(() => {
      const [worldTable] = CUI.tables.worldsConfiguration({ components });

      const search = (e: Event) => {
        const input = e.target as BUI.TextInput;
        worldTable.queryString = input.value;
      };

      return BUI.html`
        <bim-panel>
            <bim-panel-section
             name="world"
             label="World Information"
             icon="solar:document-bold"
             fixed
            >
                <bim-text-input @input="${search}" placeholder="Search..."></bim-text-input>
                ${worldTable}
            </bim-panel-section>
        </bim-panel>
      `;
    });

    const onShowProperty = () => {
      if (!components || !fragmentModel) return;

      if (!floatingGrid) return;
      if (floatingGrid.layout !== "second") {
        floatingGrid.layout = "second";
      } else {
        floatingGrid.layout = "main";
      }
    };

    const onClassifier = () => {
      if (!components || !fragmentModel) return;

      if (!floatingGrid) return;
      if (floatingGrid.layout !== "classifier") {
        floatingGrid.layout = "classifier";
      } else {
        floatingGrid.layout = "main";
      }
    };

    const classifierPanel = BUI.Component.create<BUI.Panel>(() => {
      return BUI.html`
        <bim-panel>
             <bim-panel-section
             name="classifier"
             label="Classifier"
             icon="solar:document-bold"
             fixed
            >
                <bim-label>Classifications</bim-label>
                ${classificationsTree}
            </bim-panel-section>
        </bim-panel>
      `;
    });

    const onShowQuantity = async () => {
      if (!components || !fragmentModel) return;

      const highlighter = components.get(OBCF.Highlighter);
      const selection = highlighter.selection.select;
      const simpleQto = components.get(SimpleQTO);
      await simpleQto.sumQuantities(selection);

      if (!floatingGrid) return;
      if (floatingGrid.layout !== "qtos") {
        floatingGrid.layout = "qtos";
      } else {
        floatingGrid.layout = "main";
      }
    };

    const qtoTable = qtoTool({ components });
    const qtoPanel = BUI.Component.create<BUI.Panel>(() => {
      return BUI.html`
        <bim-panel>
            <bim-panel-section
             name="qto"
             label="Quantities"
             icon="solar:document-bold"
             fixed
            >
                ${qtoTable}
            </bim-panel-section>
        </bim-panel>
      `;
    });

    const onWorldsUpdate = () => {
      if (!floatingGrid) return;
      floatingGrid.layout = "world";
    };

    const toolbar = BUI.Component.create<BUI.Toolbar>(() => {
      const [loadIfcBtn] = CUI.buttons.loadIfc({ components: components });
      loadIfcBtn.tooltipTitle = "Load IFC";
      loadIfcBtn.label = "";

      return BUI.html`
        <bim-toolbar style="justify-self: center">
            <bim-toolbar-section label="App">
                <bim-button 
                    tooltip-title="World" 
                    icon="tabler:brush"
                    @click=${onWorldsUpdate}
                ></bim-button>
            </bim-toolbar-section>
      ${
        defaultProject === false
          ? BUI.html`<bim-toolbar-section label="Import">
            ${loadIfcBtn}
        </bim-toolbar-section>`
          : ""
      }
            <bim-toolbar-section label="Fragments">
                <bim-button 
                    tooltip-title="Import" 
                    icon="mdi:cube"
                    @click=${onFragmentImport}
                ></bim-button>
                <bim-button 
                    tooltip-title="Export" 
                    icon="tabler:package-export"
                    @click=${onFragmentExport}
                ></bim-button>
                <bim-button 
                    tooltip-title="Import" 
                    icon="clarity:import-line"
                    @click=${onPropertyImport}
                ></bim-button>
                <bim-button 
                    tooltip-title="Export" 
                    icon="clarity:export-line"
                    @click=${onPropertyExport}
                ></bim-button>
            </bim-toolbar-section>
            <bim-toolbar-section label="Selection">
                <bim-button 
                    tooltip-title="Visibility" 
                    icon="material-symbols:visibility-outline"
                    @click=${onToggleVisibility}
                ></bim-button>
                <bim-button 
                    tooltip-title="Show all" 
                    icon="tabler:eye-filled"
                    @click=${onShow}
                ></bim-button>
                <bim-button 
                    tooltip-title="Isolate" 
                    icon="mdi:filter"
                    @click=${onIsolate}
                ></bim-button>
            </bim-toolbar-section>
            <bim-toolbar-section label="Property">
                <bim-button 
                    tooltip-title="Show" 
                    icon="clarity:list-line"
                    @click=${onShowProperty}
                ></bim-button>
                <bim-button 
                    tooltip-title="Quantities" 
                    icon="mdi:summation"
                    @click=${onShowQuantity}
                ></bim-button>
            </bim-toolbar-section>
            <bim-toolbar-section label="Groups">
                <bim-button 
                    tooltip-title="Classifier" 
                    icon="tabler:eye-filled"
                    @click=${onClassifier}
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
      second: {
        template: `
        "empty elementPropertyPanel" 1fr
        "toolbar toolbar" auto
        /1fr 20rem
        `,
        elements: {
          toolbar,
          elementPropertyPanel,
        },
      },
      world: {
        template: `
        "empty worldPanel" 1fr
        "toolbar toolbar" auto
        /1fr 20rem
        `,
        elements: {
          toolbar,
          worldPanel,
        },
      },
      classifier: {
        template: `
        "empty classifierPanel" 1fr
        "toolbar toolbar" auto
        /1fr 20rem
        `,
        elements: {
          toolbar,
          classifierPanel,
        },
      },
      qtos: {
        template: `
        "empty qtoPanel" 1fr
        "toolbar toolbar" auto
        /1fr 20rem
        `,
        elements: {
          toolbar,
          qtoPanel,
        },
      },
    };

    floatingGrid.layout = "main";

    viewerContainer.appendChild(floatingGrid);
  };

  React.useEffect(() => {
    const loadAndSetup = async () => {
      if (fragmentModel) {
        fragmentModel.dispose();
        fragmentModel = undefined;
      }

      if (components) {
        components.dispose();
      }

      if (floatingGridRef.current) {
        floatingGridRef.current.layout = "main";
      }

      setViewer();
      setupUI();
      await loadModelCheck();
    };

    loadAndSetup();

    return () => {
      if (components) {
        components.dispose();
      }

      if (fragmentModel) {
        fragmentModel.dispose();
        fragmentModel = undefined;
      }
    };
  }, [props.project.id]); // Re-run when props.project changes

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
