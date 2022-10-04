import React  from 'react'
import CellExpanderFormatter from "./CellExpanderFormatter";
import StockDetailGrid from "../Grid/StockDetailGrid";

const DetailFormatter = ({row , onRowChange}) => {
    const detailLayout = () => {
        if (row?.rowType === 'DETAIL') {
            return (
                <StockDetailGrid data={row.detail}
                />
            )
        }
        return (
            <CellExpanderFormatter
                expanded={row?.expanded}
                onCellExpand={async () => {
                    onRowChange({ ...row, expanded: !row.expanded, detail: !row.expanded ? await row.getDetail(row) : undefined});
                }}
            />
        );
    }

    return detailLayout()
}

export {DetailFormatter}