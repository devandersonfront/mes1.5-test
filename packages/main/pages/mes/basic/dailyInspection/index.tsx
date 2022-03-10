import React from 'react'
// import ExcelTable from '../../../../component/Excel/ExcelTable'
import MenuNavigation from '../../../../component/MenuNav/MenuNavigation'
import ProfileHeader from '../../../../component/Profile/ProfileHeader'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import {NextPageContext} from 'next'
import {BasicDailyInspectionInfo} from "basic";

interface IProps {
    machine_id?: number
    mold_id?: number
}


const BasicContainer = ({machine_id, mold_id}: IProps) => {

    return (
        <div style={{display: 'flex', }}>
            <MenuNavigation pageType={'BASIC'} subType={0}/>
            <div style={{paddingBottom: 40}}>
                <ProfileHeader/>
                <BasicDailyInspectionInfo machine_id={machine_id} mold_id={mold_id} />
            </div>
        </div>
    );
}

// export const getServerSideProps = (ctx: NextPageContext) => {
//     return {
//         props: {
//             page: ctx.query.page ?? 1,
//             keyword: ctx.query.keyword ?? "",
//             option: ctx.query.opt ?? 0,
//         }
//     }
// }

BasicContainer.getInitialProps = async ({ query }) => {
  let { machine_id, mold_id } = query
  if (typeof machine_id === 'string')
      machine_id = parseInt(machine_id);
      mold_id = parseInt(mold_id);
  return { machine_id, mold_id };
}

export default BasicContainer;
