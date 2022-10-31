import {TextEditor} from '../components/InputBox/ExcelBasicInputBox'
import {UnitContainer} from '../components/Unit/UnitContainer'
import {AddlButton} from '../components/Buttons/AddlButton'
import {DatetimePickerBox} from '../components/CalendarBox/DatetimePickerBox'
import {DeviceSearchModal} from '../components/Modal/DeviceSearchModal'
import {LineBorderContainer} from '../components/Formatter/LineBorderContainer'
import {DropDownEditor} from '../components/Dropdown/ExcelBasicDropdown'
import {AddTabButton} from '../components/Buttons/AddTabButton'
import {PauseInfoModal} from '../components/Modal/PauseInfoModal'
import {TimeFormatter} from '../components/Formatter/TimeFormmater'
import {DefectInfoModal} from '../components/Modal/DefectInfoModal'
import {MoldSelectModal} from '../components/Modal/MoldSelectModal'
import {MachineSelectModal} from '../components/Modal/MachineSelectModal'
import {InputMaterialListModal} from '../components/Modal/InputMaterialListModal'
import {MoldListModal} from '../components/Modal/MoldListModal'
import {MachineListModal} from '../components/Modal/MachineListModal'
import {SearchModalTest} from '../components/Modal/SearchModalTest'
import {LotDeliveryInfoModal} from '../components/Modal/LotDeliveryInfoModal'
import {LotNumberRegister} from '../components/Cell/LotNumberRegister'
import {ToolSelectModal} from "../components/Modal/ToolSelectModal";
import {ToolListModal} from "../components/Modal/ToolListModal";
import {LotInputInfoModal} from "../components/Modal/LotInputInfoModal";
import { BomInfoModal } from '../components/Modal/BomInfoModal'
import { MultiSelectModal } from '../components/Modal/SearchModalTest/MultiSelectModal'
import { IExcelHeaderType } from '../@types/type'
import {HeaderSort} from "../components/HeaderSort/HeaderSort";
import {InputMaterialInfoModal} from "../components/Modal/InputMaterialInfoModal";
import {WorkRegisterModal} from "../components/Modal/WorkRegisterModal";
import {WorkListModal} from "../components/Modal/WorkListModal";
import {BomRegisterInit} from "../components/Modal/InfoModal/InfoModalInit";
import {FinishButton} from "../components/Buttons/FinishButton";

export const searchModalList: any = {
  member: [
    {key: 'name', name: '성명', formatter: LineBorderContainer, placeholder:"-"},
    {key: 'appointment', name: '직책', formatter: LineBorderContainer, placeholder:"-"},
    {key: 'authority', name: '권한', formatter: LineBorderContainer, placeholder:"-"},
    {key: 'id', name: '아이디', formatter: LineBorderContainer, placeholder:"-"},
  ],
  product: [
    {key: 'customer_name', name: '거래처명', formatter: LineBorderContainer},
    {key: 'model_name', name: '모델', formatter: LineBorderContainer},
    {key: 'code', name: 'code', formatter: LineBorderContainer},
    {key: 'name', name: '품명', formatter: LineBorderContainer},
    {key: 'type', name: '종류', formatter: LineBorderContainer},
    {key: 'unit', name: '단위', formatter: LineBorderContainer},
    {key: 'stock', name: '재고수량', formatter: LineBorderContainer},
    // {key: 'spare', name: '기본/스페어 설정', formatter: LineBorderContainer},
  ],
  customer: [
    {key: 'customer_id', name: '거래처명', formatter: LineBorderContainer},
    {key: 'rep', name: '대표자명', formatter: LineBorderContainer},
    {key: 'manager', name: '담당자명', formatter: LineBorderContainer},
    // {key: 'telephone', name: '전화번호'},
    // {key: 'cellphone', name: '휴대폰번호'},
    // {key: 'address', name: '팩스 번호'},
    {key: 'address', name: '주소', formatter: LineBorderContainer},
    {key: 'crn', name: '사업자 번호', formatter: LineBorderContainer},
  ],
  authority: [
    {key: 'name', name: '권한명', formatter: LineBorderContainer,},
  ]
  ,process: [
    {key: 'name', name: '공정명', formatter: LineBorderContainer},
  ],processSearch: [
    {key: 'name', name: '공정명', formatter: LineBorderContainer},
  ],
  model: [
    {key: 'customer_name', name: '거래처명', formatter: LineBorderContainer},
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
    {key: 'name', name: '주변장치명', formatter: LineBorderContainer, placeholder:"-"},
    {key: 'mfrName', name: '제조사', formatter: LineBorderContainer, placeholder:"-"},
    {key: 'mfrCode', name: '제조 번호', formatter: LineBorderContainer, placeholder:"-"},
  ],
  mold: [
    {key: 'code', name: 'CODE', textAlign: 'center', formatter: LineBorderContainer},
    {key: 'name', name: '금형명', formatter: LineBorderContainer},
    {key: 'cavity', name: '캐비티', formatter: LineBorderContainer},
    {key: 'spm', name: 'SPM', formatter: LineBorderContainer},
    {key: 'slideHeight', name: '슬라이드 위치', formatter: LineBorderContainer},
    {key: 'limit', name: '최대 타수', formatter: LineBorderContainer},
    {key: 'inspect', name: '점검 타수', formatter: LineBorderContainer},
    {key: 'current', name: '현재 타수', formatter: LineBorderContainer},
  ],

  factoryInfo: [
    {key: 'seq', name: '번호', width: 64, formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'name', name: '세분화명', width: 576, formatter: LineBorderContainer, editor: TextEditor,  textType: 'Modal', placeholder: '세분화명 입력'},
    {key: 'manager', name: '담당자', width: 392, formatter: SearchModalTest, modalType: true, type:"user", placeholder: "-"},
    {key: 'appointment', name: '직책', width: 160, formatter: LineBorderContainer, placeholder: '자동 입력'},
    {key: 'telephone', name: '전화번호', width: 160, formatter: LineBorderContainer, placeholder: '자동 입력'},
    {key: 'description', name: '비고', width: 370, formatter: LineBorderContainer, editor: TextEditor, textType: 'Modal', placeholder: '내용 입력'},
  ],
  deviceInfo: [
    {key: 'seq', name: '번호', width: 80, formatter: LineBorderContainer, placeholder: '-'},
    {key: 'mfrCode', name: '제조 번호', width: 440, formatter: DeviceSearchModal, type: 'Modal', placeholder: '주변장치를 선택해 주세요'},
    {key: 'name', name: '장치 이름', width: 440, formatter: LineBorderContainer, placeholder: '주변장치를 선택해 주세요' },
    {key: 'mfrName', name: '제조사', width: 160, formatter: LineBorderContainer, placeholder: '-'},
    {key: 'type', name: '장치 종류', width: 160, formatter: LineBorderContainer, placeholder: '-'},
    {key: 'manager', name: '담당자', width: 160, formatter: LineBorderContainer, placeholder: '-'},
  ],
  productToolInfo: [
    {key: 'code', name: '품목 CODE', formatter: LineBorderContainer, placeholder: '-' },
    {key: 'name', name: '품명', formatter: LineBorderContainer, placeholder: '-'},
    {key: 'product_type', name: '종류', formatter: LineBorderContainer, placeholder: '-'},
    {key: 'unit', name: '단위', formatter: LineBorderContainer, placeholder: '-'},
    {key: 'spare', name: '기본/스페어 설정', formatter: LineBorderContainer, placeholder: '-'},
    {key: 'average', name: '평균 공구 교환주기', formatter: LineBorderContainer, placeholder: '-'},
  ],
  productInfo: [
    {key: 'customer', name: '거래처명', width: 160, formatter: LineBorderContainer, placeholder: '-'},
    {key: 'model', name: '모델', width: 160, formatter: LineBorderContainer, placeholder: '-' },
    {key: 'code', name: '품목 CODE', width: 312, formatter: LineBorderContainer, placeholder: '-' },
    {key: 'name', name: '품명', width: 472, formatter: LineBorderContainer, placeholder: '-'},
    {key: 'product_type', name: '종류', width: 160, formatter: LineBorderContainer, placeholder: '-'},
    {key: 'unit', name: '단위', width: 160, formatter: LineBorderContainer, placeholder: '-'},
    {key: 'stock', name: '재고 수량', width: 160, formatter: LineBorderContainer, placeholder: '-'},
    {key: 'spare', name: '기본/스페어 설정', width: 160, formatter: LineBorderContainer, placeholder: '-'},
  ],
  moldInfo: (basicRow? , setBasicRow?) => ([
    {key: 'sequence', name: '번호', textAlign: 'center', width: 80, formatter: LineBorderContainer},
    {key: 'code', name: 'CODE', width: 160, formatter: LineBorderContainer, placeholder: '자동 입력' },
    {key: 'name', name: '금형명', width: 472, formatter: MultiSelectModal, type:'productMold', searchType: 'mold', modalType: true, placeholder: '-', basicRow, setBasicRow},
    {key: 'spare', name: '기본/스페어 설정', width: 160, formatter: DropDownEditor,selectList: [
        {pk: 'basic', name: '기본'},
        {pk: 'spare', name: '스페어'},
      ], type: 'Modal'},
    {key: 'cavity', name: '캐비티', width: 160, formatter: LineBorderContainer, placeholder: '0'},
    {key: 'spm', name: 'SPM', width: 160, formatter: LineBorderContainer, placeholder: '0'},
    {key: 'slideHeight', name: '슬라이드 위치', width: 160, formatter: LineBorderContainer, placeholder: '0'},
  ]),
  toolInfo: (basicRow? , setBasicRow?) => ([
    {key: 'seq', name: '번호', textAlign: 'center', width: 80, formatter: LineBorderContainer},
    {key: 'code', name: 'CODE', width: 160, formatter: LineBorderContainer, placeholder: '자동 입력' },
    {key: 'name', name: '공구명', width: 472, formatter: MultiSelectModal, type:'productTool', searchType: 'tool', modalType: true, placeholder: '-', basicRow, setBasicRow},
    {key: 'spare', name: '기본/스페어 설정', width: 160, formatter: DropDownEditor,selectList: [
        {pk: '1', name: '기본'},
        {pk: '0', name: '스페어'},
      ], type: 'Modal'},
    // {key: 'cavity', name: '재고량', width: 160, formatter: LineBorderContainer, placeholder: '0'},
    // {key: 'spm', name: 'SPM', width: 160, formatter: LineBorderContainer, placeholder: '0'},
    // {key: 'slideHeight', name: '슬라이드 위치', width: 160, formatter: LineBorderContainer, placeholder: '0'},
  ]),
  toolProductSearch: [
    {key: 'code', name: '공구 CODE', formatter: LineBorderContainer, placeholder: 'CODE 입력' },
    {key: 'name', name: '공구 품명', formatter: LineBorderContainer, type: 'tool', modalType: true, placeholder: "-"  },
    {key: 'customer', name: '거래처', formatter: LineBorderContainer, placeholder: '-' },
    {key: 'isDefault', name: '기본/스페어', formatter: LineBorderContainer, placeholder: '-' },
    {key: 'stock', name: '재고량', formatter: LineBorderContainer /*UnitContainer*/, placeholder: '-'},
  ],
  toolSearch: [
    {key: 'code', name: '공구 CODE', formatter: LineBorderContainer, placeholder: '-' },
    {key: 'name', name: '공구 품명', formatter: LineBorderContainer, type: 'tool', modalType: true, placeholder: "-" },
    {key: 'customer', name: '거래처', formatter: LineBorderContainer, placeholder: "-"},
    {key: 'stock', name: '재고량', formatter: LineBorderContainer /*UnitContainer*/, placeholder: '-'},
  ],
  machineInfo: (basicRow? , setBasicRow?) => ([
    {key: 'seq', name: '번호', width: 80, formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'name', name: '기계 이름', width: 560, formatter: MultiSelectModal, type:'productMachine', searchType: 'machine', modalType: true, placeholder:'-', basicRow, setBasicRow},
    {key: 'mfrCode', name: '제조 번호', width: 160, formatter: LineBorderContainer, placeholder: '-', type: 'Modal', textAlign: 'center' },
    {key: 'type', name: '기계 종류', width: 160, formatter: LineBorderContainer, placeholder: '-', textAlign: 'center' },
    {key: 'spare', name: '기본/스페어 설정', width: 160, formatter: DropDownEditor,selectList: [
        {pk: 'basic', name: '기본'},
        {pk: 'spare', name: '스페어'},
      ], type: 'Modal'},
  ]),
  bomInfo: (searchList, tabIndex) => ([
    {key: 'seq', name: '번호', width: 64, formatter: LineBorderContainer},
    {key: 'code', name: 'CODE', width: 265, formatter: tabIndex === 0 ? SearchModalTest : LineBorderContainer, placeholder: '-', type: 'bom', modalType: true, noSelect:true},
    {key: 'name', name: '품명', width: 280, formatter: LineBorderContainer, placeholder: '-'},
    {key: 'spare', name: '기본/스페어 설정', width: 160, formatter: DropDownEditor,selectList: [
        {pk: 0, name: '기본'},
        {pk: 1, name: '스페어'},
      ], type: 'Modal'},
    {key: 'product_type', name: '구분', width: 160, formatter: LineBorderContainer, placeholder: '-'},
    {key: 'type_name', name: '품목 종류', width: 160, formatter: LineBorderContainer, placeholder: '-'},
    {key: 'unit', name: '단위', width: 160, formatter: LineBorderContainer /*UnitContainer*/, placeholder: '-'},
    {key: 'usage', name: '1회 사용량', width: 160, formatter: LineBorderContainer, editor: TextEditor, inputType:'number', textType: 'Modal', placeholder: '1'},
    {key: 'process', name: '생산 공정', width: 160, formatter: LineBorderContainer, placeholder: '-'},
    {key: 'bom', name: 'BOM', width: 160, formatter: AddTabButton, placeholder: '-', searchList},
  ]),

  readOnlyBomInfo: [
    {key: 'seq', name: '번호', width: 64,formatter: LineBorderContainer},
    {key: 'code', name: 'CODE', width: 425, formatter: LineBorderContainer, placeholder: '-', type: 'bom', modalType: true},
    {key: 'name', name: '품명', width: 280, formatter: LineBorderContainer, placeholder: '-'},
    {key: 'product_type', name: '구분', width: 160, formatter: LineBorderContainer, placeholder: '-'},
    {key: 'type_name', name: '품목 종류', width: 160, formatter: LineBorderContainer, placeholder: '-'},
    {key: 'unit', name: '단위', width: 160, formatter: LineBorderContainer, placeholder: '-'},
    {key: 'usage', name: '1회 사용량', width: 160, formatter: LineBorderContainer, textType: 'Modal', placeholder: '-'},
    {key: 'process', name: '생산 공정', width: 160, formatter: LineBorderContainer, placeholder: '-'},
    {key: 'bom', name: 'BOM', width: 160, formatter: AddTabButton, placeholder: '-'},
  ],

  moldUse: [
    {key: 'sequence', name: '번호', width: 64, textAlign: 'center', formatter: LineBorderContainer},
    {key: 'code', name: 'CODE', width: 160, formatter: LineBorderContainer },
    {key: 'name', name: '금형명', formatter: LineBorderContainer, type: 'Modal', placeholder:'-'},
    {key: 'cavity', name: '캐비티', width: 160, formatter: LineBorderContainer},
    {key: 'spm', name: 'SPM', width: 160, formatter: LineBorderContainer},
    {key: 'slideHeight', name: '슬라이드 위치', width: 160, formatter: LineBorderContainer},
    {key: 'isDefault', name: '기본/스페어', width: 160, formatter: LineBorderContainer, placeholder: '-', textAlign: 'center' },
    {key: 'setting', name: '사용 여부', width: 160, formatter: DropDownEditor,selectList: [
        {pk: 'basic', name: '여'},
        {pk: 'spare', name: '부'},
      ], type: 'Modal'},
  ],
  machineUse: [
    {key: 'sequence', name: '번호', width: 64, formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'name', name: '기계 이름', formatter: LineBorderContainer, placeholder: '-', type: 'Modal' },
    {key: 'mfrCode', name: '제조 번호', width: 160, formatter: LineBorderContainer, placeholder: '-', type: 'Modal', textAlign: 'center' },
    {key: 'machineType', name: '기계 종류', width: 160, formatter: LineBorderContainer, placeholder: '-', textAlign: 'center' },
    {key: 'isDefault', name: '기본/스페어', width: 160, formatter: LineBorderContainer, placeholder: '-', textAlign: 'center' },
    {key: 'setting', name: '사용 여부', width: 160, formatter: DropDownEditor,selectList: [
        {pk: 'basic', name: '여'},
        {pk: 'spare', name: '부'},
      ], type: 'Modal'},
  ],
  toolUse: (savedTools) => ([
    {key: 'sequence', name: '번호', width: 64, formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'code', name: '공구 CODE', width: 160, formatter: SearchModalTest, placeholder: '-', type: 'toolProduct', textAlign: 'center', modalType: true, noSelect:true, basicRow: savedTools },
    {key: 'name', name: '공구명', formatter: LineBorderContainer, placeholder: '-', type: 'Modal' },
    {key: 'customer', name: '거래처', width: 160, formatter: LineBorderContainer, placeholder: '-', textAlign: 'center' },
    {key: 'used', name: '생산량', width: 160, editor:TextEditor, formatter: LineBorderContainer, placeholder: '생산량 입력', textAlign: 'center', modalType:true, inputType:'number', textType: 'modal' },
  ]),
  moldList: [
    {key: 'sequence', name: '번호', width: 64, textAlign: 'center', formatter: LineBorderContainer},
    {key: 'code', name: 'CODE', width: 160, formatter: LineBorderContainer, placeholder: 'CODE 입력' },
    {key: 'name', name: '금형명', formatter: LineBorderContainer, type: 'Modal'},
    {key: 'cavity', name: '캐비티', width: 160, formatter: LineBorderContainer, placeholder: '0'},
    {key: 'spm', name: 'SPM', width: 160, formatter: LineBorderContainer, placeholder: '0'},
    {key: 'dieheigth', name: '슬라이드 위치', width: 160, formatter: LineBorderContainer, placeholder: '0'},
  ],
  toolList: [
    {key: 'sequence', name: '번호', width: 64, textAlign: 'center', formatter: LineBorderContainer},
    {key: 'code', name: '공구 CODE', width: 160, formatter: LineBorderContainer, placeholder: 'CODE 입력' },
    {key: 'name', name: '공구명', formatter: LineBorderContainer, type: 'Modal'},
    {key: 'customer', name: '거래처', width: 160, formatter: LineBorderContainer, placeholder: '-'},
    {key: 'used', name: '생산량', width: 160, formatter: LineBorderContainer, placeholder: '0'},
  ],
  machineList: [
    {key: 'seq', name: '번호', width: 64, formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'name', name: '기계 이름', formatter: LineBorderContainer, placeholder: '-', type: 'Modal' },
    {key: 'mfrCode', name: '제조 번호', width: 160, formatter: LineBorderContainer, placeholder: '-', type: 'Modal', textAlign: 'center' },
    {key: 'type', name: '기계 종류', width: 160, formatter: LineBorderContainer, placeholder: '-', textAlign: 'center' },
  ],
  select_machine: [
    {key: 'index', name: '순번', width:80},
    {key: 'name', name: '기계명'},
    {key: 'manufacturer', name: '제조사'},
  ],
  lot: [
    {key: 'number', width: 118, name: 'Lot번호'},
    {key: 'customer_id', width: 152, name: '거래처명'},
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
    {key: 'customer_id', name: '거래처명'},
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
  productprocess: [
    {key: 'seq', name: '공정 순서'},
    {key: 'process_id', name: '공정명'},
    {key: 'mold_name', name: '금형명'},
    {key: 'wip_name', name: '반제품명'},
  ],
  //작업지시서 등록 > 자재 선택
  bomRegister: [
    {key: 'seq', name: '번호', width: 64, alignText: 'center', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'code', name: 'CODE', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'name', name: '품명', formatter: LineBorderContainer, textAlign: 'center',placeholder: '-'},
    {key: 'setting', name: '사용 여부', width: 160, formatter: DropDownEditor,selectList: [
        {pk: 1, name: '여'},
        {pk: 0, name: '부'},
      ], modalType: true, type:"Modal"
    },
    {key: 'isDefault', name: '기본/스페어', width: 160, formatter: LineBorderContainer, textAlign: 'left'},
    {key: 'product_type', name: '구분', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'type', name: '품목 종류', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'unit', name: '단위', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'usage', name: '1회 사용량', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'process', name: '생산 공정', formatter: LineBorderContainer, textAlign: 'center',placeholder: '-'},
    {key: 'stock', name: '재고량', formatter: UnitContainer, textAlign: 'center',placeholder: "0", textType:"Modal", type: 'selectUnit'},
    {key: 'bom', name: 'BOM', width: 160, formatter: BomInfoModal, placeholder: '-' ,modalType: true , type : 'readonly' },
  ],
  InputInfo: [
    {key: 'seq', name: '번호', width: 64, alignText: 'center', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'code', name: 'CODE', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'name', name: '품명', formatter: LineBorderContainer, textAlign: 'center', placeholder:"-"},
    {key: 'product_type', name: '구분', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'type', name: '품목 종류', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'unit', name: '단위', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'usage', name: '1회 사용량', formatter: UnitContainer, textAlign: 'center', placeholder: "0", textType:"Modal", type: 'selectUnit'},
    {key: 'cavity', name: '기본 캐비티', formatter: UnitContainer, textAlign: 'center', placeholder: "0", textType:"Modal", unitData: 'EA'},
    {key: 'disturbance', name: '예상 소요량', formatter: UnitContainer, textAlign: 'center', placeholder: "0", textType:"Modal", type: 'selectUnit'},
    {key: 'stock', name: '재고량', formatter: UnitContainer, textAlign: 'center', placeholder: "0", textType:"Modal", type: 'selectUnit'},
    {key: 'process', name: '생산 공정', formatter: LineBorderContainer, textAlign: 'center', placeholder: "-"},
    {key: 'bom', name: 'BOM', width: 160, formatter: AddTabButton, placeholder: '-', },
  ],
  InputLotReadonlyInfo: [
    {key: 'seq', name: '번호', width: 64, alignText: 'center', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'elapsed', name: '경과일', formatter: LineBorderContainer, textAlign: 'center', placeholder:"-"},
    {key: 'lot_number', name: 'LOT 번호', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'date', name: '입고일', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'warehousing', name: '입고량', formatter: UnitContainer, textAlign: 'center', placeholder: "0", textType:"Modal", type: 'selectUnit'},
    {key: 'current', name: 'LOT 재고량', formatter: UnitContainer, textAlign: 'center', placeholder: "0", textType:"Modal", type: 'selectUnit'},
    {key: 'amount', name: '생산량', formatter: UnitContainer, textAlign: 'center', unitData:'EA', placeholder: "0", textType:"Modal"},
  ],
  ProductLotReadonlyInfo: [
    {key: 'seq', name: '번호', width: 64, alignText: 'center', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'lot_number', name: 'LOT 번호', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'date', name: '생산일', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'warehousing', name: 'LOT 생산량', formatter: UnitContainer, textAlign: 'center', placeholder: "0", textType:"Modal", type: 'selectUnit'},
    {key: 'current', name: 'LOT 재고량', formatter: UnitContainer, textAlign: 'center', placeholder: "0", textType:"Modal", type: 'selectUnit'},
    {key: 'amount', name: '생산량', formatter: UnitContainer, textAlign: 'center', unitData:'EA', placeholder: "0", textType:"Modal"},
  ],
  OutsourceLotReadonlyInfo: [
    {key: 'seq', name: '번호', width: 64, alignText: 'center', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'lot_number', name: 'LOT 번호', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'date', name: '입고일', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'warehousing', name: '입고량', formatter: UnitContainer, textAlign: 'center', placeholder: "0", textType:"Modal", type: 'selectUnit'},
    {key: 'current', name: 'LOT 재고량', formatter: UnitContainer, textAlign: 'center', placeholder: "0", textType:"Modal", type: 'selectUnit'},
    {key: 'amount', name: '생산량', formatter: UnitContainer, editor: TextEditor, textAlign: 'center', unitData:'EA', placeholder: "0", textType:"Modal"},
  ],
  OutsourcingInputListReadonly: [
    {key: 'seq', name: '번호', width: 64, alignText: 'center', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'code', name: 'CODE', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'name', name: '품명', formatter: LineBorderContainer, textAlign: 'center', placeholder: "-"},
    {key: 'product_type', name: '구분', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'type_name', name: '품목 종류', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'unit', name: '단위', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'usage', name: '1회 사용량', formatter: UnitContainer, textAlign: 'center', placeholder: "0", textType:"Modal", type: 'selectUnit'},
    {key: 'real_disturbance', name: '소요량', formatter: UnitContainer, textAlign: 'center', placeholder: "0", textType:"Modal", type: 'selectUnit'},
    {key: 'stock', name: '재고량', formatter: UnitContainer, textAlign: 'center', placeholder: "0", textType:"Modal", type: 'selectUnit'},
    {key: 'process', name: '생산 공정', formatter: LineBorderContainer, textAlign: 'center', placeholder: "-"},
    {key: 'lot', name: '투입 LOT', width: 160, formatter: AddTabButton, placeholder: '-', readonly:true },
  ],
  InputListReadonly: [
    {key: 'seq', name: '번호', width: 64, alignText: 'center', formatter: LineBorderContainer, textAlign: 'center',placeholder: "-"},
    {key: 'code', name: 'CODE', formatter: LineBorderContainer, textAlign: 'center',placeholder: "-"},
    {key: 'name', name: '품명', formatter: LineBorderContainer, textAlign: 'center', placeholder: "-"},
    {key: 'product_type', name: '구분', formatter: LineBorderContainer, textAlign: 'center',placeholder: "-"},
    {key: 'type_name', name: '품목 종류', formatter: LineBorderContainer, textAlign: 'center',placeholder: "-"},
    {key: 'unit', name: '단위', formatter: LineBorderContainer, textAlign: 'center',placeholder: "-"},
    {key: 'usage', name: '1회 사용량', formatter: UnitContainer, textAlign: 'center', placeholder: "0", textType:"Modal", type: 'selectUnit'},
    {key: 'real_disturbance', name: '소요량', formatter: UnitContainer, textAlign: 'center', placeholder: "0", textType:"Modal", type: 'selectUnit'},
    {key: 'cavity', name: '캐비티', formatter: UnitContainer, textAlign: 'center', placeholder: "0", textType:"Modal", unitData:'EA'},
    {key: 'stock', name: '재고량', formatter: UnitContainer, textAlign: 'center', placeholder: "0", textType:"Modal", type: 'selectUnit'},
    {key: 'process', name: '생산 공정', formatter: LineBorderContainer, textAlign: 'center', placeholder: "-"},
    {key: 'lot', name: '투입 LOT', width: 160, formatter: AddTabButton, placeholder: '-', readonly:true},
  ],
  workRegister: [
    {key: 'sequence', name: '번호', width: 64, alignText: 'center', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'lot_number', name: 'LOT 번호', formatter: LotNumberRegister, editor: TextEditor, textType: 'Modal', textAlign: 'center', width: 300},
    {key: 'worker_name', name: '작업자', formatter: SearchModalTest, type: 'user', width: 118, modalType: true, placeholder: '작업자 선택',noSelect:true},
    {key: 'start', name: '작업 시작 일시', formatter: DatetimePickerBox, textAlign: 'center', theme: 'white', width: 200, type : "start"},
    {key: 'end', name: '작업 종료 일시', formatter: DatetimePickerBox, textAlign: 'center', theme: 'white', width: 200, type : "end"},
    {key: 'pause', name: '일시 정지 시간', formatter: PauseInfoModal, textAlign: 'center', modalType: true, width: 120},
    {key: 'good_quantity', name: '양품 수량', textType: 'Modal', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'poor_quantity', name: '불량 수량 (자주검사)', formatter: DefectInfoModal, textAlign: 'center', width: 140, modalType: true},
    {key: 'sum', name: '합계', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'bom', name: '투입 자재', formatter: InputMaterialListModal, textAlign: 'center', modalType:true, action:'register'},
    {key: 'molds', name: '금형', formatter: MoldSelectModal, textAlign: 'center', modalType:true},
    {key: 'machines', name: '기계', formatter: MachineSelectModal, textAlign: 'center', modalType:true},
    {key: 'tool', name: '공구', formatter: ToolSelectModal, textAlign: 'center', modalType:true},
  ],
  workModify: [
    {key: 'sequence', name: '번호', width: 64, alignText: 'center', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'lot_number', name: 'LOT 번호', formatter: LotNumberRegister, editor: TextEditor, textType: 'Modal', textAlign: 'center', width: 300},
    {key: 'worker_name', name: '작업자', formatter: SearchModalTest, type: 'user', width: 118, modalType: true, placeholder: '작업자 선택'},
    {key: 'start', name: '작업 시작 일시', formatter: DatetimePickerBox, textAlign: 'center', theme: 'white', width: 200, type:'start'},
    {key: 'end', name: '작업 종료 일시', formatter: DatetimePickerBox, textAlign: 'center', theme: 'white', width: 200, type:'end'},
    {key: 'pause', name: '일시 정지 시간', formatter: PauseInfoModal, textAlign: 'center', modalType: true, width: 120, type: 'modify'},
    {key: 'good_quantity', name: '양품 수량', textType: 'Modal', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'poor_quantity', name: '불량 수량 (자주검사)', formatter: DefectInfoModal, textAlign: 'center', width: 140, modalType: true},
    {key: 'sum', name: '합계', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'bom', name: '투입 자재', formatter: InputMaterialListModal, textAlign: 'center', modalType:true, action:'modify'},
    {key: 'molds', name: '금형', formatter: MoldSelectModal, textAlign: 'center', modalType:true},
    {key: 'machines', name: '기계', formatter: MachineSelectModal, textAlign: 'center', modalType:true},
    {key: 'tool', name: '공구', formatter: ToolSelectModal, textAlign: 'center', modalType:true},
  ],
  workList: [
    {key: 'seq', name: '번호', width: 64, alignText: 'center', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'lot_number', name: 'LOT 번호', formatter: LineBorderContainer, textAlign: 'center',width:250},
    {key: 'worker_name', name: '작업자', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'start', name: '작업 시작 일시', formatter: LineBorderContainer, textAlign: 'center', width:150},
    {key: 'end', name: '작업 종료 일시', formatter: LineBorderContainer, textAlign: 'center', width:150, placeholder: '-'},
    {key: 'pause', name: '일시 정지 시간', formatter: PauseInfoModal, textAlign: 'center',type: 'readonly', modalType: true},
    {key: 'good_quantity', name: '양품 수량', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'poor_quantity', name: '불량 수량 (자주검사)', formatter: DefectInfoModal, textAlign: 'center', width: 180, type: 'readonly', modalType: true},
    {key: 'sum', name: '합계', formatter: LineBorderContainer, textAlign: 'center'},
    {key: 'input', name: '투입 자재', formatter: LotInputInfoModal, textAlign: 'center', readonly:true , modalType: true },
    {key: 'mold', name: '금형', formatter: MoldListModal, textAlign: 'center', type: 'Modal', modalType: true },
    {key: 'machine', name: '기계', formatter: MachineListModal, textAlign: 'center', type: 'Modal', modalType: true },
    {key: 'tool', name: '공구', formatter: ToolListModal, textAlign: 'center', type: 'Modal', modalType:true},
  ],
  pauseTime: [
    {key: 'reason', name: '일시 정지 유형', formatter: LineBorderContainer},
    {key: 'amount', width: 194, name: '시간', formatter: TimeFormatter, textType: 'Modal', searchType: 'pause' },
  ],
  pauseTimeReadOnly: [
    {key: 'reason', name: '일시 정지 유형', formatter: LineBorderContainer},
    {key: 'amount', width: 194, name: '시간', formatter: TimeFormatter, textType: 'Modal', searchType: 'pause', type:'readonly' },
  ],
  defectCount : function({readonly}){
    return [
      {key: 'process_name', name: '공정명', width: 200},
      {key: 'reason', name: '불량 유형', formatter: LineBorderContainer},
      {key: 'amount', width: 194, name: '불량 개수', editor: readonly !== 'readonly' ? TextEditor : undefined, formatter: UnitContainer, unitData: 'EA', textType: 'Modal', searchType: 'pause', placeholder: '숫자만 입력', inputType:'number'},
    ]
  },
  //검색 모달 엑셀 헤더
  userSearch: [
    {key: 'name', name: '성명', formatter: LineBorderContainer ,placeholder:"-", },
    {key: 'appointment', name: '직책', formatter: LineBorderContainer ,placeholder:"-", },
    {key: 'ca_name', name: '권한', formatter: LineBorderContainer ,placeholder:"-", },
    {key: 'email', name: '이메일', formatter: LineBorderContainer ,placeholder:"-", },
  ],
  customerSearch: [
    {key: 'name', name: '거래처', formatter: LineBorderContainer ,placeholder:"-", },
    {key: 'rep', name: '대표자명', formatter: LineBorderContainer ,placeholder:"-", },
    {key: 'manager', name: '담당자명', formatter: LineBorderContainer ,placeholder:"-", },
    {key: 'address', name: '주소', formatter: LineBorderContainer ,placeholder:"-", },
    {key: 'crn', name: '사업자 번호', formatter: LineBorderContainer ,placeholder:"-", },
  ],
  factorySearch: [
    {key: 'name', name: '공장명', formatter: LineBorderContainer ,placeholder:"-", },
    {key: 'address', name: '주소', formatter: LineBorderContainer ,placeholder:"-", },
    {key: 'manager', name: '담당자명', formatter: LineBorderContainer ,placeholder:"-", },
    {key: 'description', name: '비고', formatter: LineBorderContainer ,placeholder:"-", },
  ],
  subFactorySearch:[
    {key: 'name', name: "세분화명", formatter: LineBorderContainer, placeholder:"-" },
    {key: 'manager', name: '담당자명', formatter: LineBorderContainer, placeholder:"-" },
    {key: 'telephone', name: '전화번호', formatter: LineBorderContainer, placeholder:"-" },
    {key: 'description', name: '비고', formatter: LineBorderContainer, placeholder:"-" },
  ],
  segmentSearch: [
    {key: 'factory', name: '공장명'},
    {key: 'address', name: '주소'},
    {key: 'segment', name: '세분화명'},
    {key: 'manager', name: '담당자명'},
  ],
  modelSearch: [
    {key: 'customer', name: '거래처', formatter: LineBorderContainer ,placeholder:"-", },
    {key: 'rep', name: '대표자명', formatter: LineBorderContainer ,placeholder:"-", },
    {key: 'crn', name: '사업자 번호', formatter: LineBorderContainer ,placeholder:"-", },
    {key: 'model', name: '모델명', formatter: LineBorderContainer ,placeholder:"-", },
  ],

  rawMaterialSearch: [
    {key: 'code', formatter: LineBorderContainer , name: '원자재 CODE' ,placeholder:"-",},
    {key: 'name', formatter: LineBorderContainer , name: '원자재 품명' ,placeholder:"-",},
    {key: 'texture', formatter: LineBorderContainer , name: '재질' ,placeholder:"-",},
    {key: 'depth', formatter: LineBorderContainer , name: '두께' ,placeholder:"-",},
    {key: 'width', formatter: LineBorderContainer , name: '가로(COIL 폭)' ,placeholder:"-",},
    {key: 'height', formatter: LineBorderContainer , name: '세로(Feeder)' ,placeholder:"-",},
    {key: 'type', formatter: LineBorderContainer , name: '재질 종류' ,placeholder:"-",},
    {key: 'unit', formatter: LineBorderContainer , name: '단위' ,placeholder:"-",},
    {key: 'customer', formatter: LineBorderContainer , name: '거래처' ,placeholder:"-",},
  ],
  subMaterialSearch: [
    {key: 'code', formatter: LineBorderContainer, name: '부자재 CODE' ,placeholder:"-",},
    {key: 'name', formatter: LineBorderContainer, name: '부자재 품명' ,placeholder:"-",},
    {key: 'unit', formatter: LineBorderContainer, name: '단위' ,placeholder:"-",},
    {key: 'customer', formatter: LineBorderContainer, name: '거래처' ,placeholder:"-",},
  ],
  moldSearch: [
    {key: 'code', formatter: LineBorderContainer, name: 'CODE', placeholder:"-"},
    {key: 'name', formatter: LineBorderContainer, name: '금형명', placeholder:"-"},
    {key: 'cavity', formatter: LineBorderContainer, name: '캐비', placeholder:"-"},
    {key: 'spm', formatter: LineBorderContainer, name: 'SPM', placeholder:"-"},
    {key: 'slideHeight', formatter: LineBorderContainer, name: '슬라이드 위치', placeholder:"-"},
    {key: 'limit', formatter: LineBorderContainer, name: '최대 타수', placeholder:"-"},
    {key: 'inspect', formatter: LineBorderContainer, name: '점검 타수', placeholder:"-"},
    {key: 'current', formatter: LineBorderContainer, name: '현재 타수', placeholder:"-"},
  ],
  machineSearch: [
    {key: 'mfrCode', formatter: LineBorderContainer, placeholder:"-", name: '제조번호'},
    {key: 'name', formatter: LineBorderContainer, placeholder:"-", name: '기계 이름'},
    {key: 'type', formatter: LineBorderContainer, placeholder:"-", name: '기계 종류'},
    {key: 'weldingType', formatter: LineBorderContainer, placeholder:"-", name: '용접 종류'},
    {key: 'mfrName', formatter: LineBorderContainer, placeholder:"-", name: '기계 제조사'},
    {key: 'tons', formatter: LineBorderContainer, placeholder:"-", name: '톤 수'},
    {key: 'volt', formatter: LineBorderContainer, placeholder:"-", name: '사용 전압'},
    {key: 'factory_id', formatter: LineBorderContainer, placeholder:"-", name: '공장명'},
    {key: 'affiliated_id', formatter: LineBorderContainer, placeholder:"-", name: '공장 세분화명'},
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
    {key: 'customer_name', name: '거래처', formatter: LineBorderContainer ,placeholder:"-", colSpan(args) {
        if(args.row?.first){
          return 6
        }else{
          return undefined
        }
      },},
    {key: 'model_name', name: '모델', formatter: LineBorderContainer ,placeholder:"-",},
    {key: 'code', name: 'CODE', formatter: LineBorderContainer ,placeholder:"-",},
    {key: 'name', name: '품명', formatter: LineBorderContainer ,placeholder:"-",},
    // {key: 'product_type', name: '구분', formatter: LineBorderContainer ,placeholder:"-",},


    {key: 'type_name', name: '품목 종류', formatter: LineBorderContainer ,placeholder:"-",},
    {key: 'stock', name: '품목 재고', formatter: LineBorderContainer ,placeholder: 0,},
  ],
  contractSearch: [
    {key: 'identification', name: '수주 번호', formatter: LineBorderContainer ,placeholder:"-",},
    {key: 'date', name: '수주 날짜', formatter: LineBorderContainer ,placeholder:"-",},
    {key: 'deadline', name: '납품 기한', formatter: LineBorderContainer ,placeholder:"-",},
    {key: 'customer_name', name: '거래처', formatter: LineBorderContainer ,placeholder:"-",},
    {key: 'model_name', name: '모델', formatter: LineBorderContainer ,placeholder:"-",},
    {key: 'product_code', name: 'CODE', formatter: LineBorderContainer ,placeholder:"-",},
    {key: 'product_name', name: '품명', formatter: LineBorderContainer ,placeholder:"-",},
    {key: 'product_type', name: '품목 종류', formatter: LineBorderContainer ,placeholder:"-",},
    {key: 'product_unit', name: '단위', formatter: LineBorderContainer ,placeholder:"-",},
    {key: 'amount', name: '수주량', formatter: LineBorderContainer ,placeholder:"-",},
    {key: 'stock', name: '재고량', formatter: LineBorderContainer ,placeholder:"-",},

  ],
  lotStock: [
    {key: 'seq', name: '번호', width: 32, textAlign: 'center'},
    {key: 'lot_number', name: 'LOT 번호'},
    {key: 'start', name: '작업 시작 일시'},
    {key: 'end', name: '작업 종료 일시'},
    {key: 'worker', name: '작업자'},
    {key: 'amount', name: '재고량'},
  ],
  operationInfo: [
    {key: 'seq', name: '번호', width: 32, textAlign: 'center'},
    {key: 'identification', name: '지시 고유 번호', formatter: LineBorderContainer ,placeholder:"-",},
    {key: 'date', name: '지시 날짜', formatter: LineBorderContainer ,placeholder:"-",},
    {key: 'customer_id', name: '거래처명', formatter: LineBorderContainer ,placeholder:"-",},
    {key: 'cm_id', name: '모델', formatter: LineBorderContainer ,placeholder:"-",},
    {key: 'code', name: 'CODE', formatter: LineBorderContainer ,placeholder:"-",},
    {key: 'name', name: '품명', formatter: LineBorderContainer ,placeholder:"-",},
    {key: 'type', name: '품목 종류', formatter: LineBorderContainer ,placeholder:"-",},
    {key: 'process', name: '생산 공정', formatter: LineBorderContainer ,placeholder:"-",},
  ],
  deliveryInfo: [
    {key: 'seq', name: '번호', width: 32, textAlign: 'center'},
    {key: 'identification', name: '납품 번호'},
    {key: 'date', name: '납품 날짜'},
    {key: 'total', name: '납품 수량'},
    {key: 'lot_number', name: 'LOT별 납품 정보', formatter: LotDeliveryInfoModal, readonly: true, textAlign: 'center', modalType:true},
  ],
  lotDeliveryOutsourcingInfo: [
    {key: 'seq', name: '번호', formatter: LineBorderContainer, width: 32, textAlign: 'center'},
    {key: 'lot_number', name: 'LOT 번호', formatter: LineBorderContainer},
    {key: 'import_date', name: '입고일', formatter: LineBorderContainer},
    {key: 'current', name: '재고량', formatter: LineBorderContainer},
    {key: 'amount', name: '납품 수량', editor: TextEditor, formatter: LineBorderContainer, textType: 'Modal', placeholder:"수량을 입력해주세요.", inputType:'number'},
  ],
  lotDeliveryOutsourcingInfoReadonly: [
    {key: 'seq', name: '번호', width: 32, textAlign: 'center'},
    {key: 'lot_number', name: 'LOT 번호'},
    {key: 'import_date', name: '입고일'},
    {key: 'current', name: '재고량'},
    {key: 'amount', name: '납품 수량', textType: 'Modal',},
  ],
  lotDeliveryInfo: [
    {key: 'seq', name: '번호', formatter: LineBorderContainer, width: 32, textAlign: 'center'},
    {key: 'lot_number', name: 'LOT 번호', formatter: LineBorderContainer},
    {key: 'start', name: '작업 시작 일시', formatter: LineBorderContainer},
    {key: 'end', name: '작업 종료 일시', formatter: LineBorderContainer},
    {key: 'worker_name', name: '작업자', formatter: LineBorderContainer},
    {key: 'current', name: '재고량', formatter: LineBorderContainer},
    {key: 'amount', name: '납품 수량', editor: TextEditor, formatter: LineBorderContainer, textType: 'Modal', placeholder:"수량을 입력해주세요.", inputType:'number'},
  ],
  lotDeliveryInfoReadonly: [
    {key: 'seq', name: '번호', width: 32, textAlign: 'center'},
    {key: 'lot_number', name: 'LOT 번호'},
    {key: 'start', name: '작업 시작 일시'},
    {key: 'end', name: '작업 종료 일시'},
    {key: 'worker_name', name: '작업자'},
    {key: 'current', name: '재고량'},
    {key: 'amount', name: '납품 수량', textType: 'Modal',},
  ],
  midrangeInfo: [
    {key: 'osd_id', name: '지시 고유 번호', width: 152},
    {key: 'lot_number', name: 'LOT 번호 (생산로트)', width: 152},
    {key: 'code', name: 'CODE'},
    {key: 'material_name', name: '품명', width: 360},
    {key: 'type', name: '품목 종류', width: 120},
    {key: 'process_id', name: '생산 공정', width: 120},
    {key: 'worker_name', name: '작업자', width: 120},
    {key: 'name', name: '기계 이름 (CODE)', width: 240}
  ],
  dailyInspectionProblemInfo: [
    {key: 'seq', name: '번호', width: 64},
    {key: 'details', name: '문제 내역', formatter: LineBorderContainer, editor:TextEditor, width: 480, placeholder:"문제 내역을 입력해주세요.", textType: 'Modal'},
    {key: 'reason', name: '문제 원인', formatter: LineBorderContainer, editor:TextEditor, width: 560, placeholder:"문제 원인을 입력해주세요.", textType: 'Modal'},
    {key: 'action', name: '대책 및 조치사항', formatter: LineBorderContainer, editor:TextEditor, placeholder:"대책 및 조치사항을 입력해주세요.", textType: 'Modal'},
  ],
  outsourcingOrderSearch : [
    {key: 'identification', name: '발주 고유 번호', formatter:LineBorderContainer,placeholder: '-'},
    {key: 'name', name: '품명', formatter:LineBorderContainer, placeholder: '-'},
    {key: 'product_id', name: 'CODE', formatter:LineBorderContainer, type: 'user', placeholder: '-'},
    {key: 'current', name: '미입고량', formatter:LineBorderContainer, placeholder: '-'},
    {key: 'order_quantity', name: '총 발주량', formatter:LineBorderContainer, readonly:true, placeholder: '-'},
    {key: 'order_date', name: '발주일', formatter:LineBorderContainer, readonly:true, placeholder: '-'},
    {key: 'due_date', name: '입고 희망일', formatter:LineBorderContainer, readonly:true, type:'basic', action:'register'},
  ],
  sheetSearch : [
    { key: "contract_id", name: "작업지시서", noSelect:true,formatter:LineBorderContainer},
    { key: "identification", name: "지시 고유 번호" ,formatter:LineBorderContainer},
    { key: "deadline", name: "작업 기한",formatter:LineBorderContainer},
    { key: "product_id", name: "CODE" ,formatter:LineBorderContainer},
    { key: "name", name: "품명" ,formatter:LineBorderContainer},
    { key: "goal", name: "목표 생산량" ,formatter:LineBorderContainer},
  ]
}
