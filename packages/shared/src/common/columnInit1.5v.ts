import {TextEditor} from '../components/InputBox/ExcelBasicInputBox'
import { SearchModalTest } from '../components/Modal/SearchModalTest';
import {UnitContainer} from '../components/Unit/UnitContainer'
import {DropDownEditor} from '../components/Dropdown/ExcelBasicDropdown'





export const V_columnlist: any = {

    rawmaterial: [
        {key: 'code', name: '원자재 CODE', editor: TextEditor},
        {key: 'name', name: '원자재 품명', editor: TextEditor},
        {key: 'texture', name: '재질', editor: TextEditor,},
        {key: 'depth', name: '두께', editor: TextEditor, formatter: UnitContainer, type:"number", unitData: 'T'},
        {key: 'width', name: '가로(COIL 폭)', editor: TextEditor, formatter: UnitContainer, type:"number", unitData: 'mm'},
        {key: 'height', name: '세로(Feeder)', editor: TextEditor, formatter: UnitContainer, type:"number", unitData: 'mm'},
        {key: 'type', name: '재질 종류', formatter: DropDownEditor, selectList: [
                {pk: 1, name: 'COIL'},
                {pk: 2, name: 'SHEET'}
            ]},
        {key: 'stock', name: '원자재 재고량', formatter: UnitContainer, unitData: 'kg', searchType: 'rawin'},
        {key: 'customer_id', name: '거래처', formatter: SearchModalTest, type: 'customer' },
        {key: 'expiration', name: '사용기준일', editor: TextEditor, formatter: UnitContainer, unitData: '일', placeholder: '기준일 입력',type:"number",},
    ],
}
