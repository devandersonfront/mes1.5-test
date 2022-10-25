export const barcodeNumberOfType = (type : 'rawMaterial' | 'product' | 'record') => {

    switch(type){
        case 'rawMaterial' :
            return '1'
        case 'product' :
            return '2'
        case 'record':
            return '3'
        default :
            return undefined
    }
}

export type BarcodeDataType = {
    material_id: number,
    material_type: number,
    material_quantity : number,
    material_name: string,
    material_code: string,
    material_customer: string,
    material_model: string,
    material_lot_number: string | undefined
    material_lot_id : number | undefined
    material_machine_name : string | undefined
    material_size : string | undefined
    material_texture: string | undefined
    material_unit : string | undefined

}