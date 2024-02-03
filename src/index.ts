// Import necessary types and functions from project files
import * as THREE from 'three'
import * as OBC from "openbim-components"
import { FragmentsGroup } from "bim-fragment"
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import {
  IProject,
  ProjectStatus,
  ProjectType,
  ITeam,
  TeamRole,
  toggleModal,
  Project
} from "../src/class/projects";
import { ProjectsManager } from "./class/projectsManager";

// DOM elements
const projectsListUI = document.getElementById("projects-list") as HTMLElement;
const projectForm = document.getElementById("new-project-form") as HTMLFormElement;
const cancelNewProjectBtn = document.getElementById("cancel-new-project-btn");
const submitNewProjectBtn = document.getElementById("submit-new-project-btn");
const newTeamBtn = document.getElementById("new-team-btn");
const teamForm = document.getElementById("new-team-form") as HTMLFormElement;
const cancelNewTeamBtn = document.getElementById("cancel-new-team-btn");
const submitNewTeamBtn = document.getElementById("submit-new-team-btn");
const newProjectBtn = document.getElementById("new-project-btn");
const closeErrorPopup = document.getElementById("close-error-popup");
const closeTeamInfoPopup = document.getElementById("close-team-info-popup");
const exportProjectsBtn = document.getElementById("export-projects-btn");
const navProjectsBtn = document.getElementById("nav-projects-btn");

// ProjectsManager instance
const projectsManager = new ProjectsManager(projectsListUI);

// Event listeners

// Event listener for opening the "New Project" modal
if (newProjectBtn) {
  newProjectBtn.addEventListener("click", () => {
    toggleModal("new-project-modal");
  });
} else {
  console.warn("New project button was not found");
}

// Event listener for opening the "New Team" modal
if (newTeamBtn) {
  newTeamBtn.addEventListener("click", () => {
    toggleModal("new-team-modal");
  });
} else {
  console.warn("New team button was not found");
}

// Event listener for closing the error popup modal
if (closeErrorPopup) {
  closeErrorPopup.addEventListener("click", () => {
    toggleModal("error-popup");
  });
}

// Event listener for submitting a new project form
if (projectForm) {
  submitNewProjectBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    // Gather form data and create a new project
    const formData = new FormData(projectForm);
    const projectData: IProject = {
      projectName: formData.get("project-name") as string,
      projectDescription: formData.get("project-description") as string,
      projectStatus: formData.get("project-status") as ProjectStatus,
      projectCost: formData.get("project-cost") as string,
      projectType: formData.get("project-type") as ProjectType,
      projectAddress: formData.get("project-address") as string,
      projectFinishDate: new Date(formData.get("finishDate") as string),
      projectProgress: formData.get("project-progress") as string
    };
    try {
      // Attempt to create a new project
      const project = projectsManager.newProject(projectData);
      projectForm.reset();
      toggleModal("new-project-modal");
    } catch (err) {
      // Display an error message in case of an exception
      const errorMessage = document.getElementById("err") as HTMLElement;
      errorMessage.textContent = err;
      toggleModal("error-popup");
    }
  });
  // Event listener for canceling the new project form
  cancelNewProjectBtn?.addEventListener("click", () => {
    projectForm.reset();
    toggleModal("new-project-modal");
  });
} else {
  console.warn("The project form was not found. Check the ID!");
}

// Event listener for submitting a new team form
if (teamForm) {
  submitNewTeamBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    // Gather form data and create a new team
    const formData = new FormData(teamForm);
    const currentProjectName = projectsManager.currentProject?.projectName;
    console.log(currentProjectName)
    const teamData: ITeam = {
      teamName: formData.get("teamName") as string,
      teamRole: formData.get("teamRole") as TeamRole,
      teamDescription: formData.get("teamDescription") as string,
      contactName: formData.get("contactName") as string,
      contactPhone: formData.get("contactPhone") as string,
      teamProject: currentProjectName as string
    };
    try {
      // Attempt to create a new team
      const team = projectsManager.createNewTeam(teamData);
      teamForm.reset();
      toggleModal("new-team-modal");
    } catch (err) {
      // Display an error message in case of an exception
      const errorMessage = document.getElementById("err") as HTMLElement;
      errorMessage.textContent = err;
      toggleModal("error-popup");
    }
  });
  // Event listener for canceling the new team form
  cancelNewTeamBtn?.addEventListener("click", () => {
    teamForm.reset();
    toggleModal("new-team-modal");
  });
} else {
  console.warn("The team form was not found. Check the ID!");
}

// Event listener for closing the team info popup modal
if (closeTeamInfoPopup) {
  closeTeamInfoPopup.addEventListener("click", () => {
    toggleModal("team-info-popup");
  });
}

// Event listener for exporting projects to JSON
if (exportProjectsBtn) {
  exportProjectsBtn.addEventListener("click", () => {
    projectsManager.exportToJSON();
  });
}

const importProjectsBtn = document.getElementById("import-projects-btn")
if (importProjectsBtn) {
  importProjectsBtn.addEventListener("click", () => {
    projectsManager.importFromJSON()
  })
}

// Event listener for showing project info
if (projectsListUI) {
  projectsListUI.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const projectId = target.dataset.projectId;    
    if (projectId) {
      const clickedProject = projectsManager.projectsList.find((project) => project.id === projectId);
      if (clickedProject) {
        projectsManager.showProjectDetails(clickedProject);
      }
    }
  });
}

//openBIM-components viewer
const viewer = new OBC.Components()

const sceneComponent = new OBC.SimpleScene(viewer)
sceneComponent.setup()
viewer.scene = sceneComponent
const scene = sceneComponent.get()
scene.background = null

const viewerContainer = document.getElementById("viewer-container") as HTMLDivElement
const rendererComponent = new OBC.PostproductionRenderer(viewer, viewerContainer)
viewer.renderer = rendererComponent

const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer)
viewer.camera = cameraComponent

const raycasterComponent = new OBC.SimpleRaycaster(viewer)
viewer.raycaster = raycasterComponent

viewer.init()
cameraComponent.updateAspect()
rendererComponent.postproduction.enabled = true

const fragmentManager = new OBC.FragmentManager(viewer)
function exportFragments(model:FragmentsGroup) {
  const fragmentBinary = fragmentManager.export(model)
  const blob = new Blob([fragmentBinary])
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${model.name.replace(".ifc","")}.frag`
  a.click()
  URL.revokeObjectURL(url)

  const json = JSON.stringify(model.properties, null, 2) // Added for challenge class 3.10.
  const jsonblob = new Blob([json], { type: "application/json" })
  const jsonUrl = URL.createObjectURL(jsonblob)
  const jsona = document.createElement('a')
  jsona.href = jsonUrl
  jsona.download = `${model.name.replace(".ifc", "")}`
  jsona.click();
  URL.revokeObjectURL(jsonUrl)
}

const ifcLoader = new OBC.FragmentIfcLoader(viewer)
ifcLoader.settings.wasm = {
  path: "https://unpkg.com/web-ifc@0.0.43/",
  absolute: true
}

const highlighter = new OBC.FragmentHighlighter(viewer)
highlighter.setup()

const propertiesProcessor = new OBC.IfcPropertiesProcessor(viewer)
highlighter.events.select.onClear.add(() => {
  propertiesProcessor.cleanPropertiesList()
})

const classifier = new OBC.FragmentClassifier(viewer)
const classificationWindow = new OBC.FloatingWindow(viewer)
classificationWindow.visible = false
viewer.ui.add(classificationWindow)
classificationWindow.title = "Model Groups"

const classificationsBtn = new OBC.Button(viewer)
classificationsBtn.materialIcon = "account_tree"
classificationsBtn.tooltip = "Classificaiton"

classificationsBtn.onClick.add(() => {
  classificationWindow.visible = !classificationWindow.visible
  classificationWindow.active = classificationWindow.visible
})

async function createModelTree() {
  const fragmentTree = new OBC.FragmentTree(viewer)
  await fragmentTree.init()
  await fragmentTree.update(["model","storeys", "entities"])
  fragmentTree.onHovered.add((fragmentMap) => {
    highlighter.highlightByID("hover", fragmentMap)
  })
  fragmentTree.onSelected.add((fragmentMap) => {
    highlighter.highlightByID("select", fragmentMap)
  })
  const tree = fragmentTree.get().uiElement.get("tree")
  return tree
}

const culler = new OBC.ScreenCuller(viewer)
cameraComponent.controls.addEventListener("sleep", () => {
  culler.needsUpdate = true
})

async function onModelLoaded(model: FragmentsGroup) {
  highlighter.update()
  for (const fragment of model.items) {culler.add(fragment.mesh)}
  culler.needsUpdate = true 
  try {
    console.log(model)
    classifier.byModel(model.name, model)
    classifier.byStorey(model)
    classifier.byEntity(model)
    console.log("2")
    const tree = await createModelTree()
    await classificationWindow.slots.content.dispose(true)
    classificationWindow.addChild(tree)
    propertiesProcessor.process(model)
    highlighter.events.select.onHighlight.add((fragmentMap) => {
      const expressID = [...Object.values(fragmentMap)[0]][0]
      propertiesProcessor.renderProperties(model, Number(expressID))
    })
  } catch (error) {
    alert(error)
  }
}

ifcLoader.onIfcLoaded.add(async (model) => {
  exportFragments(model)
  onModelLoaded(model)
})

fragmentManager.onFragmentsLoaded.add((model) => {
  importJSONProperties(model) // Added for challenge class 3.10.
  onModelLoaded(model)
})

const importFragmentBtn = new OBC.Button(viewer)
importFragmentBtn.materialIcon = "upload"
importFragmentBtn.tooltip = "Load FRAG"


importFragmentBtn.onClick.add(() => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.frag'
  const reader = new FileReader()
  reader.addEventListener("load", async () => {
    const binary = reader.result
    if (!(binary instanceof ArrayBuffer)) { return }
    const fragmentBinary = new Uint8Array(binary)
    await fragmentManager.load(fragmentBinary)
  })
  input.addEventListener('change', () => {
    const filesList = input.files
    if (!filesList) { return }
    reader.readAsArrayBuffer(filesList[0])
  })
  input.click()
})

function importJSONProperties(model: FragmentsGroup) {  // Added for challenge class 3.10.
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'application/json'
  const reader = new FileReader()
  reader.addEventListener("load", async () => {
    const json = reader.result
    if (!json) { return }
    const importedPropertiesFromJSON = JSON.parse(json as string)
    model.properties = importedPropertiesFromJSON
  })
  input.addEventListener('change', () => {
    const filesList = input.files
    if (!filesList) { return }
    reader.readAsText(filesList[0])
  })
  input.click()
}

const toolbar = new OBC.Toolbar(viewer)
toolbar.addChild(
  ifcLoader.uiElement.get("main"),
  importFragmentBtn,
  classificationsBtn,
  propertiesProcessor.uiElement.get("main"),
  fragmentManager.uiElement.get("main")
)

viewer.ui.addToolbar(toolbar)