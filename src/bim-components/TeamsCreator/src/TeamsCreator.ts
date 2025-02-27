import * as OBC from "@thatopen/components";

export class TeamsCreator extends OBC.Component {
  static uuid = "9c51ff2a-2a8a-4b1d-8253-43854876c041";
  enabled = true;

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(TeamsCreator.uuid, this);
  }

  addTeam() {
    console.log("Adding a new team!");
  }
}
