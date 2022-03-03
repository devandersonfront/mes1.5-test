import React, {useEffect, useState} from 'react'
import {
    columnlist,
    ExcelDownloadModal,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType,
    PaginationComponent, RequestMethod, RootState
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {NextPageContext} from 'next'
import moment from 'moment'
import {useSelector} from "react-redux";

interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const MesOperationModify = ({page, keyword, option}: IProps) => {
  const router = useRouter()

  const [excelOpen, setExcelOpen] = useState<boolean>(false)

  const [basicRow, setBasicRow] = useState<Array<any>>([])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["operationModifyV2"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const selector = useSelector((state:RootState) => state.modifyInfo);
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })


    const SaveBasic = async (result:any, selectList:Set<any>) => {
        let res: any

        res = await RequestMethod('post', `sheetSave`,
            result.map((row, i) => {
                if(selectList.has(row.id)){
                    let selectKey: string[] = []
                    let additional:any[] = []
                    column.map((v) => {
                        if(v.selectList){
                            selectKey.push(v.key)
                        }

                        if(v.type === 'additional'){
                            additional.push(v)
                        }
                    })

                    let selectData: any = {}

                    Object.keys(row).map(v => {
                        if(v.indexOf('PK') !== -1) {
                            selectData = {
                                ...selectData,
                                [v.split('PK')[0]]: row[v]
                            }
                        }

                        if(v === 'unitWeight') {
                            selectData = {
                                ...selectData,
                                unitWeight: Number(row['unitWeight'])
                            }
                        }

                        if(v === 'tmpId') {
                            selectData = {
                                ...selectData,
                                id: row['tmpId']
                            }
                        }
                    })
                    return {
                        ...row,
                        ...selectData,
                        status: result[0].status === '작업 중' ? 0 : 1,
                        additional: [
                            ...additional.map(v => {
                                if(row[v.name]) {
                                    return {
                                        id: v.id,
                                        title: v.name,
                                        value: row[v.name],
                                        unit: v.unit
                                    }
                                }
                            }).filter((v) => v)
                        ]
                    }

                }
            }).filter((v) => v))


        if(res){
            Notiflix.Report.success('저장되었습니다.','','확인', () => {
                router.push('/mes/operationV1u/list')
            });
        }
    }

    const onClickHeaderButton = async(index: number) => {
        switch(index){
            case 0:
                SaveBasic(basicRow, selectList)
                break;
            case 1:
                if(selectList.size > 0) {
                    Notiflix.Confirm.show("경고", "삭제하시겠습니까?", "확인", "취소",
                        () => {

                            Notiflix.Report.success("삭제되었습니다.", "", "확인", () => {
                                const resultBasic = [...basicRow];
                                resultBasic.forEach((row, index) => {
                                    if (selectList.has(row.id)) {
                                        basicRow.splice(index, 1)
                                    }
                                })
                                setBasicRow([...basicRow])
                            })
                        },
                    )
                }else{
                    Notiflix.Report.warning("경고","데이터를 선택해 주시기 바랍니다.","확인");
                }
                break;
        }
    }

    useEffect(() => {
        if(selector && selector.type && selector.modifyInfo){
            setBasicRow([
                ...selector.modifyInfo
            ])
        }else{
            router.push('/mes/operationV1u/list')
        }
    }, [selector])

  return (
    <div>
      <PageHeader
        title={"작업지시서 (수정)"}
        buttons={
          ['저장하기', '삭제']
        }
        buttonsOnclick={onClickHeaderButton}
      />
      <ExcelTable
        editable
        // resizable
        headerList={[
          SelectColumn,
          ...column
        ]}
        row={basicRow}
        // setRow={setBasicRow}
        setRow={(e) => {
          let tmp: Set<any> = selectList
          e.map(v => {
            if(v.isChange) tmp.add(v.id)
          })
          setSelectList(tmp)
          setBasicRow(e)
        }}
        selectList={selectList}
        //@ts-ignore
        setSelectList={setSelectList}
        height={basicRow.length * 40 >= 40*18+56 ? 40*19 : basicRow.length * 40 + 56}
      />
      <ExcelDownloadModal
        isOpen={excelOpen}
        column={column}
        basicRow={basicRow}
        filename={`금형기준정보`}
        sheetname={`금형기준정보`}
        selectList={selectList}
        tab={'ROLE_BASE_07'}
        setIsOpen={setExcelOpen}
      />
    </div>
  );
}

export const getServerSideProps = (ctx: NextPageContext) => {
  return {
    props: {
      page: ctx.query.page ?? 1,
      keyword: ctx.query.keyword ?? "",
      option: ctx.query.opt ?? 0,
    }
  }
}

export {MesOperationModify};
