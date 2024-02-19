import * as OBC from "openbim-components"

export class ToDoCard extends OBC.SimpleUIComponent {

    onCardClick = new OBC.Event()
    slots: {
      actionButtons: OBC.SimpleUIComponent
    }
    
    set description(value: string) {
        const descriptionElement = this.getInnerElement("description") as HTMLParagraphElement
        descriptionElement.textContent = value
    }

    set date(value: Date) {
        const dateElement = this.getInnerElement("date") as HTMLParagraphElement
        dateElement.textContent = value.toDateString()
    }

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
        const cardElement = this.get()
        cardElement.addEventListener("click", () => {
            this.onCardClick.trigger()
        })
        this.setSlot("actionButtons", new OBC.SimpleUIComponent(this._components))
        
        const deleteBtn = new OBC.Button(this._components)
        deleteBtn.materialIcon = "delete"
        this.slots.actionButtons.addChild(deleteBtn)
    }
}