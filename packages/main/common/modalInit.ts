import TextEditor from '../component/InputBox/ExcelBasicInputBox'
import UnitContainer from '../component/Unit/UnitContainer'
import AddlButtom from '../component/ButtonComponent/AddlButtom'
import DatetimePickerBox from '../component/CalendarBox/DatetimePickerBox'
import NumberingBox from "../component/Formatter/NumberingBox";

export const searchModalList: any = {
  member: [
    {key: 'user_id', name: '담당자명'},
  ],
  product: [
    {key: 'customer', name: '고객사명'},
    {key: 'model', name: '모델'},
    {key: 'code', name: 'code'},
    {key: 'name', name: '품명'},
    {key: 'texture', name: '재질'},
  ],
  customer: [
    {key: 'customer_id', name: '고객사명'},
    {key: 'rep', name: '대표자명'},
    {key: 'manager', name: '담당자명'},
    // {key: 'telephone', name: '전화번호'},
    // {key: 'cellphone', name: '휴대폰번호'},
    // {key: 'address', name: '팩스 번호'},
    {key: 'address', name: '주소'},
    {key: 'crn', name: '사업자 번호'},
  ],
  process: [
    {key: 'name', name: '공정명'},
  ],
  model: [
    {key: 'customer', name: '고객사명'},
    {key: 'model', name: '모델명'},
  ],
  machine: [
    {key: 'name', name: '기계명'},
    {key: 'manufacturer', name: '제조사'},
  ],
  select_machine: [
    {key: 'index', name: '순번', width:80},
    {key: 'name', name: '기계명'},
    {key: 'manufacturer', name: '제조사'},
  ],
  lot: [
    {key: 'number', width: 118, name: 'Lot번호'},
    {key: 'customer_id', width: 152, name: '고객사명'},
    {key: 'cm_id', width: 152, name: '모델'},
    {key: 'code', width: 176, name: 'code'},
    {key: 'name', width: 176, name: '품명'},
    {key: 'texture', width: 160, name: '재질'},
    {key: 'current', width: 118, name: '재고량'},
    {key: 'date', name: '입고일'},
  ],
  operation: [
    {key: 'osd_id', name: '지시 고유 번호'},
    {key: 'date', name: '지시 날짜'},
    {key: 'customer_id', name: '고객사명'},
    {key: 'cm_id', name: '모델'},
    {key: 'code', name: 'code'},
    {key: 'name', name: '품명'},
  ],
  stockSummary: [
    {key: 'name', name:"제목"},
    {key: 'from', name:"시작 날짜"},
    {key: 'to', name:"마지막 날짜"},
  ],
  poor: [
    {key: 'reason', name: '불량 사유'},
    {key: 'amount', width: 194, name: '불량 개수', editor: TextEditor, formatter: UnitContainer, unitData: 'EA', textType: 'Modal'},
  ],
  poorDisable: [
    {key: 'reason', name: '불량 사유'},
    {key: 'amount', width: 194, name: '불량 개수', formatter: UnitContainer, unitData: 'EA', textType: 'Modal'},
  ],
  pause: [
    {key: 'reason', name: '일시 정지 유형'},
    {key: 'start', width: 150, name: '시작', formatter: DatetimePickerBox, theme: 'white'},
    {key: 'end', width: 150, name: '끝', formatter: DatetimePickerBox, theme: 'white'},
    {key: 'add', width: 100, name: '', formatter: AddlButtom},
  ],
  pauseExist: [
    {key: 'reason', name: '일시 정지 유형'},
    {key: 'amount', width: 194, name: '일시 정지 시간(단위: 분)', editor: TextEditor, textType: 'Modal', searchType: 'pause'},
  ],
  pauseDisable: [
    {key: 'reason', name: '일시 정지 유형'},
    {key: 'start', width: 170, name: '시작'},
    {key: 'end', width: 170, name: '끝'},
  ],
  pauseDisableExist: [
    {key: 'reason', name: '일시 정지 유형'},
    {key: 'paused_time', width: 194, name: '일시 정지 시간', textType: 'Modal', searchType: 'pause'},
  ],
  defect: [
    {key: 'name', name: '공정명'},
    {key: 'reason', name: '불량 유형'},
  ],
  productprocess: [
    {key: 'seq', name: '공정 순서'},
    {key: 'process_id', name: '공정명'},
    {key: 'mold_name', name: '금형명'},
    {key: 'wip_name', name: '반제품명'},
  ]
}

