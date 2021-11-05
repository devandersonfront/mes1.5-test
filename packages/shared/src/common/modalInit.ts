import {TextEditor} from '../components/InputBox/ExcelBasicInputBox'
import {UnitContainer} from '../components/Unit/UnitContainer'
import {AddlButton} from '../components/Buttons/AddlButton'
import {DatetimePickerBox} from '../components/CalendarBox/DatetimePickerBox'
import {ProcessSearchModal} from '../components/Modal/ProcessSearchModal'
import {MemberSearchModal} from '../components/Modal/MemeberSearchModal'
import {ManagerSearchModal} from '../components/Modal/ManagerSearchModal'
import {DeviceSearchModal} from '../components/Modal/DeviceSearchModal'
import {LineBorderContainer} from '../components/Formatter/LineBorderContainer'
import {MoldSearchModal} from '../components/Modal/MoldSearchModal'
import ExcelBasicDropdown from '../../../main/component/Dropdown/ExcelBasicDropdown'
import {DropDownEditor} from '../components/Dropdown/ExcelBasicDropdown'
import {MachineSearchModal} from '../components/Modal/MachineSearchModal'
import {ProductSearchModal} from '../components/Modal/ProductSearchModal'
import {AddTabButton} from '../components/Buttons/AddTabButton'
import {InputMaterialInfoModal} from '../components/Modal/InputMaterialInfoModal'
import {PauseInfoModal} from '../components/Modal/PauseInfoModal'
import {TimeFormatter} from '../components/Formatter/TimeFormmater'
import {DefectInfoModal} from '../components/Modal/DefectInfoModal'
import {MoldInfoModal} from '../components/Modal/MoldInfoModal'
import {MoldSelectModal} from '../components/Modal/MoldSelectModal'
import {MachineSelectModal} from '../components/Modal/MachineSelectModal'
import {InputMaterialListModal} from '../components/Modal/InputMaterialListModal'
import {MoldListModal} from '../components/Modal/MoldListModal'
import {MachineListModal} from '../components/Modal/MachineListModal'
import {SearchModalTest} from '../components/Modal/SearchModalTest'
import {LotDeliveryInfoModal} from '../components/Modal/LotDeliveryInfoModal'
import {LotNumberRegister} from '../components/Cell/LotNumberRegister'
import {CalendarBox} from '../components/CalendarBox/CalendarBox'

export const searchModalList: any = {
  member: [
    {key: 'name', name: '성명', formatter: LineBorderContainer},
    {key: 'appointment', name: '직책', formatter: LineBorderContainer},
    {key: 'authority', name: '권한', formatter: LineBorderContainer},
    {key: 'user_id', name: '아이디', formatter: LineBorderContainer},
  ],
  product: [
    {key: 'customer', name: '고객사명', formatter: LineBorderContainer},
    {key: 'model', name: '모델', formatter: LineBorderContainer},
    {key: 'code', name: 'code', formatter: LineBorderContainer},
    {key: 'name', name: '품명', formatter: LineBorderContainer},
    {key: 'texture', name: '재질', formatter: LineBorderContainer},
  ],
  customer: [
    {key: 'customer_id', name: '고객사명', formatter: LineBorderContainer},
    {key: 'rep', name: '대표자명', formatter: LineBorderContainer},
    {key: 'manager', name: '담당자명', formatter: LineBorderContainer},
    // {key: 'telephone', name: '전화번호'},
    // {key: 'cellphone', name: '휴대폰번호'},
    // {key: 'address', name: '팩스 번호'},
    {key: 'address', name: '주소', formatter: LineBorderContainer},
    {key: 'crn', name: '사업자 번호', formatter: LineBorderContainer},
  ],
  process: [
    {key: 'name', name: '공정명', formatter: LineBorderContainer},
  ],
  model: [
    {key: 'customer_name', name: '고객사명', formatter: LineBorderContainer},
    {key: 'ceo', name: '대표자명', formatter: LineBorderContainer},
    {key: 'crn', name: '사업자 번호', formatter: LineBorderContainer},
    {key: 'model', name: '모델명', formatter: LineBorderContainer},
  ],
  machine: [
    {key: 'name', name: '기계명', formatter: LineBorderContainer},
    {key: 'manufacturer', name: '제조사', formatter: LineBorderContainer},
  ],

  factory: [
    {key: 'factory', name: '공장명', formatter: LineBorderContainer},
    {key: 'address', name: '주소', formatter: LineBorderContainer},
    {key: 'manager', name: '담당자명', formatter: LineBorderContainer},
    {key: 'description', name: '비고', formatter: LineBorderContainer},
  ],
  segmentFactory:[
    {key: 'factory', name: '공장명', formatter: LineBorderContainer},
    {key: 'address', name: '주소', formatter: LineBorderContainer},
    {key: 'segment', name: '세분화명', formatter: LineBorderContainer},
    {key: 'manger', name: '담당자명', formatter: LineBorderContainer},
  ],
  device: [
    {key: 'name', name: '주변장치명'},
    {key: 'manufacturer', name: '제조사'},
  ],
  mold: [
    {key: 'code', name: 'CODE', textAlign: 'center', formatter: LineBorderContainer},
    {key: 'name', name: '금형명', formatter: LineBorderContainer},
    {key: 'cavity', name: '캐비티', formatter: LineBorderContainer},
    {key: 'spm', name: 'SPM', formatter: LineBorderContainer},
    {key: 'dieHeight', name: '슬라이드 위치', formatter: LineBorderContainer},
    {key: 'limit', name: '최대 타수', formatter: LineBorderContainer},
    {key: 'check', name: '점검 타수', formatter: LineBorderContainer},
    {key: 'current', name: '현재 타수', formatter: LineBorderContainer},
  ],

  factoryInfo: [
    {key: 'seq', name: '번호', width: 64, formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'segmentName', name: '세분화명', width: 576, formatter: LineBorderContainer, editor: TextEditor, textType: 'Modal', placeholder: '세분화명 입력'},
    {key: 'user_id', name: '담당자', width: 392, formatter: ManagerSearchModal},
    {key: 'appointment', name: '직책', width: 160, formatter: LineBorderContainer, placeholder: '자동 입력'},
    {key: 'telephone', name: '전화번호', width: 160, formatter: LineBorderContainer, placeholder: '자동 입력'},
    {key: 'description', name: '비고', width: 370, formatter: LineBorderContainer, editor: TextEditor, textType: 'Modal', placeholder: '내용 입력'},
  ],
  deviceInfo: [
    {key: 'seq', name: '번호', width: 64, formatter: LineBorderContainer},
    {key: 'device_code', name: '제조 번호', width: 440, formatter: DeviceSearchModal, type: 'Modal', placeholder: '주변장치를 선택해 주세요'},
    {key: 'name', name: '장치 이름', width: 440, formatter: LineBorderContainer, placeholder: '주변장치를 선택해 주세요' },
    {key: 'manufacturer', name: '제조사', width: 160, formatter: LineBorderContainer},
    {key: 'machine_type', name: '장치 종류', width: 160, formatter: LineBorderContainer},
    {key: 'user_id', name: '담당자', width: 160, formatter: LineBorderContainer},
  ],
  productInfo: [
    {key: 'customer', name: '고객사명', width: 160, formatter: LineBorderContainer, placeholder: '-'},
    {key: 'model', name: '모델', width: 160, formatter: LineBorderContainer, placeholder: '-' },
    {key: 'code', name: '품목 CODE', width: 312, formatter: LineBorderContainer, placeholder: '-' },
    {key: 'name', name: '품명', width: 472, formatter: LineBorderContainer, placeholder: '-'},
    {key: 'product_type', name: '종류', width: 160, formatter: LineBorderContainer, placeholder: '-'},
    {key: 'unit', name: '단위', width: 160, formatter: LineBorderContainer, placeholder: '-'},
    {key: 'stock', name: '재고 수량', width: 160, formatter: LineBorderContainer, placeholder: '-'},
    {key: 'spare', name: '기본/스페어 설정', width: 160, formatter: LineBorderContainer, placeholder: '-'},
  ],
  moldInfo: [
    {key: 'seq', name: '번호', textAlign: 'center', width: 64, formatter: LineBorderContainer},
    {key: 'code', name: 'CODE', width: 160, formatter: LineBorderContainer, placeholder: 'CODE 입력' },
    {key: 'name', name: '금형명', width: 472, formatter: SearchModalTest, type: 'mold', modalType: true },
    {key: 'spare', name: '기본/스페어 설정', width: 160, formatter: DropDownEditor,selectList: [
        {pk: 'basic', name: '기본'},
        {pk: 'spare', name: '스페어'},
      ], type: 'Modal'},
    {key: 'cavity', name: '캐비티', width: 160, formatter: LineBorderContainer, placeholder: '0'},
    {key: 'spm', name: 'SPM', width: 160, formatter: LineBorderContainer, placeholder: '0'},
    {key: 'dieheigth', name: '슬라이드 위치', width: 160, formatter: LineBorderContainer, placeholder: '0'},
  ],
  machineInfo: [
    {key: 'seq', name: '번호', width: 64, formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'name', name: '기계 이름', width: 560, formatter: SearchModalTest, type: 'machine', modalType: true},
    {key: 'mfrCode', name: '제조 번호', width: 160, formatter: LineBorderContainer, placeholder: '-', type: 'Modal', textAlign: 'center' },
    {key: 'type', name: '기계 종류', width: 160, formatter: LineBorderContainer, placeholder: '-', textAlign: 'center' },
    {key: 'spare', name: '기본/스페어 설정', width: 160, formatter: DropDownEditor,selectList: [
        {pk: 'basic', name: '기본'},
        {pk: 'spare', name: '스페어'},
      ], type: 'Modal'},
  ],
  bomInfo: [
    {key: 'seq', name: '번호', width: 64, formatter: LineBorderContainer},
    {key: 'code', name: 'CODE', width: 425, formatter: SearchModalTest, placeholder: '-', type: 'product', modalType: true},
    {key: 'mold', name: '금형명', width: 280, formatter: LineBorderContainer, placeholder: '-'},
    {key: 'setting', name: '기본/스페어 설정', width: 160, formatter: DropDownEditor,selectList: [
        {pk: 0, name: '기본'},
        {pk: 1, name: '스페어'},
      ], type: 'Modal'},
    {key: 'type', name: '품목 종류', width: 160, formatter: LineBorderContainer, placeholder: '-'},
    {key: 'unit', name: '단위', width: 160, formatter: LineBorderContainer, placeholder: '-'},
    {key: 'usage', name: '사용량', width: 160, formatter: LineBorderContainer, editor: TextEditor, placeholder: '-'},
    {key: 'process', name: '생산 공정', width: 160, formatter: LineBorderContainer, placeholder: '-'},
    {key: 'bom', name: 'BOM', width: 160, formatter: AddTabButton, placeholder: '-'},
  ],

  moldUse: [
    {key: 'seq', name: '번호', width: 64, textAlign: 'center', formatter: LineBorderContainer},
    {key: 'code', name: 'CODE', width: 160, formatter: LineBorderContainer },
    {key: 'name', name: '금형명', formatter: LineBorderContainer, type: 'Modal'},
    {key: 'spare', name: '사용 여부', width: 160, formatter: DropDownEditor,selectList: [
        {pk: 'basic', name: '여'},
        {pk: 'spare', name: '부'},
      ], type: 'Modal'},
    {key: 'cavity', name: '캐비티', width: 160, formatter: LineBorderContainer},
    {key: 'spm', name: 'SPM', width: 160, formatter: LineBorderContainer},
    {key: 'dieheigth', name: '슬라이드 위치', width: 160, formatter: LineBorderContainer},
  ],
  machineUse: [
    {key: 'seq', name: '번호', width: 64, formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'machine_name', name: '기계 이름', formatter: LineBorderContainer, placeholder: '-', type: 'Modal' },
    {key: 'mfr_code', name: '제조 번호', width: 160, formatter: LineBorderContainer, placeholder: '-', type: 'Modal', textAlign: 'center' },
    {key: 'code', name: '기계 종류', width: 160, formatter: LineBorderContainer, placeholder: '-', textAlign: 'center' },
    {key: 'spare', name: '사용 여부', width: 160, formatter: DropDownEditor,selectList: [
        {pk: 'basic', name: '여'},
        {pk: 'spare', name: '부'},
      ], type: 'Modal'},

  ],
  moldList: [
    {key: 'seq', name: '번호', width: 64, textAlign: 'center', formatter: LineBorderContainer},
    {key: 'code', name: 'CODE', width: 160, formatter: LineBorderContainer, placeholder: 'CODE 입력' },
    {key: 'name', name: '금형명', formatter: LineBorderContainer, type: 'Modal'},
    {key: 'cavity', name: '캐비티', width: 160, formatter: LineBorderContainer, placeholder: '0'},
    {key: 'spm', name: 'SPM', width: 160, formatter: LineBorderContainer, placeholder: '0'},
    {key: 'dieheigth', name: '슬라이드 위치', width: 160, formatter: LineBorderContainer, placeholder: '0'},
  ],
  machineList: [
    {key: 'seq', name: '번호', width: 64, formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'machine_name', name: '기계 이름', formatter: LineBorderContainer, placeholder: '-', type: 'Modal' },
    {key: 'mfr_code', name: '제조 번호', width: 160, formatter: LineBorderContainer, placeholder: '-', type: 'Modal', textAlign: 'center' },
    {key: 'code', name: '기계 종류', width: 160, formatter: LineBorderContainer, placeholder: '-', textAlign: 'center' },

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
    {key: 'add', width: 100, name: '', formatter: AddlButton},
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
  ],
  bomRegister: [
    {key: 'seq', name: '번호', width: 64, alignText: 'center', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'code', name: 'CODE', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'name', name: '품명', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'spare', name: '사용 여부', width: 160, formatter: DropDownEditor,selectList: [
        {pk: 'basic', name: '여'},
        {pk: 'spare', name: '부'},
      ], type: 'Modal'},
    {key: 'type', name: '품목 종류', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'unit', name: '단위', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'cavity', name: '사용량', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'disturbance', name: '소요량', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'stock', name: '재고량', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'process', name: '생산 공정', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'bom', name: 'BOM', width: 160, formatter: AddTabButton, placeholder: '-', },

  ],
  InputInfo: [
    {key: 'seq', name: '번호', width: 64, alignText: 'center', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'code', name: 'CODE', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'name', name: '품명', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'type', name: '품목 종류', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'unit', name: '단위', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'cavity', name: '사용량', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'disturbance', name: '소요량', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'stock', name: '재고량', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'process', name: '생산 공정', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'bom', name: 'BOM', width: 160, formatter: AddTabButton, placeholder: '-', },

  ],
  InputLotInfo: [
    {key: 'seq', name: '번호', width: 64, alignText: 'center', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'date', name: '경과일', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'lot', name: '원자재 LOT 번호', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'input_date', name: '입고일', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'input_stock', name: '입고량', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'lot_stock', name: 'LOT 재고량', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'spare', name: '사용 여부', width: 160, formatter: DropDownEditor,selectList: [
        {pk: 'basic', name: '여'},
        {pk: 'spare', name: '부'},
      ], type: 'Modal'},
    {key: 'stock', name: '생산량', formatter: LineBorderContainer, textAlign: 'center'},

  ],
  InputLotReadonlyInfo: [
    {key: 'seq', name: '번호', width: 64, alignText: 'center', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'date', name: '경과일', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'lot', name: '원자재 LOT 번호', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'input_date', name: '입고일', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'input_stock', name: '입고량', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'lot_stock', name: 'LOT 재고량', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'stock', name: '생산량', formatter: LineBorderContainer, textAlign: 'center'},

  ],
  InputList: [
    {key: 'seq', name: '번호', width: 64, alignText: 'center', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'code', name: 'CODE', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'name', name: '품명', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'type', name: '품목 종류', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'unit', name: '단위', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'cavity', name: '사용량', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'disturbance', name: '소요량', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'stock', name: '재고량', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'process', name: '생산 공정', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'lot', name: '투입 LOT', width: 160, formatter: AddTabButton, placeholder: '-', },

  ],
  workRegister: [
    {key: 'seq', name: '번호', width: 64, alignText: 'center', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'lot', name: 'LOT 번호', formatter: LotNumberRegister, editor: TextEditor, textAlign: 'center', width: 300},
    {key: 'worker', name: '작업자', formatter: SearchModalTest, type: 'user', width: 118, modalType: true},
    {key: 'start', name: '작업 시작 일시', formatter: DatetimePickerBox, textAlign: 'center', theme: 'white', width: 200},
    {key: 'end', name: '작업 종료 일시', formatter: DatetimePickerBox, textAlign: 'center', theme: 'white', width: 200},
    {key: 'pause', name: '일시 정지 시간', formatter: PauseInfoModal, textAlign: 'center'},
    {key: 'good', name: '양품 수량', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'poor', name: '불량 수량 (유형별 수량은 숫자 클릭)', formatter: DefectInfoModal, textAlign: 'center', width: 250},
    {key: 'sum', name: '합계', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'input', name: '투입 자재', formatter: InputMaterialListModal, textAlign: 'center'},
    {key: 'mold', name: '금형', formatter: MoldSelectModal, textAlign: 'center'},
    {key: 'machine', name: '기계', formatter: MachineSelectModal, textAlign: 'center'},
  ],
  workList: [
    {key: 'seq', name: '번호', width: 64, alignText: 'center', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'lot', name: 'LOT 번호', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'worker', name: '작업자', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'start', name: '작업 시작 일시', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'end', name: '작업 종료 일시', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'pause', name: '일시 정지 시간', formatter: PauseInfoModal, textAlign: 'center', type: 'readonly'},
    {key: 'good', name: '양품 수량', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'poor', name: '불량 수량 (유형별 수량은 숫자 클릭)', formatter: DefectInfoModal, textAlign: 'center', width: 250, type: 'readonly'},
    {key: 'sum', name: '합계', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'input', name: '투입 자재', formatter: InputMaterialListModal, textAlign: 'center', type: 'readonly'},
    {key: 'mold', name: '금형', formatter: MoldListModal, textAlign: 'center', type: 'Modal'},
    {key: 'machine', name: '기계', formatter: MachineListModal, textAlign: 'center', type: 'Modal'},
  ],
  pauseTime: [
    {key: 'reason', name: '일시 정지 유형', formatter: LineBorderContainer},
    {key: 'amount', width: 194, name: '시간', editor: TextEditor, formatter: TimeFormatter, textType: 'Modal', searchType: 'pause'},
  ],
  defectCount: [
    {key: 'reason', name: '불량 유형', formatter: LineBorderContainer},
    {key: 'amount', width: 194, name: '불량 개수', editor: TextEditor, formatter: UnitContainer, unitData: 'EA', textType: 'Modal', searchType: 'pause', placeholder: '숫자만 입력'},
  ],

  //검색 모달 엑셀 헤더
  userSearch: [
    {key: 'name', name: '성명'},
    {key: 'appointment', name: '직책'},
    {key: 'ca_name', name: '권한'},
    {key: 'id', name: '아이디'},
  ],
  customerSearch: [
    {key: 'name', name: '거래처'},
    {key: 'rep', name: '대표자명'},
    {key: 'manager', name: '담당자명'},
    {key: 'address', name: '주소'},
    {key: 'crn', name: '사업자 번호'},
  ],
  factorySearch: [
    {key: 'factory', name: '공장명'},
    {key: 'address', name: '주소'},
    {key: 'manager', name: '담당자명'},
    {key: 'description', name: '비고'},
  ],
  segmentSearch: [
    {key: 'factory', name: '공장명'},
    {key: 'address', name: '주소'},
    {key: 'segment', name: '세분화명'},
    {key: 'manager', name: '담당자명'},
  ],
  modelSearch: [
    {key: 'customer', name: '거래처'},
    {key: 'rep', name: '대표자명'},
    {key: 'crn', name: '사업자 번호'},
    {key: 'model', name: '모델명'},
  ],
  rawMaterialSearch: [
    {key: 'code', name: '원자재 CODE'},
    {key: 'name', name: '원자재 품명'},
    {key: 'texture', name: '재질'},
    {key: 'depth', name: '두께'},
    {key: 'width', name: '가로(COIL 폭)'},
    {key: 'height', name: '세로(Feeder)'},
    {key: 'type', name: '재질 종류'},
    {key: 'customer', name: '거래처'},
  ],
  subMaterialSearch: [
    {key: 'code', name: '부자재 CODE'},
    {key: 'name', name: '부자재 품명'},
    {key: 'unit', name: '단위'},
    {key: 'customer', name: '거래처'},
  ],
  moldSearch: [
    {key: 'code', name: 'CODE'},
    {key: 'name', name: '금형명'},
    {key: 'cavity', name: '캐비'},
    {key: 'spm', name: 'SPM'},
    {key: 'slideHeight', name: '슬라이드 위치'},
    {key: 'limit', name: '최대 타수'},
    {key: 'check', name: '점검 타수'},
    {key: 'current', name: '현재 타수'},
  ],
  machineSearch: [
    {key: 'mfrCode', name: '제조번호'},
    {key: 'name', name: '기계 이름'},
    {key: 'type', name: '기계 종류'},
    {key: 'weldingType', name: '용접 종류'},
    {key: 'manufacture', name: '기계 제조사'},
    {key: 'ton', name: '톤 수'},
    {key: 'volt', name: '사용 전압'},
    {key: 'factory', name: '공장명'},
    {key: 'segment', name: '공장 세분화명'},
  ],
  deviceSearch: [
    {key: 'mfrCode', name: '제조번호'},
    {key: 'name', name: '장치 이름'},
    {key: 'type', name: '장치 종류'},
    {key: 'manufacture', name: '장치 제조사'},
    {key: 'factory', name: '공장명'},
    {key: 'segment', name: '공장 세분화명'},
  ],
  productSearch: [
    {key: 'customer_name', name: '거래처'},
    {key: 'model_name', name: '모델'},
    {key: 'code', name: 'CODE'},
    {key: 'name', name: '품명'},
    {key: 'type', name: '품목 종류'},
  ],
  orderSearch: [
    {key: 'orderNumber', name: '수주 번호'},
    {key: 'orderDate', name: '수주 날짜'},
    {key: 'limitDate', name: '납품 기한'},
    {key: 'customer', name: '거래처'},
    {key: 'model', name: '모델'},
    {key: 'code', name: 'CODE'},
    {key: 'name', name: '품명'},
    {key: 'type', name: '품목 종류'},
    {key: 'unit', name: '단위'},
    {key: 'orderStock', name: '수주량'},
  ],
  lotStock: [
    {key: 'seq', name: '번호', width: 32, textAlign: 'center'},
    {key: 'lot', name: 'LOT 번호'},
    {key: 'start', name: '작업 시작 일시'},
    {key: 'end', name: '작업 종료 일시'},
    {key: 'worker', name: '작업자'},
    {key: 'stock', name: '재고량'},
  ],
  operationInfo: [
    {key: 'seq', name: '번호', width: 32, textAlign: 'center'},
    {key: 'order_number', name: '지시 고유 번호'},
    {key: 'order_date', name: '지시 날짜'},
    {key: 'customer', name: '거래처명'},
    {key: 'model', name: '모델'},
    {key: 'code', name: 'CODE'},
    {key: 'name', name: '품명'},
    {key: 'type', name: '품목 종류'},
    {key: 'process', name: '생산 공정'},
  ],
  deliveryInfo: [
    {key: 'seq', name: '번호', width: 32, textAlign: 'center'},
    {key: 'delivery_number', name: '납품 번호'},
    {key: 'delivery_date', name: '납품 날짜'},
    {key: 'delivery_stock', name: '납품 수량'},
    {key: 'lotInfo', name: 'LOT별 납품 정보', formatter: LotDeliveryInfoModal, textAlign: 'center'},
  ],
  lotDeliveryInfo: [
    {key: 'seq', name: '번호', width: 32, textAlign: 'center'},
    {key: 'lot_number', name: 'LOT 번호'},
    {key: 'start', name: '작업 시작 일시'},
    {key: 'end', name: '작업 종료 일시'},
    {key: 'worker', name: '작업자'},
    {key: 'stock', name: '재고량'},
    {key: 'delivery_stock', name: '납품 수량'},
  ]
}

