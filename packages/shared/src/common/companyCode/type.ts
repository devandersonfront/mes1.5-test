export type BarcodeSettingType = {
    rm_tab : boolean,
    rm_materialType : number,
    rm_drawBitMap : number,
    pm_tab : boolean,
    pm_materialType : number,
    pm_drawBitMap : number,
    ri_tab : boolean,
    ri_drawBitMap : number,
    ri_materialType : number,
    ri_materialSize : string
    op_tab : boolean,
    op_materialType : number,
    op_drawBitMap : number,
    op_material_bom_lot ?: string
    companyCode : string
    rm_safetyStock : boolean
}