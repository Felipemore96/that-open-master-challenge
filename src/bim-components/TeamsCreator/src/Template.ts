import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
import { TeamsCreator } from "./TeamsCreator";
import { TeamRole } from "../../../class/teams";

export interface TeamUIState {
  components: OBC.Components;
}

export const teamTool = (state: TeamUIState) => {
  const { components } = state;
  const teamsCreator = components.get(TeamsCreator);

  const nameInput = document.createElement("bim-text-input");
  nameInput.label = "Name of the Company";
  const roleDropdown = BUI.Component.create<BUI.Dropdown>(() => {
    return BUI.html`
      <bim-dropdown label="Role">
        <bim-option label="BIM Manager"></bim-option>
        <bim-option label="Structural"></bim-option>
        <bim-option label="MEP"></bim-option>
        <bim-option label="Architect"></bim-option>
        <bim-option label="Contractor"></bim-option>
      </bim-dropdown>
    `;
  });
  const descriptionInput = document.createElement("bim-text-input");
  descriptionInput.label = "General description or the role";
  const contactInput = document.createElement("bim-text-input");
  contactInput.label = "Contact Name";
  const phoneInput = document.createElement("bim-text-input");
  phoneInput.label = "Phone Number";

  const newTeamModal = BUI.Component.create<HTMLDialogElement>(() => {
    return BUI.html`
      <dialog id="new-team-modal">
        <bim-panel
          <bim-panel-section label="New Team" fixed>
            ${nameInput}
            ${roleDropdown}
            ${contactInput}
            ${phoneInput}
            <bim-button
              label="Cancel"
              @click=${() => {
                newTeamModal.close();
              }}  
            ></bim-button>
            <bim-button
              label="Accept"
              @click=${() => {
                const teamValue = {
                  teamName: nameInput.value,
                  teamRole: roleDropdown.value[0] as TeamRole,
                  teamDescription: descriptionInput.value,
                  contactName: contactInput.value,
                  contactPhone: phoneInput.value,
                };
                teamsCreator.addTeam(teamValue);
                nameInput.value = "";
                descriptionInput.value = "";
                contactInput.value = "";
                phoneInput.value = "";
                newTeamModal.close();
              }}  
            ></bim-button>
          </bim-panel-section>  
        </bim-panel>
      </dialog>
    `;
  });

  document.body.appendChild(newTeamModal);

  const newTeamButton = BUI.Component.create<BUI.Button>(() => {
    return BUI.html`
    <bim-button
    @click=${() => newTeamModal.showModal()}
    icon="pajamas:todo-done"
    tooltip-tittle="Teams"
    ></bim-button>
    `;
  });

  teamsCreator.onDisposed.add(() => {
    newTeamModal.remove();
    console.log("TeamsCreator disposed");
  });

  return newTeamButton;
};
