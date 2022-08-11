import React from "react";
import styled from "styled-components";

interface Props {
    row:any
    column: any
    onRowChange:(value:any) => void
}


const MoveButtons = ({row, column ,onRowChange }:Props) => {
    const moveUp = () => {
        if(row.seq > 1) {
          const index = row.seq - 1
          const newRows = [...column.rows]
          const tmp = {...newRows[index], seq: row.seq - 1}
          newRows[index] = {...newRows[index - 1], seq: row.seq}
          newRows[index - 1] = tmp
          column.setRows(newRows)
        }
    }

    const moveDown = () => {
      if(row.seq < column.rows?.length) {
        const index = row.seq - 1
        const newRows = [...column.rows]
        const tmp = {...newRows[index], seq: row.seq + 1}
        newRows[index] = {...newRows[index + 1], seq: row.seq}
        newRows[index + 1] = tmp
        column.setRows(newRows)
      }
    }

    return (
        <div style={{height:"100%", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
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
