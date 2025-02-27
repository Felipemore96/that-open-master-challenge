import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
import { TeamsCreator } from "./TeamsCreator";

export interface TeamUIState {
  components: OBC.Components;
}

export const teamTool = (state: TeamUIState) => {
  const { components } = state;
  const teamsCreator = components.get(TeamsCreator);

  return BUI.Component.create<BUI.Button>(() => {
    return BUI.html`
    <bim-button
        @click=${() => teamsCreator.addTeam()}
        icon="pajamas:todo-done"
        tooltip-tittle="Teams"
    ></bim-button>
    `;
  });
};
