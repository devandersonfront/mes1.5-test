import React, {useEffect, useState} from 'react'
import ExcelTable from '../../../../component/Excel/ExcelTable'
import MenuNavigation from '../../../../component/MenuNav/MenuNavigation'
import ProfileHeader from '../../../../component/Profile/ProfileHeader'
import PageHeader from '../../../../component/Header/Header'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import {IExcelHeaderType, IItemMenuType} from '../../../../common/@types/type'
import {RequestMethod} from '../../../../common/RequestFunctions'
import {columnlist} from "../../../../common/columnInit";
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {MAX_VALUE} from '../../../../common/configset'
import DropDownEditor from '../../../../component/Dropdown/ExcelBasicDropdown'
import TextEditor from '../../../../component/InputBox/ExcelBasicInputBox'
import {excelDownload} from '../../../../common/excelDownloadFunction'
import {loadAll} from 'react-cookies'
import { makeStyles, createStyles } from '@material-ui/core/styles';
import PaginationComponent from '../../../../component/Pagination/PaginationComponent'
import {NextPageContext} from 'next'
import ExcelDownloadModal from '../../../../component/Modal/ExcelDownloadMoadal'
import ExcelUploadModal from "../../../../component/Modal/ExcelUploadModal";
import {BasicProcess} from '../../../../../basic'

interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const title = '공정 종류 관리'
const optList = ['공정명']

const BasicContainer = ({page, keyword, option}: IProps) => {
  return (
    <div style={{display: 'flex', }}>
      <MenuNavigation pageType={'BASIC'} subType={2}/>
      <div style={{paddingBottom: 40}}>
        <ProfileHeader/>
        <BasicProcess keyword={keyword} page={page} option={option}/>
      </div>
    </div>
  );
}

export const getServerSideProps = (ctx: NextPageContext) => {
  return {
    props: {
      page: ctx.query.page,
      keyword: ctx.query.keyword ?? "",
      option: ctx.query.option ?? 0,
    }
  }
}

// BasicContainer.getInitialProps = async ({ query }) => {
//   let { page, keyword, opt } = query
//   if (typeof page === 'string')
//     page = parseInt(page);
//   if (typeof opt === 'string')
//     opt = parseInt(opt);
//   return { page, keyword, option: opt };
// }

export default BasicContainer;
