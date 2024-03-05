// Import necessary types and functions from project files
import * as THREE from 'three'
import * as OBC from "openbim-components"
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { FragmentsGroup } from "bim-fragment"
import {
  IProject,
  ProjectStatus,
  ProjectType,
  ITeam,
  TeamRole,
  toggleModal,
  Project
} from "./class/projects";
import { Sidebar } from "./react-components/Sidebar"
import { ProjectsManager } from "./class/projectsManager";
import { ToDoCreator } from './bim-components/ToDoCreator';
import { SimpleQTO } from './bim-components/SimpleQTO';
import { DetailsPage } from './react-components/DetailsPage'

const rootElement = document.getElementById("app") as HTMLDivElement
const appRoot = ReactDOM.createRoot(rootElement)
appRoot.render(
  <>
  <Sidebar />
  <DetailsPage /> 
  </>
)

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

//first thing, to keep the viewer running
const viewer = new OBC.Components()

//Scene tool setup
const sceneComponent = new OBC.SimpleScene(viewer)
viewer.scene = sceneComponent
const scene = sceneComponent.get()
sceneComponent.setup()
scene.background = null

const viewerContainer = document.getElementById("viewer-container") as HTMLDivElement
const rendererComponent = new OBC.PostproductionRenderer(viewer, viewerContainer)
viewer.renderer = rendererComponent

//Camera tool setup
const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer)
viewer.camera = cameraComponent

//Raycaster tool setup
const raycasterComponent = new OBC.SimpleRaycaster(viewer)
viewer.raycaster = raycasterComponent

//Renderer setup, viewer initialization after defining basic objects (scene, camera...)
viewer.init()
cameraComponent.updateAspect() //Camera aspect fix
rendererComponent.postproduction.enabled = true //Outlines

//Fragment manager tool setup
const fragmentManager = new OBC.FragmentManager(viewer)
function exportFragments(model:FragmentsGroup) { //Method to export Fragments Groups, Fragments group datatype is necessary
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

//IFC Loader tool setup, uses web-ifc library to process IFC files
const ifcLoader = new OBC.FragmentIfcLoader(viewer)
ifcLoader.settings.wasm = {
  path: "https://unpkg.com/web-ifc@0.0.44/", //Includes version of web-ifc, needs to match version used by openBIM components
  absolute: true
}

//Highlighter tool setup based on Raycaster
const highlighter = new OBC.FragmentHighlighter(viewer)
highlighter.setup()

//IFC Properies processor tool setup
const propertiesProcessor = new OBC.IfcPropertiesProcessor(viewer)
highlighter.events.select.onClear.add(() => {
  propertiesProcessor.cleanPropertiesList()
})

//Classifier tool definition
const classifier = new OBC.FragmentClassifier(viewer)

//Classifier doesn't have UI elements, so button and window must be defined
const classificationWindow = new OBC.FloatingWindow(viewer) //UI Component - floating window
viewer.ui.add(classificationWindow)
classificationWindow.title = "Model Groups"
classificationWindow.visible = false
//UI Component and button
const classificationsBtn = new OBC.Button(viewer) 
classificationsBtn.materialIcon = "account_tree"
classificationsBtn.tooltip = "Classification"
classificationsBtn.onClick.add(() => {
  classificationWindow.visible = !classificationWindow.visible
  classificationWindow.active = classificationWindow.visible
})

async function createModelTree() {
  const fragmentTree = new OBC.FragmentTree(viewer) //Fragment tree tool setup, organizing information from classifier tool
  await fragmentTree.init()
  await fragmentTree.update(["model","storeys", "entities"])
  const tree = fragmentTree.get().uiElement.get("tree")
  fragmentTree.onHovered.add((fragmentMap) => { //On hover method for the fragment map
    highlighter.highlightByID("hover", fragmentMap)
  })
  fragmentTree.onSelected.add((fragmentMap) => { //On selected method for fragment map
    highlighter.highlightByID("select", fragmentMap)
  })
  return tree //Final result is the Fragment Tree
}

//Culler tool setup to optimize the viewer performace 
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
    classifier.byModel(model.name, model) //Classifier tool setup once model is loaded
    classifier.byStorey(model)
    classifier.byEntity(model)
    console.log("Finished classification")
    const tree = await createModelTree()
    await classificationWindow.slots.content.dispose(true)
    classificationWindow.addChild(tree)
    propertiesProcessor.process(model) //IFC properties processor setup
    highlighter.events.select.onHighlight.add((fragmentMap) => { //Callback event to find the express ID of the selected element
      highlighter.update()
      const expressID = [...Object.values(fragmentMap)[0]][0]
      propertiesProcessor.renderProperties(model, Number(expressID)) //Method to show properties of selected elements
    })
  } catch (error) {
    alert(error)
  }
}

//IFC loaded event listener callback
ifcLoader.onIfcLoaded.add(async (model) => {
  // exportFragments(model)*************************
  onModelLoaded(model)
})

//Fragments loaded event listener callback
fragmentManager.onFragmentsLoaded.add((model) => {
  importJSONProperties(model) // Added for challenge class 3.10.
  onModelLoaded(model)
})

//Import fragment button setup
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

//Function to import json file with properties 
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

//Instance of ToDoCreator and setup method
const toDoCreator = new ToDoCreator(viewer)
await toDoCreator.setup()
toDoCreator.onProjectCreated.add((toDo) => {
  console.log(toDo)
})

//Instance of Quentity takeoff tool and setup method
const simpleQTO = new SimpleQTO(viewer)
await simpleQTO.setup()

//Instance properties finder tool
const propsFinder = new OBC.IfcPropertiesFinder(viewer)
await propsFinder.init()
propsFinder.onFound.add((fragmentIdMap) => {
  highlighter.highlightByID("select", fragmentIdMap)
})

//Toolbar tool definition, addChild funciton adds buttons to it
const toolbar = new OBC.Toolbar(viewer) 
toolbar.addChild(
  ifcLoader.uiElement.get("main"),
  // importFragmentBtn,**************
  classificationsBtn,
  propertiesProcessor.uiElement.get("main"),
  simpleQTO.uiElement.get("activationBtn"),
  toDoCreator.uiElement.get("activationButton"),
  propsFinder.uiElement.get("main"),
  fragmentManager.uiElement.get("main")
)
viewer.ui.addToolbar(toolbar)

