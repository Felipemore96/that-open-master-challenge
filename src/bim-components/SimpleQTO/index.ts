import * as OBC from "openbim-components"
import * as WEBIFC from "web-ifc"
import { FragmentsGroup } from 'bim-fragment';

export class SimpleQTO extends OBC.Component<null> implements OBC.UI, OBC.Disposable {
    static uuid = "7ec21568-e809-4392-a810-50b16b3777c4"
    enabled = true
    private _components: OBC.Components
    uiElement = new OBC.UIElement<{
        activationBtn: OBC.Button
        qtoList: OBC.FloatingWindow
    }>()

    constructor(components: OBC.Components) {
        super(components)
        this._components = components
        this.setUI()
    }

    async setup() {
        const highlighter = await this._components.tools.get(OBC.FragmentHighlighter)
        highlighter.events.select.onHighlight.add((fragmentIdMap) => {
            this.sumQuantities(fragmentIdMap)
        })
    }

    private setUI() {
        const activationBtn = new OBC.Button(this._components)
        activationBtn.materialIcon = "functions"

        const qtoList = new OBC.FloatingWindow(this._components)
        qtoList.title = "Quantification"
        this._components.ui.add(qtoList)
        qtoList.visible = false

        activationBtn.onClick.add(() => {
            activationBtn.active = !activationBtn.active
            qtoList.visible = activationBtn.active
        })

        this.uiElement.set({activationBtn, qtoList})
    }

    async sumQuantities(fragmentIdMap: OBC.FragmentIdMap) {
        const fragmentManager = await this._components.tools.get(OBC.FragmentManager)
        for (const fragmentID in fragmentIdMap) {
            const fragment = fragmentManager.list[fragmentID]
            const model = fragment.mesh.parent
            if (!(model instanceof FragmentsGroup && model.properties)) { continue }
            const properties = model.properties
            OBC.IfcPropertiesUtils.getRelationMap(
                properties,
                WEBIFC.IFCRELDEFINESBYPROPERTIES,
                (setID, relatedIDs) => {
                    const set = properties[setID]
                    const expressIDs = fragmentIdMap[fragmentID]
                    const workingIDs = relatedIDs.filter(id => expressIDs.has(id.toString()))
                    if (set.type !== WEBIFC.IFCELEMENTQUANTITY || workingIDs.length === 0) { return }
                    OBC.IfcPropertiesUtils.getQsetQuantities(
                        properties,
                        setID,
                        (qtoID) => {
                            console.log(qtoID)
                        }
                    )
                }
            )
        }
    }

    async dispose() {
        this.uiElement.dispose()
    }

    get(): null {
        return null
    }
}