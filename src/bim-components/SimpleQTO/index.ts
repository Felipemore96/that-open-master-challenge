import * as OBC from "@thatopen/components";
import * as FRAGS from "@thatopen/fragments";
import * as WEBIFC from "web-ifc";

type QtoResult = { [setName: string]: { [qtoName: string]: number } };

export class SimpleQTO extends OBC.Component implements OBC.Disposable {
  static uuid = "7ec21568-e809-4392-a810-50b16b3777c4";
  enabled = true;
  onDisposed: OBC.Event<any>;

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(SimpleQTO.uuid, this);
  }

  async sumQuantities(fragmentIdMap: FRAGS.FragmentIdMap) {
    const fragmentManager = this.components.get(OBC.FragmentsManager);
    const modelIdMap = fragmentManager.getModelIdMap(fragmentIdMap);
    for (const modelId in modelIdMap) {
      const model = fragmentManager.groups.get(modelId);
      if (!model) continue;
      if (!model.hasProperties) return;

      await OBC.IfcPropertiesUtils.getRelationMap(
        model,
        WEBIFC.IFCRELDEFINESBYPROPERTIES,
        async (setID, relatedIDs) => {
          const set = await model.getProperties(setID);
          if (set?.type !== WEBIFC.IFCELEMENTQUANTITY) return;
        }
      );
    }
  }

  async dispose() {}
}
