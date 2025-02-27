import * as OBC from "@thatopen/components";

type QtoResult = { [setName: string]: { [qtoName: string]: number } };

export class SimpleQTO extends OBC.Component implements OBC.Disposable {
  static uuid = "7ec21568-e809-4392-a810-50b16b3777c4";
  enabled = true;
  onDisposed: OBC.Event<any>;

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(SimpleQTO.uuid, this);
  }

  async dispose() {}
}
