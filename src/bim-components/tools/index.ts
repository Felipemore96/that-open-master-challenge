import * as OBC from "openbim-components"


export class ToDoCreator extends OBC.Component<null> implements OBC.UI {
    static uuid = "be178b9a-0ee1-4d3d-b83a-49d4c5f3e34b"
    enable = true
    uiElement = new OBC.UIElement<{
        activationButton: OBC.Button
        toDoList: OBC.FloatingWindow
    }>()
    private _components: OBC.Components
    
    constructor(components: OBC.Components) {
        super(components)
        this._components = components
        components.tools.add(ToDoCreator.uuid, this)
        this.setUI()
    }

    addToDo(description: string) {
        
    }

    private setUI() {
        const activationButton = new OBC.Button(this._components)
        activationButton.materialIcon = "construction"

        const newToDoBtn = new OBC.Button(this._components, {name: "Create"})
        activationButton.addChild(newToDoBtn)

        const form = new OBC.Modal(this._components)
        this._components.ui.add(form)
        form.title = "Create New To Do"

        const descriptionInput = new OBC.TextArea(this._components)
        descriptionInput.label = "Description"
        form.slots.content.addChild(descriptionInput)

        form.slots.content.get().style.padding = "20px"
        form.slots.content.get().style.display = "flex"
        form.slots.content.get().style.flexDirection = "column"
        form.slots.content.get().style.rowGap = "20px"

        form.onAccept.add(() => {

        })

        form.onCancel.add(() => form.visible = false)

        newToDoBtn.onClick.add(() => form.visible = true)

        const toDoList = new OBC.FloatingWindow(this._components)
        this._components.ui.add(toDoList)
        toDoList.visible = false
        toDoList.title = "To Do List" 
        
        const toDoListBtn = new OBC.Button(this._components, {name: "List"})
        activationButton.addChild(toDoListBtn)
        toDoListBtn.onClick.add(() => toDoList.visible = !toDoList.visible)

        this.uiElement.set({activationButton, toDoList})
    }

    get(): null{

    }
}
