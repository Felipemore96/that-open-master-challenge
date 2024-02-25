import * as OBC from "openbim-components"

//Class for UI component for To Do cards
export class ToDoCard extends OBC.SimpleUIComponent {

  //Event to trigger what happens once the delete button was clicked
  onCardDeleteClick = new OBC.Event()

  //Event to trigger what happens once the card was clicked
  onCardClick = new OBC.Event()

  //Define types of slots to use
  slots: {
    actionButtons: OBC.SimpleUIComponent
  }
  
  //Description and Date properties definition from dynamic data, through setters
  set description(value: string) {
    const descriptionElement = this.getInnerElement("description") as HTMLParagraphElement
    descriptionElement.textContent = value
  }
  set date(value: Date) {
    const dateElement = this.getInnerElement("date") as HTMLParagraphElement
    dateElement.textContent = value.toDateString()
  }

  //constructor needs a HTML template to create the card with dynamic data through IDs
  constructor(components: OBC.Components) {
    const template = `
    <div class="todo-item">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; column-gap: 15px; align-items: center;">
          <span class="material-icons-round" style="padding: 10px; background-color: #686868; border-radius: 10px;">construction</span>
          <div>
            <p id="description">Make anything here as you want, even something longer.</p>
            <p id="date" style="text-wrap: nowrap; color: #a9a9a9; font-size: var(--font-sm)">Fri, 20 sep</p>
          </div>
        </div>
        <div data-tooeen-slot="actionButtons"></div>
      </div>
    </div>
    `
    super(components, template)

    //Get method to get the info of the card once it is clicked
    const cardElement = this.get()
    //Event to trigger the OnCardClick event
    cardElement.addEventListener("click", () => { 
      this.onCardClick.trigger()
    })

    //setSlot method to replace the slot placeholder with a delete button UI component
    this.setSlot("actionButtons", new OBC.SimpleUIComponent(this._components))
    const deleteBtn = new OBC.Button(this._components)
    deleteBtn.materialIcon = "delete"
    this.slots.actionButtons.addChild(deleteBtn)
    //Delete button logic
    deleteBtn.onClick.add(() => {
      this.onCardDeleteClick.trigger()
    })
  }
}