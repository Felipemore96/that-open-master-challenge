import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import * as THREE from "three";
import { Team } from "../../../class/teams";

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
  onTeamCreated = new OBC.Event<Team>();

  private _world: OBC.World;

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(TeamsCreator.uuid, this);
  }

  set world(world: OBC.World) {
    this._world = world;
  }

  addTeam(data: TeamModalData) {
    const fragments = this.components.get(OBC.FragmentsManager);
    const highlighter = this.components.get(OBCF.Highlighter);
    const guids = fragments.fragmentIdMapToGuids(highlighter.selection.select);

    const camera = this._world.camera;
    if (!camera.hasCameraControls()) {
      throw new Error("The world camera doesn't have camera controls");
    }

    const position = new THREE.Vector3();
    camera.controls.getPosition(position);
    const target = new THREE.Vector3();
    camera.controls.getTarget(target);

    const teamdata = {
      teamName: data.teamName,
      teamRole: data.teamRole,
      teamDescription: data.teamDescription,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      ifcGuids: guids,
      camera: { position, target },
    };

    this.onTeamCreated.trigger(teamdata);
  }
}
