import {ProductListType} from "../common/@types/type";


const initialState:ProductListType ={
        total_length:0,
        selectRow:null,
        products: []
    }
;

const INSERT_PRODUCTLIST = `INSERT_PRODUCTLIST`;
const INSERT_SELECT_PRODUCTLIST = "INSERT_SELECT_PRODUCTLIST";
const INSERT_SELECT_PRODUCTDATA = "INSERT_SELECT_PRODUCTDATA";
const DELETE_PRODUCTLIST = `DELETE_PRODUCTLIST`;

export const insert_productList = (payload:any[]) => {
    return{
        type:INSERT_PRODUCTLIST,
        payload:payload
    }
}

export const insert_select_productList = (payload:number) => {
    return {
        type:INSERT_SELECT_PRODUCTLIST,
        payload:payload
    }
}

export const insert_select_productData = (payload:any) => {
    return {
        type: INSERT_SELECT_PRODUCTDATA,
        payload:payload
    }
}
type DefaultAction = ReturnType<typeof insert_productList> | ReturnType<typeof insert_select_productList> | ReturnType<typeof insert_select_productData>;

const ProductSelectReducer = (state = initialState, {type,payload}:DefaultAction) => {
    switch (type) {
        case INSERT_PRODUCTLIST :
            let tmp_state = {...state};
            let tmp_payload = [...payload as any[]];
            tmp_state.products = tmp_payload;
            tmp_state.total_length = tmp_payload.length;

            return tmp_state

        case INSERT_SELECT_PRODUCTLIST :
            let temp_state = {...state};
            temp_state.selectRow = payload as number;
            return temp_state

        case INSERT_SELECT_PRODUCTDATA:
            let temp_state2 = {...state};
            let temp_payload2 = payload as any;
            // if(temp_state2.total_length > temp_state2.products.length){
                temp_state2.products[temp_state2.selectRow] = temp_payload2;
            // }
            return temp_state2

        case DELETE_PRODUCTLIST:
            return state

        default :
            return state
    }
}

export default ProductSelectReducer;
