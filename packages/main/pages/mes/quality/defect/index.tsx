import React, {useEffect, useState} from "react";
import styled from "styled-components";
import MenuNavigation from "../../../../component/MenuNav/MenuNavigation";
import ProfileHeader from "../../../../component/Profile/ProfileHeader";
import {RequestMethod} from "../../../../common/RequestFunctions";
import PageHeader from "../../../../component/Header/Header";
import ExcelTable from "../../../../component/Excel/ExcelTable";
import ButtonGroup from "../../../../component/ButtonGroup";

import {IExcelHeaderType} from "../../../../common/@types/type";
//@ts-ignore
import {SelectColumn} from "react-data-grid";
import {columnlist} from "../../../../common/columnInit";
//@ts-ignore
import Notiflix from "notiflix";
import moment from 'moment'
import {excelDownload} from '../../../../common/excelDownloadFunction'
import PeriodSelectCalendar from '../../../../component/Header/PeriodSelectCalendar'
import {useRouter} from 'next/router'
import {MesQualityDefect} from '../../../../../mes'




const RegisterBasicContainer = () => {


  return (
    <div style={{display:"flex"}}>
      <MenuNavigation pageType={'MES'} subType={2}/>
      <div>
        <ProfileHeader/>
        <MesQualityDefect/>
      </div>
    </div>
  )
}

export default RegisterBasicContainer;
