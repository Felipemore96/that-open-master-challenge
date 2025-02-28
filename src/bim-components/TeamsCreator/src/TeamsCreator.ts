import * as OBC from "@thatopen/components";

const roles = ["BIM Manager", "Structural", "MEP", "Architect", "Contractor"];

export interface TeamModalData {
  teamName: string;
  teamRole: typeof roles;
  teamDescription: string;
  contactName: string;
  contactPhone: string;
}

export class TeamsCreator extends OBC.Component {
  static uuid = "9c51ff2a-2a8a-4b1d-8253-43854876c041";
  enabled = true;

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(TeamsCreator.uuid, this);
  }

  addTeam(data: TeamModalData) {
    console.log(data);
  }
}
