import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
import { TeamsCreator } from "./TeamsCreator";
import { Team } from "../../../class/teams";

export interface TeamUIState {
  components: OBC.Components;
}

export const teamTool = (state: TeamUIState) => {
  const { components } = state;
  const teamsCreator = components.get(TeamsCreator);

  const nameInput = document.createElement("bim-text-input");
  nameInput.label = "Name of the Company";
  const roleDropdown = document.createElement("bim-dropdown");
  roleDropdown.label = "Role";
  const roles = ["BIM Manager", "Structural", "MEP", "Architect", "Contractor"];
  roles.forEach((role) => {
    const option = document.createElement("bim-option");
    option.label = role;
    roleDropdown.appendChild(option);
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
        <bim-panel>
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
                  teamRole: roleDropdown.value,
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

  return BUI.Component.create<BUI.Button>(() => {
    return BUI.html`
    <bim-button
        @click=${() => newTeamModal.showModal()}
        icon="pajamas:todo-done"
        tooltip-tittle="Teams"
    ></bim-button>
    `;
  });
};
