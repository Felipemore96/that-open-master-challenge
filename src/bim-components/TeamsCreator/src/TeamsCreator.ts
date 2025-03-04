import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import * as THREE from "three";
import { ITeam, TeamModalData } from "../../../class/teams";

export class TeamsCreator extends OBC.Component implements OBC.Disposable {
  static uuid = "9c51ff2a-2a8a-4b1d-8253-43854876c041";
  enabled = true;
  onTeamCreated = new OBC.Event<ITeam>();
  onDisposed: OBC.Event<any> = new OBC.Event();

  private _world: OBC.World;

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(TeamsCreator.uuid, this);
  }

  async dispose() {
    this.enabled = false;
    this.onDisposed.trigger;
  }

  set world(world: OBC.World) {
    this._world = world;
  }

  addTeam(data: TeamModalData) {
    // if (!this.enabled) return;

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
      ifcGuids: JSON.stringify(guids),
      camera: JSON.stringify({ position, target }),
      teamProjectId: "",
    };

    this.onTeamCreated.trigger(teamdata);
  }

  async highlightTeam(team: ITeam) {
    // if (!this.enabled) return;

    const fixesGuids = JSON.parse(team.ifcGuids);
    const fixedCamera = JSON.parse(team.camera);
    const fragments = this.components.get(OBC.FragmentsManager);
    const fragmentIdMap = fragments.guidToFragmentIdMap(fixesGuids);
    const highlighter = this.components.get(OBCF.Highlighter);
    highlighter.highlightByID("select", fragmentIdMap, true, false);

    if (!this._world) {
      throw new Error("No world found");
    }

    const camera = this._world.camera as OBC.OrthoPerspectiveCamera;
    if (!camera.hasCameraControls()) {
      throw new Error("The world camera doesn't have camera controls");
    }

    await camera.controls.setLookAt(
      fixedCamera.position.x,
      fixedCamera.position.y,
      fixedCamera.position.z,
      fixedCamera.target.x,
      fixedCamera.target.y,
      fixedCamera.target.z,
      true
    );
  }
}
