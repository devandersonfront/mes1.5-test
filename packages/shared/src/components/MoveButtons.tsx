import React from "react";
import styled from "styled-components";

interface Props {
    row:any

    onRowChange:(value:any) => void

}


const MoveButtons = ({row, onRowChange}:Props) => {
    const moveUp = () => {
        // row.index += 1
        // if(row.lengthIndex > 1){
            onRowChange({
                ...row,
                lengthIndex:row.index-2
            })
        // }
    }

    const moveDown = () => {
        // row.index += 1
        onRowChange({
            ...row,
            lengthIndex:row.index+2
        })
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
