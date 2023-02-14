import React, {useEffect, useState} from 'react'
import {IExcelHeaderType} from '../../../@types/type'
import styled from 'styled-components'
import Modal from 'react-modal'
import {POINT_COLOR, SF_AI_ADDRESS} from '../../../common/configset'
//@ts-ignore
import IcSearchButton from '../../../../public/images/ic_search.png'
//@ts-ignore
import IcX from '../../../../public/images/ic_x.png'
import {ExcelTable} from '../../Excel/ExcelTable'
import {searchModalList} from '../../../common/modalInit'
//@ts-ignore
import Search_icon from '../../../../public/images/btn_search.png'
import {RequestMethod} from '../../../common/RequestFunctions'
import {SearchInit} from './SearchModalInit'
import {MoldRegisterModal} from '../MoldRegisterModal'
import Notiflix from 'notiflix'
import {SearchModalResult, SearchResultSort} from '../../../Functions/SearchResultSort'
import {Select} from '@material-ui/core'
import {CellButton, SearchIcon} from "../../../styles/styledComponents";
import {useDispatch, useSelector} from "react-redux";
import { RootState } from '../../../reducer'
import modifyInfo from '../../../reducer/modifyInfo'
//@ts-ignore
import ModalSearch_icon from '../../../../public/images/list_search_icon.png'
import moment from "moment";
import {AddlButton} from "../../Buttons/AddlButton";
import axios from "axios";
import cookie from "react-cookies";
import {transTypeProduct} from "../../../common/Util";
import {render} from "react-dom";
import {LineBorderContainer} from "../../Formatter/LineBorderContainer";

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const SearchModalTest = ({column, row, onRowChange}: IProps) => {

  const userInfo = cookie.load('userInfo')
  const tokenData = userInfo?.token;

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [selectRow, setSelectRow] = useState<{index:number, selectType:"ai" | "basic"}>()
  const [searchList, setSearchList] = useState<any[]>([])

  const [rankingList, setRankingList] = useState<any[]>([])

  const [forRankingData, setForRankingData] = useState<{mfr_code:string, product_id:number}>()

  const [tab, setTab] = useState<number>(0)
  const [searchModalInit, setSearchModalInit] = useState<any>()
  const [searchModalColumn, setSearchModalColumn] = useState<Array<IExcelHeaderType>>()
  const originalInfo = useSelector((state:RootState) => state.modifyInfo);
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })
  const [loadState, setLoadState] = useState<boolean>(false)


  useEffect(() => {
    if(column.type == "product" && column.theme == "aiModal"){
      setForRankingData({mfr_code:row.mfr_code, product_id:row.prediction_result})
    }
  },[])

  useEffect(() => {
    if(isOpen){
      if(searchModalInit.excelColumnType === "product") setOptionIndex(2)
      LoadBasic(pageInfo.page);
    }else{
      setPageInfo({page:1, total:1})
      setSearchList([{}])
    }
  }, [isOpen, searchModalInit, pageInfo.page])

  useEffect(() => {
    setSearchList([])
    if(column.type === "bom" ){
      switch(tab){
        case 0:{
          setSearchModalInit(SearchInit.rawMaterial)
          // setSearchModalColumn(searchModalList[`${searchModalInit.excelColumnType}Search`])
          setSearchModalColumn(
              [...searchModalList[`${SearchInit.rawMaterial.excelColumnType}Search`].map((column, index) => {
                if(index === 0) return ({...column, colSpan(args) {
                    if(args.row?.first){
                      return searchModalList[`${SearchInit.rawMaterial.excelColumnType}Search`].length
                    }else{
                      return undefined
                    }
                  }})
                else return ({...column})
              })])
          break;
        }
        case 1:{
          setSearchModalInit(SearchInit.subMaterial)
          // setSearchModalColumn(searchModalList[`${searchModalInit.excelColumnType}Search`])
          setSearchModalColumn(
              [...searchModalList[`${SearchInit.subMaterial.excelColumnType}Search`].map((column, index) => {
                if(index === 0) return ({...column, colSpan(args) {
                    if(args.row?.first){
                      return searchModalList[`${SearchInit.subMaterial.excelColumnType}Search`].length
                    }else{
                      return undefined
                    }
                  }})
                else return ({...column})
              })])
          break;
        }
        case 2:{
          setSearchModalInit(SearchInit.allProduct)
          setSearchModalColumn(
              [...searchModalList[`${SearchInit.allProduct.excelColumnType}Search`].map((column, index) => {
                if(index === 0) return ({...column, colSpan(args) {
                    if(args.row?.first){
                      return searchModalList[`${SearchInit.allProduct.excelColumnType}Search`].length
                    }else{
                      return undefined
                    }
                  }})
                else return ({...column})
              })])
          break;
        }
        case null: setSearchModalInit(SearchInit[column.type])
          setSearchModalColumn(
              [...searchModalList[`${SearchInit[column.type].excelColumnType}Search`].map((column, index) => {
                if(index === 0) return ({...column, colSpan(args) {
                    if(args.row?.first){
                      return searchModalList[`${SearchInit[column.type].excelColumnType}Search`].length
                    }else{
                      return undefined
                    }
                  }})
                else return ({...column})
              })])
          break;
      }
    }else if(column.type === "product"){
      setSearchList([{}])
      switch(tab) {
        case 0: {
          setSearchModalInit(SearchInit.finishedProduct)
          // setSearchModalColumn(searchModalList[`${searchModalInit.excelColumnType}Search`])
          setSearchModalColumn(
              [...searchModalList[`${SearchInit.finishedProduct.excelColumnType}Search`].map((column, index) => {
                if (index === 0) return ({
                  ...column, colSpan(args) {
                    if (args.row?.first) {
                      return searchModalList[`${SearchInit.finishedProduct.excelColumnType}Search`].length
                    } else {
                      return undefined
                    }
                  }
                })
                else return ({...column})
              })])
          break;
        }
        case 1: {
          setSearchModalInit(SearchInit.progressProduct)
          // setSearchModalColumn(searchModalList[`${searchModalInit.excelColumnType}Search`])
          setSearchModalColumn(
              [...searchModalList[`${SearchInit.progressProduct.excelColumnType}Search`].map((column, index) => {
                if (index === 0) return ({
                  ...column, colSpan(args) {
                    if (args.row?.first) {
                      return searchModalList[`${SearchInit.progressProduct.excelColumnType}Search`].length
                    } else {
                      return undefined
                    }
                  }
                })
                else return ({...column})
              })])
          break;
        }
        case 2: {
          setSearchModalInit(SearchInit.semiProduct)
          setSearchModalColumn(
              [...searchModalList[`${SearchInit.semiProduct.excelColumnType}Search`].map((column, index) => {
                if (index === 0) return ({
                  ...column, colSpan(args) {
                    if (args.row?.first) {
                      return searchModalList[`${SearchInit.semiProduct.excelColumnType}Search`].length
                    } else {
                      return undefined
                    }
                  }
                })
                else return ({...column})
              })])
          break;
        }
      }
    }else{
      setSearchModalInit(SearchInit[column.type])
      setSearchModalColumn(
          [...searchModalList[`${SearchInit[column.type].excelColumnType}Search`].map((col, index) => {
            if(index === 0) return ({...col, colSpan(args) {
                if(args.row?.first){
                  return searchModalList[`${SearchInit[column.type].excelColumnType}Search`].length
                }else{
                  return undefined
                }
              }})
            else return ({...col})
          })])
    }
    return (() => {
      setPageInfo({total:1, page:1})

    })
  }, [tab])


  const LoadBasic = async (page:number) => {
    setLoadState(false)
    Notiflix.Loading.circle();
    const selectType = () => {
      switch(column.type){
        case "customerModel":
          return {
            keyword:keyword,
            opt:optionIndex,
            customer_id: row.product?.customerId ?? null
          }
        case "allProduct":
          return {
            keyword:keyword,
            opt:optionIndex,
            outsourcing: 0
          }
        case "outsourceProduct":
          return {
            keyword:keyword,
            opt:optionIndex,
            outsourcing: 2
          }
        case "bom":
          return {
            keyword:keyword,
            opt:optionIndex,
            outsourcing: 0
          }
        case "toolProduct":
          return {}
        //현재 AI 작업일보리스트에서만 사용하여 productIds를 고정으로 박아놓음
        //다른곳에 사용할때 다시 수정할 것
        case "operation":
          return {
            from:"2000-01-01",
            // to: moment(new Date()).format("YYYY-MM-DD")
            to: "2023-12-31",
            productIds:row.product.product_id,
            status:[0,1]
          }
        case "product" :
          return {
            outsourcing: 0,
            types : tab === 0 ? '2,4' : tab === 1 ? '1' : '0,3',
            keyword:keyword,
            opt:optionIndex,
          }
        default:
          return {
            keyword:keyword,
            opt:optionIndex,
          }
      }
    }

    const searchToolInProduct = (row:any) => {
      switch(column.type){
        case "toolProduct":
          return {
            product_id:row.product_id
          }
        case "customerModel":
          return {
            page:  page || page !== 0 ? page : 1,
            renderItem: 22,
            customer_id: row.customer?.customer_id ?? null
          }
        default :
          return {
            page: page || page !== 0 ? page : 1,
            renderItem: 22,
          }
      }
    }

    if(column.type == "product" && column.theme == "aiModal"){
      const aiResult = await axios.get(`${SF_AI_ADDRESS}/api/product_sim_info/${forRankingData.mfr_code}/${forRankingData.product_id}`, {'headers': {'Authorization': tokenData},})

      const product_list = new Array(aiResult.data.length).fill({})
      aiResult.data.map(async(row1, index) => {
        const result = await RequestMethod("get", "aipProductLoad", {path:{id:row1?.product_id}}).then((res) => res)
        if(result){
          const obj:any = {...result}
          obj.customer_name = result?.customer?.name
          obj.model_name = result?.model?.model
          obj.code = result?.code
          obj.name = result?.name
          obj.type_name = transTypeProduct(result?.type)
          obj.type = result?.type
          obj.stock = result?.stock
          obj.rank = index+1
          product_list[index] = obj
        }
      })
      setRankingList(product_list)
    }

    const res = await RequestMethod('get', `${searchModalInit.excelColumnType}Search`,{
      path: searchToolInProduct(row)
      ,
      params: selectType()
    })
    if(res){
      if(searchModalInit.excelColumnType === "toolProduct"){
          const savedTools = originalInfo.modifyInfo?.length ? originalInfo.modifyInfo[0]?.tools?.map(tool => ({...tool.tool.tool})) : []
          const numOfSavedTools = savedTools.reduce((acc, cur) => {
            acc.set(cur.tool_id, (acc.get(cur.tool_id) || 0) + 1)
            return acc
          }, new Map())
          const numOftools = column.basicRow.reduce((acc, cur) => {
            const key = cur.tool?.tool_id
            acc.set(key, (acc.get(key) || 0) + 1)
            return acc
          }, new Map())
          const newRes = res.map(tool => {
            const numOfSavedTool = numOfSavedTools.get(tool.tool?.tool_id) ?? 0
            const numOfTool = numOftools.get(tool.tool?.tool_id) ?? 0
            let fakeStock = tool.tool?.stock + numOfSavedTool - numOfTool
            fakeStock = row.tool?.tool_id && row.tool?.tool_id === tool.tool?.tool_id ? fakeStock + 1 : fakeStock
            return { ...tool, stock: fakeStock, originalStock: tool.tool?.stock, record_tool_id: row.record_tool_id, record_tool_version: row.record_tool_version }
          })
          setSearchList(SearchResultSort(newRes, searchModalInit.excelColumnType))
      }else{
        if(res.page !== 1){
          setSearchList([ ...searchList,...SearchResultSort( res.info_list, searchModalInit.excelColumnType)])
          setPageInfo({page:res.page, total:res.totalPages});
        }else{
          setTimeout(() => {
            setSearchList([...SearchResultSort(!column.noSelect ? [{id:null, noneSelected: true}, ...res.info_list] : res.info_list, searchModalInit.excelColumnType)])
          },500)
          setPageInfo({page:res.page, total:res.totalPages});
        }
      }
    }


    setLoadState(true)
    Notiflix.Loading.remove()
  }


  const getContents = () => {
    if(column.theme === "aiModal" && column.key == "identification" && (!row?.operationRecord?.operation_sheet.os_id )){
      return (
          <CellButton onClick={async() => {
            await RequestMethod("post", "operationSave", [row.operationRecord.operation_sheet])
                .then(async(res) => {
                  Notiflix.Loading.standard()
                  setTimeout(() => {
                    LoadBasic(1).then(() => {
                      Notiflix.Loading.remove()
                      row.reload()
                    })
                  },1000)
                })
                .catch((err) => {
                  console.log(err)
                })

          }}>생성</CellButton>
      )
    }else if(row[`${column.key}`]){
      if( typeof row[`${column.key}`] === "string"){
        return row[column.key];
      }else{
        return row[column.key].name;
      }
    }else{
      if(searchModalInit && searchModalInit.placeholder){
        return searchModalInit.placeholder
      }else{
        return column.placeholder
      }
    }
  }


  const addSearchButton = () => {
    return <SearchIcon
        className={'img_wrapper unprintable'}
        onClick={() => {
      setIsOpen(true)
    }} modalType={column.modalType}>
      <img style={column.modalType ? {width: 16.3, height: 16.3} : {width: 30, height: 30}} src={ModalSearch_icon}/>
    </SearchIcon>
  }

  const selectDataType = (selectRow:{index:number, selectType:"ai" | "basic"}) => {
    const {index, selectType} = selectRow
    switch (selectType) {
      case "ai":
        return rankingList[index]
      case "basic":
      default:
        return searchList[index]
    }
  }

  const ContentHeader = () => {
    return <div id={'content-header'} style={{
      marginTop: 24,
      marginLeft: 16,
      marginRight: 16,
      marginBottom: 12,
      display: 'flex',
      justifyContent: 'space-between'
    }}>
      <div id={'content-title'} style={{display: 'flex'}}>
        <p style={{
          color: 'black',
          fontSize: 22,
          fontWeight: 'bold',
          margin: 0,
        }}>{searchModalInit && searchModalInit.title}</p>
        {
          column.type === 'bom' && <div style={{marginLeft: 20}}>
              <Select value={tab ?? 0} onChange={(e) => {
                // setPageInfo({...pageInfo,page:1})
                setOptionIndex(0)
                setSelectRow(null)
                setKeyword('')
                setTab(Number(e.target.value))
              }}>
                <option key={'0'} value={0}>원자재</option>
                <option key={'1'} value={1}>부자재</option>
                <option key={'2'} value={2}>제품</option>
              </Select>
            </div>
        }
        {
          column.type === 'product' && <div style={{marginLeft: 20}}>
              <Select value={tab ?? 0} onChange={(e) => {
                setTab(Number(e.target.value))
                setOptionIndex(0)
                setKeyword('')
                setPageInfo({page:1, total:1})
              }}>
                <option key={'0'} value={0}>완제품</option>
                <option key={'1'} value={1}>재공품</option>
                <option key={'2'} value={2}>반제품</option>
              </Select>
            </div>
        }
      </div>
      <div id={'content-close-button'} style={{display: 'flex'}}>
        {
          column.type === 'mold' && <MoldRegisterModal column={column} row={row} onRowChange={onRowChange} register={() => {
            LoadBasic(1)
          }}/>
        }
        <div className={'img_wrapper unprintable'} style={{cursor: 'pointer', marginLeft: 22}} onClick={() => {
          setIsOpen(false)
        }}>
          <img style={{width: 20, height: 20}} src={IcX}/>
        </div>
      </div>
    </div>
  }

  const switchSearchOption = (option : number) => {
    if(column.key === 'customer_id'){
      switch(option){
        case 3:
          return 7
        default :
          return option
      }
    }
    return option
  }

  const getDefaultSearchOptionIndex = (index:number) => {
    if(['product','allProduct','outsourceProduct'].includes(column.type) && index === 0){
      return 2
    }else if(['product','allProduct','outsourceProduct'].includes(column.type) && index === 2){
      return 0
    }else{
      return index
    }
  }

  const SearchBox = () => {

    return <div style={{
      height: 32, margin: '16px 0 16px 16px',
      display: 'flex',
    }}>
      <div style={{
        width: 120, display: 'flex', justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#F4F6FA', border: '0.5px solid #B3B3B3',
        borderRight: 'none',
      }}>
        <select key={searchModalInit?.searchFilter[0]}
                defaultValue={searchModalInit?.searchFilter[getDefaultSearchOptionIndex(0)]}
                onChange={(e) => {
                  const option = switchSearchOption(Number(e.target.value))
                  setOptionIndex(option)
                  setPageInfo({total:1, page:1});
                  // SearchBasic('', Number(e.target.value))
                }}
                style={{
                  color: 'black',
                  backgroundColor: '#00000000',
                  border: 0,
                  height: 32,
                  width: 120,
                  fontSize:15,
                  fontWeight: 'bold'
                }}
        >

          {
            searchModalInit && searchModalInit.searchFilter.map((v, i) => {
              if(v !== ""){
                return (<option key={i.toString()} value={getDefaultSearchOptionIndex(i)}>{v}</option>)
              }
            })
          }
        </select>
      </div>
      <input
        value={keyword ?? ""}
        type={"text"}
        placeholder="검색어를 입력해주세요."
        onChange={(e) => {
          setKeyword(e.target.value)
          // setPageInfo({total:1, page:1});
        }}
        onKeyDown={(e) => {
          if(e.key === 'Enter'){
            LoadBasic(1);
          }
        }}
        style={{
          width:1592,
          height:"32px",
          paddingLeft:"10px",
          border:"0.5px solid #B3B3B3",
          backgroundColor: 'rgba(0,0,0,0)'
        }}
      />
      <div
        className={'img_wrapper unprintable'}
        style={{background:"#19B9DF", width:"32px",height:"32px",display:"flex",justifyContent:"center",alignItems:"center", cursor: 'pointer'}}
        onClick={() => {
          LoadBasic(1);
        }}
      >
        <img src={Search_icon} style={{width:"16px",height:"16px"}} />
      </div>
    </div>
  }


  const confirmFunction = (e) => {
    if(selectRow == null){
      Notiflix.Report.warning("데이터를 선택해주세요.","", "확인")
      return
    }
    setIsOpen(false)
    if(selectRow !== undefined){
      const selectNameFunction = (type:string) => {
        switch(type){
          case "bom":
          case "rawMaterial" :
            return SearchModalResult(selectDataType(selectRow), searchModalInit.excelColumnType, null, column.modalType).name;
          case "machine" :
          case "mold":
          case "operation":
            return selectDataType(selectRow).name;
          default:
            return row.name;
        }
      }
      if(column.clearContract) {
        onRowChange(
          {
            ...row,
            ...SearchModalResult(selectDataType(selectRow), searchModalInit.excelColumnType, column.staticCalendar, column.modalType),
            manager: SearchModalResult(selectDataType(selectRow), searchModalInit.excelColumnType, null, column.modalType).manager,
            name: selectNameFunction(column.type),
            tab: tab,
            date: row.date,
            version: row.version,
            isChange: true,
            contract: null,
            contract_id: null
          }
        )
      }else if(column.type === "toolProduct"){
        const res = SearchModalResult(selectDataType(selectRow), searchModalInit.excelColumnType, column.staticCalendar, column.modalType)
        delete res.doubleClick
        onRowChange(res)
      }else if(column.type === 'customer'){
        onRowChange(
          {
            ...row,
            ...SearchModalResult(selectDataType(selectRow), searchModalInit.excelColumnType, column.staticCalendar, column.modalType),
            manager: SearchModalResult(selectDataType(selectRow), searchModalInit.excelColumnType, null, column.modalType).manager,
            name: selectNameFunction(column.type),
            tab: tab,
            // type_name: undefined,
            version: row.version,
            isChange: true,
            cm_id : '',
            modelArray : {
              additional: [],
              cm_id: '',
              customer: null,
              customerId: '',
              model: '',
              sync: '',
              version: null
            }
          }
        )
      }else if(column.type === 'factory'){
        onRowChange({
          ...row,
          ...SearchModalResult(selectDataType(selectRow), searchModalInit.excelColumnType, column.staticCalendar, column.modalType),
          name: selectNameFunction(column.type),
          tab: tab,
          // type_name: undefined,
          version: row.version,
          isChange: true,
          cm_id : '',
          modelArray : {
            additional: [],
            cm_id: '',
            customer: null,
            customerId: '',
            model: '',
            sync: '',
            version: null
          }
        })
      }else if(column.type === 'tool'){
        onRowChange(
          {
            ...row,
            ...SearchModalResult(selectDataType(selectRow), column.toolType === 'register' ? 'toolRegister' : searchModalInit.excelColumnType, column.staticCalendar, column.modalType),
            manager: SearchModalResult(selectDataType(selectRow), searchModalInit.excelColumnType, null, column.modalType).manager,
            // name: selectNameFunction(column.type),
            tab: tab,
            // type_name: undefined,
            version: row.version,
            isChange: true,
          }
        )
      }else if(column.type === "bom"){
        const checkChanged = (selected) => {
          switch (tab) {
            case 0:
              return selected.raw_material?.rm_id !== row.raw_material?.rm_id
            case 1:
              return selected.sub_material?.sm_id !== row.sub_material?.sm_id
            case 2:
              return selected.product?.product_id !== row.product?.product_id
            default:
              return false
          }
        }
        const searchModalResult = SearchModalResult(selectDataType(selectRow), searchModalInit.excelColumnType, column.staticCalendar, column.modalType)
        delete searchModalResult.doubleClick
        if(checkChanged(searchModalResult))
        {
          onRowChange(
            {
              ...row,
              ...searchModalResult,
              name: selectNameFunction(column.type),
              tab: tab === null ? 0 : tab,
              version: row.version,
              isChange: true,
              //일상 점검 모달에서 작성자 확인 / 관리자 확인 구분 용도
              returnType:column.key
            }
          )
        }
      }else if(column.type === "operation"){
        const modalRes = SearchModalResult(selectDataType(selectRow), searchModalInit.excelColumnType, column.staticCalendar, column.modalType, column.type)
        onRowChange({
          ...row,
          ...modalRes,
          // identification:selectNameFunction(column.type),
          manager: modalRes.manager,
          // name: selectNameFunction(column.type),
          id:row.id,
          tab: tab,
          // type_name: undefined,
          version: row.version,
          isChange: true,
          //일상 점검 모달에서 작성자 확인 / 관리자 확인 구분 용도
          returnType:column.key,
          date:row?.date,
          deadline:row?.deadline,
          goal:row?.goal,
        })
      }else if(column.type === "product" && column.theme == "aiModal"){
        const modalRes = SearchModalResult(selectDataType(selectRow), searchModalInit.excelColumnType, column.staticCalendar, column.modalType, column.type)
        onRowChange({
          ...row,
          ...modalRes,
          manager: modalRes.manager,
          // name: selectNameFunction(column.type),
          id:row.id,
          tab: tab,
          // type_name: undefined,
          version: row.version,
          isChange: true,
          //일상 점검 모달에서 작성자 확인 / 관리자 확인 구분 용도
          returnType:column.key,
          date:row?.date,
          deadline:row?.deadline,
          goal:row?.goal
        })
      }else{
        const modalRes = SearchModalResult(selectDataType(selectRow), searchModalInit.excelColumnType, column.staticCalendar, column.modalType, column.type)
        onRowChange({
          ...row,
          ...modalRes,
          manager: modalRes.manager,
          name: selectNameFunction(column.type),
          id:row.id,
          tab: tab,
          // type_name: undefined,
          version: row.version,
          isChange: true,
          //일상 점검 모달에서 작성자 확인 / 관리자 확인 구분 용도
          returnType:column.key,
          date:row?.date,
          deadline:row?.deadline,
          goal:row?.goal
        })
      }
    }
  }

  return (
    <SearchModalWrapper>
        <div style={{width: column.modalType ? 'calc(100% - 32px)' : 'calc(100% - 40px)', height: column.modalType ? 32 : 40,
          paddingLeft:8, opacity: row[`${column.key}`] ? 1 : .3,  background: row.border ? '#19B9DF80' : row?.warning ? "red" : undefined}
        } onClick={() => {
          if(!(column.theme === "aiModal" && (!row?.operationRecord?.operation_sheet.os_id))){
            setIsOpen(true)
          }
        }}>
          {getContents()}
        </div>
      {!(column.theme === "aiModal" && (!row?.operationRecord?.operation_sheet.os_id)) &&
        addSearchButton()
      }
      <Modal isOpen={isOpen} style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          padding: 0,
        },
        overlay: {
          background: 'rgba(0,0,0,.6)',
          zIndex: 5,
        }
      }}>
        <div style={{
          width: 1776,
          height: 816,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div id={'content-root'}>
            {
              ContentHeader()
            }
            {column.type !== "toolProduct" &&
              SearchBox()
            }
            {
            (column.type == "product" && column.theme == "aiModal") &&
              <div style={{marginBottom:10}}>
                <ExcelTable
                    type={'searchModal'}
                    headerList={searchModalInit && [{ key: "rank", name: "순위", width: 80, formatter:LineBorderContainer }, ...searchModalColumn]}
                    row={rankingList}
                    onRowClick={(clicked) => {
                      const e = rankingList.indexOf(clicked)
                      const update = rankingList.map(
                          (row, index) => index === e
                              ? {
                                ...row,
                                doubleClick: confirmFunction,
                                border: true,
                              }
                              : {
                                ...row,
                                border: false
                              }
                      );
                      setRankingList(update)
                      setSelectRow({index:e, selectType:"ai"})
                    }}
                    width={1744}
                    height={160}
                />
              </div>
            }
            <ExcelTable
              resizable
              headerList={ searchModalInit && searchModalColumn}
              row={searchList ?? []}
              width={1744}
              rowHeight={32}
              height={(column.type == "product" && column.theme == "aiModal") ? 480 : 640}
              onRowClick={(clicked) => {
                const e = searchList.indexOf(clicked)
                const update = searchList.map(
                  (row, index) => index === e
                    ? {
                      ...row,
                      doubleClick: confirmFunction,
                      border: true,
                    }
                    : {
                      ...row,
                      border: false
                    }
                );
                setSearchList(update)
                setSelectRow({index:e, selectType:"basic"})
              }}
              type={'searchModal'}
              scrollEnd={(value) => {
                if(value && loadState){
                  if(pageInfo.total > pageInfo.page){
                    setPageInfo({...pageInfo, page:pageInfo.page+1})
                  }
                }
              }}
            />
          </div>
          <div style={{ height: 40, display: 'flex', alignItems: 'flex-end'}}>
            <FooterButton
              onClick={() => {
                setIsOpen(false)
                setSelectRow(undefined)
                setOptionIndex(0)
                setKeyword('')
              }}
              style={{backgroundColor: '#E7E9EB'}}
            >
              <p style={{color: '#717C90'}}>취소</p>
            </FooterButton>
            <FooterButton
              onClick={confirmFunction}
              style={{backgroundColor: POINT_COLOR}}
            >
              <p style={{color: '#0D0D0D'}}>등록하기</p>
            </FooterButton>
          </div>
        </div>
      </Modal>
    </SearchModalWrapper>
  )

}

const SearchModalWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items:center;
`

const FooterButton = styled.div`
  width: 50%; 
  height: 40px;
  display: flex; 
  justify-content: center;
  align-items: center;
  p {
    font-size: 14px;
    font-weight: bold;
  }
`

const HeaderButton = styled.button`
    height:32px;
    color:white;
    border-radius:6px;
    font-size:15px;
    font-weight:bold;
    background:#717C90;
    padding: 0 20px;
    cursor: pointer;
    display:flex;
    margin-left: 16px;
    justify-content:center;
    align-items:center;
`;


export {SearchModalTest}
