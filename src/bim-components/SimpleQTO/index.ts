import * as OBC from "@thatopen/components";
import * as FRAGS from "@thatopen/fragments";
import * as WEBIFC from "web-ifc";

type QtoResult = { [setName: string]: { [qtoName: string]: number } };

export class SimpleQTO extends OBC.Component implements OBC.Disposable {
  static uuid = "7ec21568-e809-4392-a810-50b16b3777c4";
  enabled = true;
  onDisposed: OBC.Event<any>;
  private _qtoResult: QtoResult = {};

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(SimpleQTO.uuid, this);
  }

  resetQuantities() {
    this._qtoResult = {};
  }

  async sumQuantities(fragmentIdMap: FRAGS.FragmentIdMap) {
    const fragmentManager = this.components.get(OBC.FragmentsManager);
    const modelIdMap = fragmentManager.getModelIdMap(fragmentIdMap);
    for (const modelId in modelIdMap) {
      const model = fragmentManager.groups.get(modelId);
      if (!model) continue;
      if (!model.hasProperties) return;

      for (const fragmentID in fragmentIdMap) {
        const expressIDs = fragmentIdMap[fragmentID];
        const indexer = this.components.get(OBC.IfcRelationsIndexer);
        for (const id of expressIDs) {
          const sets = indexer.getEntityRelations(model, id, "IsDefinedBy");
          if (!sets) continue;
          for (const expressID of sets) {
            const set = await model.getProperties(expressID);
            const { name: setName } =
              await OBC.IfcPropertiesUtils.getEntityName(model, expressID);
            if (set?.type !== WEBIFC.IFCELEMENTQUANTITY || !setName) continue;
            if (!(setName in this._qtoResult)) {
              this._qtoResult[setName] = {};
            }
            await OBC.IfcPropertiesUtils.getQsetQuantities(
              model,
              expressID,
              async (qtoID) => {
                const { name: qtoName } =
                  await OBC.IfcPropertiesUtils.getEntityName(model, qtoID);
                const { value } = await OBC.IfcPropertiesUtils.getQuantityValue(
                  model,
                  qtoID
                );
                if (!qtoName || !value) return;
                if (!(qtoName in this._qtoResult[setName])) {
                  this._qtoResult[setName][qtoName] = 0;
                }
                this._qtoResult[setName][qtoName] += value;
              }
            );
          }
        }
      }
    }
    console.log(this._qtoResult);
  }

  async dispose() {
    this.resetQuantities();
  }
}
