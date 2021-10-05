import React from 'react'
import {IExcelHeaderType} from '../@types/type'
import DataGrid from 'react-data-grid'

// interface IProps {
//   row: any
//   column: IExcelHeaderType
//   onRowChange: (row: any) => void
// }

const TestModule = () => {
  return (
    <DataGrid rowGetter={() => {}} rowsCount={3}></DataGrid>
  );
}

export {TestModule}
