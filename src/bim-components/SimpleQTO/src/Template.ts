import * as BUI from "@thatopen/ui";
import * as OBC from "@thatopen/components";
import { SimpleQTO } from "./SimpleQTO";

export interface QTOUIState {
  components: OBC.Components;
}

export const qtoTool = (state: QTOUIState) => {
  const { components } = state;
  const simpleQto = components.get(SimpleQTO);

  const qtoTable = BUI.Component.create<BUI.Table>(() => {
    return BUI.html`
          <bim-table></bim-table>
      `;
  });

  qtoTable.dataTransform = {
    Value: (value: string | number | boolean) => {
      if (typeof value === "number") {
        return value.toFixed(2);
      }
      return value;
    },
  };

  simpleQto.table = qtoTable;

  // simpleQto.onDisposed.add(() => {
  //   qtoTable.data = [];
  //   qtoTable.remove();
  // });

  return qtoTable;
};
