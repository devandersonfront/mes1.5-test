import React from "react";
import CellExpanderFormatter from "./CellExpanderFormatter";
import StockDetailGrid from "../Grid/StockDetailGrid";

const DetailFormatter = ({row , onRowChange}) => {

    const detailLayout = () => {
        if (row?.detailType === 'DETAIL') {
            return (
                <StockDetailGrid
                    product={row.product}
                />
            )
        }
        return (
            <CellExpanderFormatter
                expanded={row?.expanded}
                onCellExpand={() => {
                    onRowChange({ ...row, expanded: !row.expanded });
                }}
            />
        );
    }

    return detailLayout()
}

export default DetailFormatter