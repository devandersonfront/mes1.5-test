import React from "react";

interface Props {
    row:any
    column:any
}

const ProductTitleFomatter = ({row,column}:Props) => {
    return (
        <div style={{background:"black", width:"100%", height:"100%"}}>
            {row.title}
        </div>
    );
}

export default ProductTitleFomatter;
