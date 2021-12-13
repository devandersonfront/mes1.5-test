import TextEditor from '../component/InputBox/ExcelBasicInputBox'
import DropDownEditor from '../component/Dropdown/ExcelBasicDropdown'
import CalendarBox from '../component/CalendarBox/CalendarBox'
import CellButton from '../component/ButtonComponent/CellButtom'
import UnitContainer from '../component/Unit/UnitContainer'
import MoveButtons from "../component/MoveButtons";
import SearchModal from '../component/Modal/SearchModal'
import FileEditer from '../component/FileUpload/ExcelBasicFileUpload'
import ProductTitleFomatter from "../component/Formatter/ProductTitleFomatter";
import MemberSearchModal from '../component/Modal/MemeberSearchModal'
import ProductSearchModal from '../component/Modal/ProductSearchModal'
import CustomerSearchModal from '../component/Modal/CustomerSearchModal'
import ModelSearchModal from '../component/Modal/ModelSearchModal'
import MachineSearchModal from '../component/Modal/MachineSearchModal'
import RawMaterialSearchModal from '../component/Modal/RawMaterialSearchModal'
import OperationSearchModal from '../component/Modal/OperationSearchModal'
import PoorQuantityModal from '../component/Modal/PoorQuantityModal'
import DatetimePickerBox from '../component/CalendarBox/DatetimePickerBox'
import ProcessSearchModal from '../component/Modal/ProcessSearchModal'
import DefectSearchModal from '../component/Modal/DefectSearchModal'
import ProcessSeqModal from '../component/Modal/ProcessSeqModal'
import HeaderFilter from "../component/HeaderFilter/HeaderFilter";
import PauseModal from '../component/Modal/PauseModal'
import AuthoritySearchModal from '../component/Modal/AuthoritySearchModal'
import RecordDetailFormatter from '../component/Formatter/RecordDetailFormatter'
import OperationMachineSearchModal from "../component/Modal/OperationMachineSearchModal";
// @ts-ignore
import StatusComponent from '../component/Formatter/StatusComponent'
import MultipleSelectModal from "../component/Modal/MultipleSelectModal";
import {PlaceholderBox} from 'shared/src/components/Formatter/PlaceholderBox'
import {SearchModalTest} from 'shared/src/components/Modal/SearchModalTest'



export const columnlist: any = {
  member: [
    {key: 'name', editor: TextEditor},
    {key: 'appointment', editor: TextEditor},
    {key: 'telephone', editor: TextEditor},
    {key: 'email', editor: TextEditor},
    {key: 'authority', formatter: AuthoritySearchModal},
    // {key: 'authority', formatter: DropDownEditor, selectList: []},
    {key: 'tmpId', editor: TextEditor},
    {key: 'password', editor: TextEditor},
    {key: 'profile', formatter: FileEditer},
  ],
  customer: [
    {key: 'name', editor: TextEditor},
    {key: 'rep', editor: TextEditor},
    {key: 'manager', editor: TextEditor},
    {key: 'telephone', editor: TextEditor},
    {key: 'cellphone', editor: TextEditor},
    {key: 'fax', editor: TextEditor},
    {key: 'address', editor: TextEditor},
    {key: 'crn', editor: TextEditor},
    {key: 'photo', formatter: FileEditer},
  ],
  model: [
    {key: 'customer', formatter: CustomerSearchModal, searchType: 'model'},
    {key: 'crn'},
    {key: 'model', editor: TextEditor},
  ],
  process: [
    {key: 'name', editor: TextEditor},
  ],
  machine:[
    {key: 'name', editor: TextEditor},
    {key: 'type', formatter: DropDownEditor, selectList: [
        {pk: 0, name: "선택없음"},
        {pk: 1, name: "프레스"},
        {pk: 2, name: "로봇"},
        {pk: 3, name: "용접기"},
        {pk: 4, name: "밀링"},
        {pk: 5, name: "선반"},
        {pk: 6, name: "탭핑기"},
      ]},
    {key: 'madeAt', editor: CalendarBox},
    {key: 'mfrCode', editor: TextEditor},
    {key: 'user_id', formatter: MemberSearchModal},
    {key: 'manufacturer', editor: TextEditor},
    {key: 'photo', formatter: FileEditer},
    {key: 'qualify', formatter: FileEditer},
    {key: 'capacity', formatter: FileEditer},
    {key: 'guideline', formatter: FileEditer},
    {key: 'interwork', formatter: DropDownEditor, selectList: [
        {pk: 'true', name: '유'},
        {pk: 'false', name: '무'}
      ]},
    {key: 'tons', editor: TextEditor, formatter: UnitContainer, unitData: 'T'},
    {key: 'volt', editor: TextEditor, formatter: UnitContainer, unitData: 'V'},
  ],
  product: [
    {key: 'customer_id', formatter: CustomerSearchModal, searchType: 'product'},
    {key: 'cm_id', formatter: ModelSearchModal, searchType: 'product'},
    {key: 'code', editor: TextEditor},
    {key: 'name', editor: TextEditor},
    {key: 'texture', editor: TextEditor},
    {key: 'depth', editor: TextEditor, formatter: UnitContainer, unitData: 'mm', toFix: 2},
    {key: 'width', editor: TextEditor, formatter: UnitContainer, unitData: 'mm'},
    {key: 'height', editor: TextEditor, formatter: UnitContainer, unitData: 'mm'},
    {key: 'type', formatter: DropDownEditor, selectList: [
        {pk: 'COIL', name: 'COIL'},
        {pk: 'SHEET', name: 'SHEET'}
      ]},
    {key: 'unitWeight', editor: TextEditor, formatter: UnitContainer, unitData: 'kg', searchType: 'rawin'},
    {key: 'pp_id', formatter: CellButton, },
  ],
  rawmaterial: [
    {key: 'customer_id',},
    {key: 'cm_id', },
    {key: 'code', },
    {key: 'name', },
    {key: 'texture',},
    {key: 'depth', formatter: UnitContainer, unitData: 'T'},
    {key: 'width', formatter: UnitContainer, unitData: 'mm'},
    {key: 'height', formatter: UnitContainer, unitData: 'mm'},
    {key: 'type', },
  ],
  mold: [
    {key: 'customer_id', },
    {key: 'cm_id', },
    {key: 'code', },
    {key: 'name', },
    {key: 'seq', },
    {key: 'process_id', },
    {key: 'mold_name'},
    {key: 'cavity', },
    {key: 'spm', editor: TextEditor},
    {key: 'slideHeight', editor: TextEditor},
    {key: 'limit', editor: TextEditor},
    {key: 'inspect', editor: TextEditor},
    {key: 'current', editor: TextEditor},

  ],
  productprocess: [
    {key: 'customer', name: '고객사명', width:118},
    {key: 'model', name: '모델', width:118},
    {key: 'code', name: 'CODE', width:118},
    {key: 'name', name: '품명', width:118},
    {key: 'texture', name: '재질', width:118},
    {key: 'seq', name: '공정 순서', width:118},
    {key: 'process_id', name: '공정 종류', width:118, formatter: ProcessSearchModal}, //ProcessSearchModal로 변경
    {key: 'mold_name', name: '금형명', width:118, editor: TextEditor},
    {key: 'cavity', name: '캐비티', width:118, editor: TextEditor, formatter: UnitContainer, unitData: 'EA'},
    {key: 'last', name: '최종 공정 체크', formatter:DropDownEditor ,selectList: [
        {pk: false, name: '-'},
        {pk: true, name: '최종 공정'},
      ], width:118},
    {key: 'wip_name', name: '반제품명', width:118, editor: TextEditor},
  ],
  additionalItem:[
    {key: 'title', editor: TextEditor, name: "추가 항목명", width: 1290},
    {key: 'moddable', formatter: DropDownEditor, selectList: [
        {moddable_id: '0', name: "필요"},
        {moddable_id: '1', name: "불필요"}
      ], name: "단위 필요 유무"},
    {key: 'unit', formatter: DropDownEditor, selectList: [
        {unit_id: '0', name: "개별관리"},
        {unit_id: '1', name: "통일"},
        {unit_id: '2', name: "없음"},
      ], name: "단위 관리"},
  ],
  rawin: [
    {key: 'customer_id', frozen: true},
    {key: 'cm_id', searchType: 'rawin', frozen: true},
    {key: 'code', formatter: ProductSearchModal, searchType: 'rawin', frozen: true},
    {key: 'name', frozen: true},
    {key: 'texture',},
    {key: 'depth', formatter: UnitContainer, unitData: 'T'},
    {key: 'width', formatter: UnitContainer, unitData: 'mm'},
    {key: 'height', formatter: UnitContainer, unitData: 'mm'},
    {key: 'type', },
    {key: 'amount', editor: TextEditor,formatter: UnitContainer, unitData: 'kg', searchType: 'rawin'},
    {key: 'date', editor: CalendarBox},
    {key: 'number', editor: TextEditor},
    {key: 'current', },
  ],

  rawstock: [
    {key: 'customer_id', frozen: true},
    {key: 'cm_id', frozen: true},
    {key: 'code', frozen: true},
    {key: 'name', frozen: true},
    {key: 'texture'},
    {key: 'depth', formatter: UnitContainer, unitData: 'T'},
    {key: 'width', formatter: UnitContainer, unitData: 'mm'},
    {key: 'height', formatter: UnitContainer, unitData: 'mm'},
    {key: 'type', },
    {key: 'amount',formatter: UnitContainer, unitData: 'kg', searchType: 'rawin'},
    {key: 'date', },
    {key: 'number'},
    {key: 'blanking',formatter: UnitContainer, unitData: 'EA'},
    {key: 'current', formatter: UnitContainer, unitData: 'kg', searchType: 'rawin',},
    {key: 'exhaustion', formatter: DropDownEditor, headerRenderer: HeaderFilter,
      options:[{status:0, name:"재고 현황"},{status:1, name:"사용 가능"}],
      selectList: [
        {pk: false, name: '-'},
        {pk: true, name: '사용완료'}
      ]},
  ],

  baseItem: [
    {key: 'title', editor: TextEditor, name: "기본 항목명"},
  ],
  pause: [
    {key: 'name'}
  ],
  pauseReason: [
    {key: 'index', name:"순번", width:130},
    {key: 'reason', name:"일시정지 유형", width:1200, editor: TextEditor},
    {key: 'moveButtons', width:200, formatter:MoveButtons,},
  ],
  defectReason:[
    {key: 'index', name:"순번", width:130},
    {key: 'reason', name:"불량 유형", width:1200, editor: TextEditor},
    {key: 'moveButtons', width:200, formatter:MoveButtons,},
  ],
  stock:[
    {key:'customer_id'},
    {key:'customer_name'},
    {key:'cm_id', },
    {key:'code',  },
    {key:'name',  },
    {key:'unused',  formatter: UnitContainer, unitData: 'kg'},
    {key:'wip', formatter: UnitContainer, unitData: 'EA'},
    {key:'current_stock', formatter: UnitContainer, unitData: 'EA'},
    {key:'expectation', formatter: UnitContainer, unitData: 'EA'},
    {key:'inverse_expectation', formatter: UnitContainer, unitData: 'EA'},
  ],
  stockProduct: [
    {key:'customer_id', name:"고객사명"},
    {key:'cm_id', name:"모델"},
    {key:'code', name:"CODE"},
    {key:'name', name:"품명"},
  ],
  stockDate: [
    {key:'title', name:"생산/납품" },
  ],
  operationRegister: [
    {key: 'date', editor: CalendarBox, name: '지시 날짜'},
    {key: 'customer_id',  name: '고객사명'},
    {key: 'cm_id', name: '모델'},
    {key: 'code', formatter: ProductSearchModal, searchType: 'operation', name: 'CODE'},
    {key: 'name', name: '품명'},
    {key: 'texture', name: '재질'},
    {key: 'seq', name: '공정 순서'},
    {key: 'process_id', name: '공정 종류'},
    {key: 'mold', name: '금형명'},
    {key: 'machine_id', name: '기계 선택',
      formatter: /*MachineSearchModal*/ OperationMachineSearchModal
      // formatter: MachineSearchModal
    },
    {key: 'goal', name: '목표 생산량', editor: TextEditor, formatter: UnitContainer, unitData: 'EA'},
    {key: 'ln_id', name: '원자재 Lot 번호', formatter: RawMaterialSearchModal, searchType: 'operation', disableType: 'record'},
  ],
  operationList: [
    {key: 'status', formatter: StatusComponent, headerRenderer: HeaderFilter,
      options:[{status:-1, name:"상태"}, {status:0, name:"시작 전"}, {status:1, name:"작업중"}, {status:2, name:"일시정지"}, {status:3, name:"작업종료"}, {status:4, name:"미완료"}]},
    {key: 'identification'},
    {key: 'date', editor: CalendarBox},
    {key: 'customer_id'},
    {key: 'cm_id'},
    {key: 'code'},
    {key: 'name'},
    {key: 'texture'},
    {key: 'seq'},
    {key: 'process_id'},
    {key: 'mold_id'},
    {key: 'machine_id', formatter: MachineSearchModal},
    {key: 'goal', editor: TextEditor},
    {key: 'ln_id', formatter: RawMaterialSearchModal, disableType: 'record'},
  ],
  recordRegister: [
    {key: 'osd_id', name: '지시 고유 번호', formatter: OperationSearchModal, width:118},
    {key: 'date', name: '지시 날짜', editor: CalendarBox, width:118, disableType: 'record'},
    {key: 'customer_id', name: '고객사명', width:200, disableType: 'record'},
    {key: 'cm_id', name: '모델', width:200, disableType: 'record'},
    {key: 'code', name: 'CODE', formatter: ProductSearchModal, width:118, disableType: 'record'},
    {key: 'name', name: '품명', width:118},
    {key: 'texture', name: '재질', width:118},
    {key: 'seq', name: '공정 순서', width:118, formatter: ProcessSeqModal, disableType: 'record'},
    {key: 'process_id', name: '공정 종류', width:118, disableType: 'record'},
    {key: 'mold_id', name: '금형명', width:118, disableType: 'record'},
    {key: 'machine_id', name: '기계 선택', width:118, formatter: MachineSearchModal, disableType: 'record'},
    {key: 'goal', name: '목표 생산량', width:118, editor: TextEditor, formatter: UnitContainer, unitData: 'EA', searchType: 'record'},
    {key: 'ln_id', name: '원자재 Lot 번호', width:118, formatter: RawMaterialSearchModal, disableType: 'record'},
    {key: 'good_quantity', name: '양품 수량', width:118, editor: TextEditor, formatter: UnitContainer, unitData: 'EA'},
    {key: 'poor_quantities', name: '불량 유형', width:118, formatter: PoorQuantityModal, unitData: 'EA'},
    {key: 'poor_quantity', name: '불량 수량', width:118, editor: TextEditor, formatter: UnitContainer, unitData: 'EA'},
    // {key: 'poor_quantity', name: '불량 수량', width:118, formatter: PoorQuantityModal, unitData: 'EA'},
    {key: 'start', name: '작업 시작 일시', width:250, formatter: DatetimePickerBox},
    {key: 'end', name: '작업 종료 일시', width:250, formatter: DatetimePickerBox},
    {key: 'paused_time', name: '일시 정지 시간', width:118, formatter:PauseModal},
    {key: 'user_id', name: '작업자', width:118, formatter: MemberSearchModal},
  ],
  workerRecordReigster: [
    {key: 'osd_id', name: '지시 고유 번호', formatter: OperationSearchModal, width:118},
    {key: 'date', name: '지시 날짜', editor: CalendarBox, width:118, disableType: 'record'},
    {key: 'customer_id', name: '고객사명', formatter: CustomerSearchModal, width:200, disableType: 'record'},
    {key: 'cm_id', name: '모델', formatter: ModelSearchModal, width:200, disableType: 'record'},
    {key: 'code', name: 'CODE', formatter: ProductSearchModal, width:118, disableType: 'record'},
    {key: 'name', name: '품명', width:118},
    {key: 'texture', name: '재질', width:118},
    {key: 'seq', name: '공정 순서', width:118, formatter: ProcessSeqModal, disableType: 'record'},
    {key: 'process_id', name: '공정 종류', width:118, disableType: 'record'},
    {key: 'mold_id', name: '금형명', width:118, disableType: 'record'},
    {key: 'machine_id', name: '기계 선택', width:118, formatter: MachineSearchModal, disableType: 'record'},
    {key: 'goal', name: '목표 생산량', width:118, editor: TextEditor, formatter: UnitContainer, unitData: 'EA', searchType: 'record'},
    {key: 'ln_id', name: '원자재 Lot 번호', width:118, formatter: RawMaterialSearchModal, disableType: 'record'},
    {key: 'good_quantity', name: '양품 수량', width:118, editor: TextEditor, formatter: UnitContainer, unitData: 'EA'},
    {key: 'poor_quantity', name: '불량 수량', width:118, editor: TextEditor, formatter: UnitContainer, unitData: 'EA'},
    {key: 'start', name: '작업 시작 일시', width:250, formatter: DatetimePickerBox},
    {key: 'end', name: '작업 종료 일시', width:250, formatter: DatetimePickerBox},
    {key: 'paused_time', name: '일시 정지 시간', width:118, formatter:PauseModal},
    {key: 'user_id', name: '작업자', width:118, formatter: MemberSearchModal},
  ],
  recordList: [
    {key: 'identification', name: '지시 고유 번호', width:118},
    {key: 'date', name: '지시 날짜', width:118},
    {key: 'customer_id', name: '고객사명', width:118},
    {key: 'cm_id', name: '모델', width:118},
    {key: 'code', name: 'CODE', width:118},
    {key: 'name', name: '품명', width:118},
    {key: 'texture', name: '재질', width:118},
    {key: 'seq', name: '공정 순서', width:118},
    {key: 'process_id', name: '공정 종류', width:118},
    {key: 'mold_id', name: '금형명', width:118},
    {key: 'machine_id', name: '기계 선택', width:118},
    {key: 'goal', name: '목표 생산량', width:118, formatter: UnitContainer, unitData: 'EA'},
    {key: 'ln_id', name: '원자재 lot번호', width:118, formatter: RawMaterialSearchModal},
    {key: 'good_quantity', name: '양품 수량', width:118, editor: TextEditor, formatter: UnitContainer, unitData: 'EA'},
    {key: 'poor_quantity', name: '불량 수량', width:118, editor: TextEditor, formatter: UnitContainer, unitData: 'EA'},
    {key: 'poor_quantities', name: '불량 유형', width:118, formatter: PoorQuantityModal, unitData: 'EA', searchType: 'list'},
    // {key: 'poor_quantity', name: '불량 수량', width:118, formatter: PoorQuantityModal, unitData: 'EA', searchType: 'list'},
    {key: 'achievement', width:118, formatter: UnitContainer, unitData: '%'},
    {key: 'start', name: '작업 시작 일시', width:250, formatter: DatetimePickerBox},
    {key: 'end', name: '작업 종료 일시', width:250, formatter: DatetimePickerBox},
    {key: 'paused_time', name: '일시 정지 시간', width:118, formatter:PauseModal, searchType: 'list'},
    {key: 'uph', name: 'UPH', width:118, formatter: UnitContainer, unitData: 'EA'},
    {key: 'worker', name: '작업자', width:118, formatter:MemberSearchModal, searchType: 'list'},
  ],
  workerRecordList: [
    {key: 'identification', name: '지시 고유 번호', width:118},
    {key: 'date', name: '지시 날짜', width:118},
    {key: 'customer_id', name: '고객사명', width:118},
    {key: 'cm_id', name: '모델', width:118},
    {key: 'code', name: 'CODE', width:118},
    {key: 'name', name: '품명', width:118},
    {key: 'texture', name: '재질', width:118},
    {key: 'seq', name: '공정 순서', width:118},
    {key: 'process_id', name: '공정 종류', width:118},
    {key: 'mold_id', name: '금형명', width:118},
    {key: 'machine_id', name: '기계 선택', width:118},
    {key: 'goal', name: '목표 생산량', width:118, formatter: UnitContainer, unitData: 'EA'},
    {key: 'ln_id', name: '원자재 lot번호', width:118, formatter: RawMaterialSearchModal},
    {key: 'good_quantity', name: '양품 수량', width:118, editor: TextEditor, formatter: UnitContainer, unitData: 'EA'},
    {key: 'poor_quantity', name: '불량 수량', width:118, editor: TextEditor, formatter: UnitContainer, unitData: 'EA'},
    // {key: 'poor_quantities', name: '불량 유형', width:118, formatter: PoorQuantityModal, unitData: 'EA', searchType: 'list'},
    // {key: 'poor_quantity', name: '불량 수량', width:118, formatter: PoorQuantityModal, unitData: 'EA', searchType: 'list'},
    {key: 'achievement', width:118, formatter: UnitContainer, unitData: '%'},
    {key: 'start', name: '작업 시작 일시', width:250, formatter: DatetimePickerBox},
    {key: 'end', name: '작업 종료 일시', width:250, formatter: DatetimePickerBox},
    {key: 'paused_time', name: '일시 정지 시간', width:118, formatter:PauseModal, searchType: 'list'},
    {key: 'uph', name: 'UPH', width:118, formatter: UnitContainer, unitData: 'EA'},
    {key: 'worker', name: '작업자', width:118, formatter:MemberSearchModal, searchType: 'list'},
  ],
  recordSumList: [
    {key: 'identification', name: '지시 고유 번호', width:118},
    {key: 'latest_date', name: '지시 날짜', width:118},
    {key: 'customer_id', name: '고객사명', width:118},
    {key: 'cm_id', name: '모델', width:118},
    {key: 'code', name: 'CODE', width:118},
    {key: 'name', name: '품명', width:118},
    {key: 'texture', name: '재질', width:118},
    {key: 'used_sequences', name: '공정 순서', width:118},
    {key: 'used_processes', name: '공정 종류', width:118},
    {key: 'used_molds', name: '금형명', width:118},
    {key: 'used_machines', name: '기계 선택', width:118},
    {key: 'avg_goal', name: '목표 생산량', width:118, formatter: UnitContainer, unitData: 'EA'},
    {key: 'used_lot_numbers', name: '원자재 lot번호', width:118},
    {key: 'avg_good_quantity', name: '양품 수량', width:118, formatter: UnitContainer, unitData: 'EA'},
    {key: 'avg_poor_quantity', name: '불량 수량', width:118, formatter: UnitContainer, unitData: 'EA'},
    {key: 'avg_confirm_quantities', name: '불량 유형', width:118, formatter: UnitContainer, unitData: 'EA'},
    // {key: 'poor_quantity', name: '불량 수량', width:118, formatter: PoorQuantityModal, unitData: 'EA', searchType: 'list'},
    {key: 'avg_achievement', name: '목표 달성률', width:118, formatter: UnitContainer, unitData: '%'},
    {key: 'oldest_start', name: '작업 시작 일시', width:250,},
    {key: 'latest_end', name: '작업 종료 일시', width:250, },
    {key: 'avg_paused_time', name: '일시 정지 시간', width:118,},
    {key: 'avg_uph', name: 'UPH', width:118, formatter: UnitContainer, unitData: 'EA'},
    {key: 'workers', name: '작업자', width:118, formatter: RecordDetailFormatter, searchType: 'list'},
  ],
  recordSumDetailList: [
    {key: 'ln_id', name: '원자재 lot번호', width:118},
    {key: 'good_quantity', name: '양품 수량', width:118, formatter: UnitContainer, unitData: 'EA'},
    {key: 'poor_quantity', name: '불량 수량', width:118, formatter: UnitContainer, unitData: 'EA'},
    {key: 'poor_quantities', name: '불량 유형', width: 150, formatter: PoorQuantityModal, unitData: 'EA', searchType: 'disable'},
    {key: 'achievement', name: '목표 달성률',width:118, formatter: UnitContainer, unitData: '%'},
    {key: 'start', name: '작업 시작 일시', width:250,},
    {key: 'end', name: '작업 종료 일시', width:250, },
    {key: 'paused_time', name: '일시 정지 시간', width:118, formatter:PauseModal, searchType: 'disable'},
    {key: 'uph', name: 'UPH', width:118, formatter: UnitContainer, unitData: 'EA'},
    {key: 'worker', name: '작업자', width:118,},
  ],
  qualityDefectTop: [
    {key: 'customer_id', name: '거래처명', searchType: 'rawin', width: 150, formatter: PlaceholderBox, placeholder: '자동입력'},
    {key: 'cm_id', name: '모델', searchType: 'rawin', width: 150, formatter: PlaceholderBox, placeholder: '자동입력'},
    {key: 'code', name: 'CODE', formatter: SearchModalTest, type: 'product', width: 150},
    {key: 'name', name: '품명', width: 150, formatter: PlaceholderBox, placeholder: '자동입력'},
    // {key: 'process_id', name: '공정 종류', width: 150, formatter: ProcessSearchModal},
    // {key: 'pdr_id', name: '불량 유형', width: 150, formatter: DefectSearchModal},
  ],
  qualityDefectContents: [
    {key: 'process_id', name: '공정명', width: 220},
    {key: 'reason', name: '불량 유형', width: 550},
    {key: 'amount', name: '개수', width: 250, headerRenderer: HeaderFilter,
      options:[{status:0, name:"개수"},{status:1, name:"개수 많은순"},{status:2, name:"개수 적은순"}],
     },
  ],
  delivery: [
    {key:"customer_id", name:"고객사명",   },
    {key:"cm_id", name:"모델",  },
    {key:"code", name:"CODE", formatter: /*ProductSearchModal*/ MultipleSelectModal},
    {key:"name", name:"품명"},
    {key:"date", name:"납품 날짜", editor: CalendarBox, maxDate:true},
    {key:"amount", name:"납품 개수", editor: TextEditor, formatter: UnitContainer, unitData: 'EA'},
  ],
}

