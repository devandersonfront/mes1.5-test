import React from "react";
import styled from "styled-components";
import {POINT_COLOR} from "../../common/configset";
//@ts-ignore
import DROPDOWN_IMG from "../../../../shared/public/images/filter_open_b.png";


const Container = styled.div<any>(() => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F4F6FA',
    borderRadius: 6,
    width: 328,
    height: 32,
    padding: '8px 0px 8px 16px',
    position : 'relative'
}))

const Button = styled.div(() => ({
    width: 32,
    height: 32,
    backgroundColor: POINT_COLOR,
    borderRadius: 6,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor : 'pointer'

}))


const ItemContainer = styled.ul<any>(()=>({
    position : 'absolute',
    backgroundColor: '#F4F6FA',
    listStyle: 'none',
    top: 16,
    right: 0,
    width: '100%',
    borderRadius: 6,
    paddingLeft: 0,

}))

interface IOptions {
    name : string,
    type : '폴더' | '파일'
    createdAt : string
    id : string,
}

interface Props{
    options:any[]
    value:any
    onChange:(value:any) => void
}

const DropdownModal = ({options, value, onChange}:Props) => {

    const [ isOpen , setIsOpen ] = React.useState<boolean>(false)
    const [ selectFolder , setSelectFolder ] = React.useState<IOptions>();
    const [ folderList , setFolderList ] = React.useState<IOptions[]>();

    return (
        <Container onClick={() => setIsOpen(!isOpen)}>
            <DropDownInput id={selectFolder?.id}>
                {value.name ?? '폴더를 선택해주세요'}
            </DropDownInput>
            <Button>
                <img src={DROPDOWN_IMG} alt={'dropdownImage'}/>
            </Button>
            {
                isOpen &&
                <ItemContainer>
                    {
                        options.map((folder,index)=> {
                            const name = folder.names.length > 0 ? folder.names.join(' / ') : folder.name
                            return <Item
                                onClick={() => onChange(folder)}>{name}</Item>
                        })
                    }
                </ItemContainer>
            }
        </Container>
    )
}



const Item = styled.li`

  border-radius: 6px;
  width: 100%;
  height: 35px;
  padding: 8px 0px 8px 16px;
  
  &:hover {
    background : #19B9DF;
    opacity : .5;
  }

`

const DropDownInput = styled.div`

  border : none;
  background : inherit;
  font-size : 15px;
  

`
export default DropdownModal
