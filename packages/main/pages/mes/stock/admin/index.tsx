import React from "react";
import MenuNavigation from "../../../../component/MenuNav/MenuNavigation";
//@ts-ignore
import {SelectColumn} from "react-data-grid";
//@ts-ignore
import Notiflix from "notiflix";
import {ScrollSync} from "react-scroll-sync";
import { MesStockProductList } from 'mes'

const Productlist = () => {
    return(
        <ScrollSync >
            <div style={{display:"flex"}}>
              <MenuNavigation pageType={'MES'} subType={3}/>
              <MesStockProductList type={'admin'}/>
            </div>
        </ScrollSync>
    );
}

export default Productlist;
