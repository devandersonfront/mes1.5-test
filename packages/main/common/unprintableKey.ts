
const keyList = ['profile','photo','qualify'
    ,'capacity','guideline','device_id','form_id'
    ,'product_id','mold_id','tool_id','machine_id'
    ,'bom_root','work_standard_image','sic_id']

const addColumnClass= (column) => {

    let moveNum = 0;
    let addClass = false
    return column.map((data,index)=>{
        if(keyList.includes(data.key)){
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
