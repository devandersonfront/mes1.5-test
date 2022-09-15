const addColumnClass= (column) => {

    let moveNum = 0;
    let addClass = false
    return column.map((data,index)=>{
        if(data.unprintable || data.key === "select-row"){
            addClass = true
            moveNum++
            return ({...data , headerCellClass : 'unprintable' , cellClass : 'unprintable'})
        }else if(addClass){
            return ({...data , headerCellClass : `move${index + 2 - moveNum}`, cellClass: `move${index + 2 - moveNum}`})
        }else{
            return data
        }
    })
}

export default addColumnClass
