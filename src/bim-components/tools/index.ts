import * as OBC from "openbim-components"

export class ToDoCreator extends OBC.Component<null> implements OBC.UI {
    static uuid = "be178b9a-0ee1-4d3d-b83a-49d4c5f3e34b"
    enable = true
    uiElement = new OBC.UIElement<{
        activationButton: OBC.Button
        todoList: OBC.FloatingWindow
    }>()
    private _components: OBC.Components
    
    constructor(components: OBC.Components) {
        super(components)
        this._components = components
        components.tools.add(ToDoCreator.uuid, this)
    }

    private setUI() {
        
    }

    get(): null{

    }
}
