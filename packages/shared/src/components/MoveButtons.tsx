import React from "react";
import styled from "styled-components";

interface Props {
    row:any
    column: any
    onRowChange:(value:any) => void
}


const MoveButtons = ({row, column ,onRowChange }:Props) => {
    const sequenceKey = row?.seq ? "seq" : "sequence"
    const index = () => {
        if(typeof row?.id !== "number" && row?.id?.includes("addi")){
            return column.rows.indexOf(row)
        }else{
          return row[sequenceKey] - (row?.seq ? 1 : 0)
        }
    }
    const moveUp = () => {
        if(index() > (0)) {
          const newRows = [...column.rows]
          const tmp = {...newRows[index()], [sequenceKey]: row[sequenceKey] - 1}
          newRows[index()] = {...newRows[index() - 1], [sequenceKey]: row[sequenceKey]}
          newRows[index() - 1] = tmp
          column.setRows(newRows)
        }
    }

    const moveDown = () => {
      if(index() + 1 < column.rows?.length) {
        const newRows = [...column.rows]
        const tmp = {...newRows[index()], [sequenceKey]: row[sequenceKey] + 1}
        newRows[index()] = {...newRows[index() + 1], [sequenceKey]: row[sequenceKey]}
        newRows[index() + 1] = tmp
        column.setRows(newRows)
      }
    }

    return (
        <div className={'unprintable'} style={{height:"100%", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <Button onClick={()=>{
                moveUp();
            }}>위로</Button>
            <Button onClick={()=>{
                moveDown()
            }}>아래로</Button>
        </div>
    );
}

const Button = styled.button`
    width:80px;
    height:35px;
    background:#717C90;
    color:white;
    border:none;
    border-radius:8px;
`;

export {MoveButtons};
