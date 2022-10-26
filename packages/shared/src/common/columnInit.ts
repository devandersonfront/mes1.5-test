import { TextEditor } from '../components/InputBox/ExcelBasicInputBox'
import { DropDownEditor } from '../components/Dropdown/ExcelBasicDropdown'
import { CalendarBox } from '../components/CalendarBox/CalendarBox'
import { CellButtonComponent } from '../components/Buttons/CellButton'
import { UnitContainer } from '../components/Unit/UnitContainer'
import { MoveButtons } from "../components/MoveButtons";
import { FileEditer } from '../components/FileUpload/ExcelBasicFileUpload'
import { ProductSearchModal } from '../components/Modal/ProductSearchModal'
import { CustomerSearchModal } from '../components/Modal/CustomerSearchModal'
import { ModelSearchModal } from '../components/Modal/ModelSearchModal'
import { ProcessSearchModal } from '../components/Modal/ProcessSearchModal'
import { HeaderFilter } from "../components/HeaderFilter/HeaderFilter";
import { AuthoritySearchModal } from '../components/Modal/AuthoritySearchModal'
// @ts-ignore
import {StatusComponent} from '../components/Formatter/StatusComponent'
import {FactoryInfoModal} from '../components/Modal/FactoryInfoModal'
import {DeviceInfoModal} from '../components/Modal/DeviceInfoModal'
import {PlaceholderBox} from '../components/Formatter/PlaceholderBox'
import {ProductInfoModal} from '../components/Modal/ProductInfoModal'
import {MoldInfoModal} from '../components/Modal/MoldInfoModal'
import {MachineInfoModal} from '../components/Modal/MachineInfoModal'
import {BomInfoModal} from '../components/Modal/BomInfoModal'
import {UseDateCell} from '../components/Cell/UseDateCell'
import {BomRegisterInit} from '../components/Modal/InfoModal/InfoModalInit'
import {BomRegisterModal} from '../components/Modal/BomRegisterModal'
import {InputMaterialInfoModal} from '../components/Modal/InputMaterialInfoModal'
import {WorkRegisterModal} from '../components/Modal/WorkRegisterModal'
import {WorkListModal} from '../components/Modal/WorkListModal'
import {MoldListModal} from '../components/Modal/MoldListModal'
import {MachineListModal} from '../components/Modal/MachineListModal'
import {DefectInfoModal} from '../components/Modal/DefectInfoModal'
import {SearchModalTest} from '../components/Modal/SearchModalTest'
import {LotInfoModal} from '../components/Modal/LotInfoModal'
import {OperationInfoModal} from '../components/Modal/OperationInfoModal'
import {DeliveryInfoModal} from '../components/Modal/DeliveryInfoModal'
import {FinishButton} from '../components/Buttons/FinishButton'
import {CompleteButton} from '../components/Buttons/CompleteButton'
import {PauseInfoModal} from '../components/Modal/PauseInfoModal'
import {FinishCancelButton} from '../components/Buttons/FinishCancelButton'
import {OrderRegisterButton} from '../components/Buttons/OrderRegisterButton'
import {LotDeliveryInfoModal} from '../components/Modal/LotDeliveryInfoModal'
import {subFactorySearchModal} from "../components/Modal/SearchModalTest/subFactorySearchModal";
import {LotInputInfoModal} from '../components/Modal/LotInputInfoModal'
import {MidRangeButton} from "../components/Buttons/MidRangeButton";
import placeholder from "lodash/fp/placeholder";
import InputInfoModal from "../components/Modal/InfoModal/InputInfoModal";
import { LineBorderContainer } from "../components/Formatter/LineBorderContainer";
import { MultiTypeInputEditor } from "../components/InputBox/multiTypeInputBox";
import { ToolInfoModal } from "../components/Modal/ToolInfoModal";
import { ToolListModal } from "../components/Modal/ToolListModal";
import { MidrangeFrameButton } from "../components/Buttons/MidrangeFrameButton";
import { UnderLineContainer } from '../components/Formatter/UnderLineContainer'
import { OnClickContainer } from '../components/InputBox/OnClickContainer'
import { InputWithDropDown } from '../components/Dropdown/InputWithDropDown'
import { MultiSelectModal } from '../components/Modal/SearchModalTest/MultiSelectModal'
import { HeaderSort } from '../components/HeaderSort/HeaderSort'
import CommonProgressBar from '../../../main/component/InputBox/CommonProgressBar'
import {ExportButton} from "../components/Buttons/ExportButton";
import { PasswordBox } from '../components/Formatter/PasswordBox'
import {InputMaterialListModal} from "../components/Modal/InputMaterialListModal";
import {DetailFormatter} from "../components/Formatter/DetailFormatter";
import { AdjustQuantityModal } from '../components/Modal/AdjustQuantityModal'
import { AdjustLotInfo } from '../components/Modal/AdjustLotInfo'
import { RAW_MATERIAL_UNIT_CODE } from './TransferFunction'
import { AddRowButton } from '../components/Buttons/AddRowButton'

export const columnlist: any = {
  member: [
    { key: 'name', formatter: PlaceholderBox, placeholder: "성명 입력", editor: TextEditor, headerRenderer: HeaderSort, sortOption: "none", sorts: {} },
    { key: 'appointment', formatter: PlaceholderBox, placeholder: "직책 입력", editor: TextEditor },
    { key: 'telephone', formatter: PlaceholderBox, placeholder: "전화번호 입력", editor: TextEditor },
    { key: 'email', formatter: PlaceholderBox, placeholder: "이메일 입력", editor: TextEditor },
    { key: 'authority', formatter: AuthoritySearchModal },
    // {key: 'authority', formatter: DropDownEditor, selectList: []},
    { key: 'tmpId', formatter: PlaceholderBox, placeholder: "아이디 입력", editor: TextEditor, headerRenderer: HeaderSort, sortOption: "none", sorts: {} },
    { key: 'password',formatter: PasswordBox, placeholder: "비밀번호 입력", editor: TextEditor },
    { key: 'password-confirm', formatter: PasswordBox, placeholder: "비밀번호 확인", editor: TextEditor },
    { key: 'profile', formatter: FileEditer, type: "image" , unprintable : true},
  ],
  factory: [
    { key: 'name', name: '공장명', width: 240, editor: TextEditor, formatter: PlaceholderBox, placeholder: '공장명 입력', headerRenderer: HeaderSort, sortOption: "none", sorts: {} },
    { key: 'address', name: '공장 주소', width: 480, editor: TextEditor, formatter: PlaceholderBox, placeholder: '공장 주소 입력' },
    { key: 'manager', name: '담당자', width: 120, formatter: SearchModalTest, type: 'user', placeholder: '-' },
    { key: 'appointment', name: '직책', width: 120, formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: 'telephone', name: '전화번호', width: 120, formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: 'description', name: '비고', width: 120, editor: TextEditor, formatter: PlaceholderBox, placeholder: '비고 입력' },
    { key: 'affiliated_id', name: '공장 세분화', width: 120, formatter: /*IdnfoModal*/ FactoryInfoModal, type: 'factoryRegister', summaryType: 'factory' ,unprintable : true},
  ],
  customer: [
    { key: 'name', editor: TextEditor, formatter: PlaceholderBox, placeholder: "거래처명 입력", headerRenderer: HeaderSort, sortOption: "none", sorts: {} },
    { key: 'rep', editor: TextEditor, formatter: PlaceholderBox, placeholder: "대표자명 입력" },
    { key: 'manager', editor: TextEditor, formatter: PlaceholderBox, placeholder: "담당자명 입력" },
    { key: 'telephone', editor: TextEditor, formatter: PlaceholderBox, placeholder: "전화번호 입력" },
    { key: 'cellphone', editor: TextEditor, formatter: PlaceholderBox, placeholder: "휴대폰 번호 입력" },
    { key: 'fax', editor: TextEditor, formatter: PlaceholderBox, placeholder: "FAX 입력" },
    { key: 'address', editor: TextEditor, formatter: PlaceholderBox, placeholder: "주소 입력" },
    { key: 'crn', editor: TextEditor, formatter: PlaceholderBox, placeholder: "사업자 번호 입력" },
    { key: 'photo', formatter: FileEditer , unprintable : true},
  ],
  model: [
    { key: 'customer_id', formatter: SearchModalTest, type: 'customer', placeholder: "-", noSelect: true, headerRenderer: HeaderSort, sortOption: "none", sorts: {} },
    { key: 'crn', formatter: PlaceholderBox, placeholder: "자동 입력" },
    { key: 'model', editor: TextEditor, formatter: PlaceholderBox, placeholder: "모델 입력", headerRenderer: HeaderSort, sortOption: "none", sorts: {} },
  ],
  process: [
    { key: 'name', editor: TextEditor, formatter: PlaceholderBox, placeholder: "공정명 입력", headerRenderer: HeaderSort, sortOption: "none", sorts: {} },
  ],
  machine: [
    { key: 'name', editor: TextEditor },
    {
      key: 'type', formatter: DropDownEditor, selectList: [
        { pk: 0, name: "선택없음" },
        { pk: 1, name: "프레스" },
        { pk: 2, name: "로봇" },
        { pk: 3, name: "용접기" },
        { pk: 4, name: "밀링" },
        { pk: 5, name: "선반" },
        { pk: 6, name: "탭핑기" },
      ]
    },
    { key: 'madeAt', editor: CalendarBox },
    { key: 'mfrCode', editor: TextEditor },
    { key: 'user_id', formatter: SearchModalTest, type: 'member' },
    { key: 'manufacturer', editor: TextEditor },
    { key: 'photo', formatter: FileEditer },
    { key: 'qualify', formatter: FileEditer },
    { key: 'capacity', formatter: FileEditer },
    { key: 'guideline', formatter: FileEditer },
    {
      key: 'interwork', formatter: DropDownEditor, selectList: [
        { pk: 'true', name: '유' },
        { pk: 'false', name: '무' }
      ]
    },
    { key: 'tons', editor: TextEditor, formatter: UnitContainer, unitData: 'T', },
    { key: 'volt', editor: TextEditor, formatter: UnitContainer, unitData: 'V', },
  ],
  machineV2: [ //기계기준정보
    { key: 'mfrName', name: '기계 제조사', editor: TextEditor, width: 118, formatter: PlaceholderBox, placeholder: "제조사 입력" },
    { key: 'name', name: '기계 이름', editor: TextEditor, width: 118, formatter: PlaceholderBox, placeholder: "이름 입력" },
    {
      key: 'type', name: '기계 종류', editor: DropDownEditor, editorOptions: { editOnClick: true }, headerRenderer: HeaderFilter,
      options: [
        { status: undefined, name: "기계 종류" },
        { status: 0, name: "선택없음" },
        { status: 1, name: "프레스" },
        { status: 2, name: "로봇" },
        { status: 3, name: "용접기" },
        { status: 4, name: "밀링" },
        { status: 5, name: "선반" },
        { status: 6, name: "탭핑기" },
      ],
      selectList: [
        { pk: 0, name: "선택없음" },
        { pk: 1, name: "프레스" },
        { pk: 2, name: "로봇" },
        { pk: 3, name: "용접기" },
        { pk: 4, name: "밀링" },
        { pk: 5, name: "선반" },
        { pk: 6, name: "탭핑기" },
      ], width: 118
    },
    {
      key: 'weldingType', name: '용접 종류', formatter: DropDownEditor, selectList: [
        { pk: 0, name: "선택없음" },
        { pk: 1, name: "아르곤" },
        { pk: 2, name: "스팟" },
        { pk: 3, name: "통합" },
      ], width: 118, placeholder: "-"
    },
    { key: 'madeAt', name: '제조 연월일', formatter: CalendarBox, width: 118 },
    { key: 'mfrCode', name: '제조 번호(필수)', editor: TextEditor, formatter: PlaceholderBox, width: 118, placeholder: "제조 번호 입력", headerRenderer: HeaderSort, sortOption: "none", sorts: {} },
    { key: 'manager', name: '담당자', formatter: SearchModalTest, type: 'user', width: 118, placeholder: "-" },
    { key: 'photo', name: '기계사진', formatter: FileEditer, width: 118, type: "image" ,unprintable : true},
    { key: 'qualify', name: '스펙 명판 사진', formatter: FileEditer, width: 118, type: "image" ,unprintable : true},
    { key: 'capacity', name: '능력 명판 사진', formatter: FileEditer, width: 118, type: "image" ,unprintable : true},
    { key: 'guideline', name: '사용 설명서', formatter: FileEditer, width: 118, type: "image" ,unprintable : true},
    {
      key: 'interwork', name: '오버홀 유무', formatter: DropDownEditor, selectList: [
        { pk: 'true', name: '유' },
        { pk: 'false', name: '무' }
      ], width: 118
    },
    { key: 'device_id', name: '주변장치', formatter: /*InfoModal*/ DeviceInfoModal, width: 118, type: 'deviceRegister', summaryType: 'device' ,unprintable : true},
    { key: 'form_id', name: '일상 점검', width: 118, formatter: CellButtonComponent /*FactoryInfoModal*/, type: 'inspection' ,unprintable : true},
    { key: 'tons', name: '톤 수', editor: TextEditor, formatter: UnitContainer, inputType: 'number', unitData: 'T', width: 118, placeholder: "0", toFix: 1 },
    { key: 'volt', name: '사용 전압', editor: TextEditor, formatter: UnitContainer, inputType: 'number', unitData: 'V', width: 118, placeholder: "0", toFix: 1 },
    { key: 'factory_id', name: '공장명', width: 118, formatter: SearchModalTest, type: 'factory', placeholder: "-" },
    { key: 'affiliated_id', name: '공장 세분화명', width: 118, formatter: subFactorySearchModal /*FactoryInfoModal*/, type: 'subFactory', placeholder: "-" },
    { key: 'product_id', name: '생산 품목', width: 118, formatter: ProductInfoModal, type: "machine", headerItems: [[{key: 'name', title:'기계명', infoWidth: 300},{ key: 'mfrCode', title: '제조 번호', infoWidth: 300 }]] ,unprintable : true},
  ],
  device: [
    { key: 'mfrName', name: '장치 제조사', editor: TextEditor, formatter: PlaceholderBox, placeholder: "제조사 입력" },
    { key: 'name', name: '장치 이름', editor: TextEditor, formatter: PlaceholderBox, placeholder: "이름 입력" },
    {
      key: 'type', name: '장치 종류', formatter: DropDownEditor, headerRenderer: HeaderFilter,
      options: [
        { status: null, name: "장치 종류" },
        { status: 0, name: "선택 없음" },
        { status: 1, name: "미스피드 검출장치" },
        { status: 2, name: "하사점 검출장치" },
        { status: 3, name: "로드모니터" },
        { status: 4, name: "앵글시퀀서" },
        { status: 5, name: "엔코더" },
        { status: 6, name: "통관센서" },
        { status: 7, name: "유틸리티 센서" },
      ],
      selectList: [
        { pk: 0, name: "선택없음" },
        { pk: 1, name: "미스피드 검출장치" },
        { pk: 2, name: "하사점 검출장치" },
        { pk: 3, name: "로드모니터" },
        { pk: 4, name: "앵글시퀀서" },
        { pk: 5, name: "엔코더" },
        { pk: 6, name: "통관센서" },
        { pk: 7, name: "유틸리티 센서" },
      ]
    },
    { key: 'madeAt', name: '제조 연월일', formatter: CalendarBox },
    { key: 'mfrCode', name: '제조 번호(필수)', editor: TextEditor, formatter: PlaceholderBox, placeholder: "제조 번호 입력", headerRenderer: HeaderSort, sortOption: "none", sorts: {} },
    { key: 'manager', name: '담당자', formatter: SearchModalTest, type: "user", placeholder: "-" },
    { key: 'photo', name: '장치사진', formatter: FileEditer, type: "image" ,unprintable : true},
    { key: 'qualify', name: '스펙 명판 사진', formatter: FileEditer, type: "image" ,unprintable : true},
    { key: 'capacity', name: '능력 명판 사진', formatter: FileEditer, type: "image" ,unprintable : true},
    { key: 'guideline', name: '사용 설명서', formatter: FileEditer, type: "image" ,unprintable : true},
    { key: 'factory_id', name: '공장명', formatter: SearchModalTest, type: "factory", placeholder: "-" },
    { key: 'affiliated_id', name: '공장 세분화명', formatter: subFactorySearchModal, type: "subFactory" /*FactoryInfoModal*/, placeholder: "-" },
  ],
  product: [
    { key: 'customer_id', formatter: CustomerSearchModal, searchType: 'product' },
    { key: 'cm_id', formatter: ModelSearchModal, searchType: 'product' },
    { key: 'code', editor: TextEditor },
    { key: 'name', editor: TextEditor },
    { key: 'texture', editor: TextEditor },
    { key: 'depth', editor: TextEditor, formatter: UnitContainer, inputType: 'number', unitData: 'mm', toFix: 2 },
    { key: 'width', editor: TextEditor, formatter: UnitContainer, inputType: 'number', unitData: 'mm' },
    { key: 'height', editor: TextEditor, formatter: UnitContainer, inputType: 'number', unitData: 'mm' },
    {
      key: 'type', formatter: DropDownEditor, selectList: [
        { pk: 'COIL', name: 'COIL' },
        { pk: 'SHEET', name: 'SHEET' }
      ]
    },
    { key: 'unitWeight', editor: TextEditor, formatter: UnitContainer, inputType: 'number', unitData: 'kg', searchType: 'rawin' },
    { key: 'pp_id', formatter: CellButtonComponent, },
  ],

  productV1u: [
    {key: 'customer_id', name: '거래처', formatter: SearchModalTest, type: 'customer', placeholder: '-'},
    {key: 'cm_id', name: '모델', formatter: SearchModalTest, type: 'customerModel', placeholder: '-'},
    {key: 'code', name: 'CODE', editor: TextEditor, formatter: PlaceholderBox, placeholder: 'CODE 입력', overlay:true, headerRenderer:HeaderSort, sortOption: "none",sorts: {}},
    {key: 'name', name: '품명', editor: TextEditor, formatter: PlaceholderBox, placeholder: '품명 입력'},
    {key: 'product_type', name: '구분',  formatter: DropDownEditor, editorOptions: { editOnClick: true }, headerRenderer: HeaderFilter,
      options: [
        { status: '0', name: "구분" },
        {status: '1', name: '생산품'},
        {status: '2', name: '외주품'},
      ],selectList: [
        {pk: '0', name: '생산품'},
        {pk: '1', name: '외주품'},
      ]},
    {key: 'type', name: '품목 종류',  formatter: DropDownEditor, headerRenderer: HeaderFilter,
      options: [
        {status: undefined, name: '품목 종류'},
          {status: '0,3', name: '반제품'},
          {status: '1', name: '재공품'},
          {status: '2,4', name: '완제품'}
      ]
      , selectList: [
        [{pk: '0', name: '반제품'},
        {pk: '1', name: '재공품'},
        {pk: '2', name: '완제품'}],
        [{pk: '3', name: '반제품'},
        {pk: '4', name: '완제품'}],
      ]},
    // {key: 'product_type', name: '외주 여부',  formatter: DropDownEditor, selectList: [
    //     {pk: '3', name: '생산품'},
    //     {pk: '4', name: '외주품'},
    //   ]},
    {key: 'unit', name: '단위', formatter: DropDownEditor, selectList: [
        {pk: 'EA', name: 'EA'},
        {pk: 'g', name: 'g'},
        {pk: 'kg', name: 'kg'},
        {pk: 'Ton', name: 'Ton'},
        {pk: 'ml', name: 'ml'},
        {pk: 'L', name: 'L'},
      ], headerRenderer:HeaderSort, sortOption: "none",sorts: {}},
    {key: 'bom_root', name: 'BOM', formatter: BomInfoModal, type:"bomRegister" , unprintable: true},
    // {key: 'bom_root', name: 'BOM', formatter: BomInfoModal, type:"product"},
    {key: 'process_id', name: '생산 공정', formatter: /*ProcessSearchModal*/ SearchModalTest, type:"process", placeholder: "-", noSelect:true, headerRenderer:HeaderSort, sortOption: "none",sorts: {}},
    {key: 'mold_id', name: '금형', formatter: MoldInfoModal, unprintable: true},
    {key: 'tool_id', name: '공구', formatter: ToolInfoModal, unprintable: true},
    {key: 'machine_id', name: '기계', formatter: MachineInfoModal, unprintable: true},
    {key: 'standard_uph', name: '기준 UPH', editor: TextEditor, inputType:'number', formatter: UnitContainer, placeholder: '0', toFix:1},
    {key: 'price', name: '단가', editor: TextEditor, inputType:'number', formatter: UnitContainer, placeholder: '0', toFix:1, unitData:'원'},
    {key: 'work_standard_image', name: '작업 표준서', formatter: FileEditer , unprintable: true},
    {key: 'sic_id', name: '초ㆍ중ㆍ종 검사', formatter: MidRangeButton, title: '검사항목 등록' , unprintable: true},
    {key: 'safety_stock' , name : '안전 재고', placeholder: '0' ,editor: TextEditor, formatter: PlaceholderBox }
  ],
  productBatchRegister: (rows) => ([
    {key: 'sequence', name: '순서'},
    {key: 'customer_id', name: '거래처', formatter: SearchModalTest, type: 'customer', placeholder: '-'},
    {key: 'cm_id', name: '모델', formatter: SearchModalTest, type: 'customerModel', placeholder: '-'},
    {key: 'code', name: 'CODE', editor: TextEditor, formatter: PlaceholderBox, placeholder: 'CODE 입력'},
    {key: 'name', name: '품명', editor: TextEditor, formatter: PlaceholderBox, placeholder: '품명 입력'},
    {key: 'product_type', name: '구분',  formatter: DropDownEditor, selectList: [
        {pk: '0', name: '생산품'},
        {pk: '1', name: '외주품'},
      ], tab: 'ROLE_BASE_15'},
    {key: 'type', name: '품목 종류',  formatter: DropDownEditor, selectList: [
        [{pk: '0', name: '반제품'},
          {pk: '1', name: '재공품'},
          {pk: '2', name: '완제품'}],
        [{pk: '3', name: '반제품'},
          {pk: '4', name: '완제품'}],
      ], tab: 'ROLE_BASE_15'},
    {key: 'unit', name: '단위', formatter: DropDownEditor, selectList: [
        {pk: 'EA', name: 'EA'},
        {pk: 'g', name: 'g'},
        {pk: 'kg', name: 'kg'},
        {pk: 'Ton', name: 'Ton'},
        {pk: 'ml', name: 'ml'},
        {pk: 'L', name: 'L'},
      ], tab: 'ROLE_BASE_15'},
    {key: 'bom_root', name: 'BOM', formatter: BomInfoModal, type:"bomRegister", searchType: 'bomBatch', unprintable: true},
    {key: 'usage', name: '단위 중량', formatter: PlaceholderBox, editor: TextEditor, placeholder:'-', inputType:'number', disabledCase: [{key: 'isFirst', value: true}]},
    {key: 'process_id', name: '생산 공정', formatter: /*ProcessSearchModal*/ SearchModalTest, type:"process", placeholder: "-", noSelect:true, headerRenderer:HeaderSort, sortOption: "none",sorts: {}},
    {key: 'mold_id', name: '금형', formatter: MoldInfoModal, unprintable: true},
    {key: 'machine_id', name: '기계', formatter: MachineInfoModal, unprintable: true},
  ]),
  rawMaterial: [
    { key: 'code', name: '원자재 CODE', editor: TextEditor, formatter: PlaceholderBox, placeholder: "CODE 입력", headerRenderer: HeaderSort, sortOption: "none", sorts: {} },
    { key: 'name', name: '원자재 품명', editor: TextEditor, formatter: PlaceholderBox, placeholder: "품명 입력" },
    { key: 'texture', name: '재질', editor: TextEditor, formatter: PlaceholderBox, placeholder: "재질 입력" },
    { key: 'depth', name: '두께', editor: TextEditor, formatter: UnitContainer, inputType: 'number', unitData: 'T', placeholder: "0", toFix: 2 },
    { key: 'width', name: '가로(COIL 폭)', editor: TextEditor, formatter: UnitContainer, inputType: 'number', unitData: 'mm', placeholder: "0", toFix: 1 },
    { key: 'height', name: '세로(Feeder)', editor: TextEditor, formatter: UnitContainer, inputType: 'number', unitData: 'mm', placeholder: "0", toFix: 1 },
    {
      key: 'type', name: '재질 종류', formatter: DropDownEditor, selectList: [
        { pk: 1, name: 'COIL' },
        { pk: 2, name: 'SHEET' }
      ]
    },
    {
      key: 'stock', name: '원자재 재고량', formatter: UnitContainer, placeholder: "0", toFix: 2, selectList: RAW_MATERIAL_UNIT_CODE.map(unit => ({pk: unit.code, name:unit.value}))
    },
    { key: 'customer_id', name: '거래처', formatter: SearchModalTest, type: 'customer', placeholder: "-" },
    { key: 'expiration', name: '사용기준일', editor: TextEditor, formatter: UnitContainer, unitData: '일', placeholder: '기준일 입력', inputType: 'number', },
  ],

  subMaterial: [
    { key: 'code', name: '부자재 CODE', editor: TextEditor, formatter: PlaceholderBox, placeholder: 'CODE 입력', headerRenderer: HeaderSort, sortOption: "none", sorts: {} },
    { key: 'name', name: '부자재 품명', editor: TextEditor, formatter: PlaceholderBox, placeholder: '품명 입력' },
    {
      key: 'unit', name: '단위', formatter: DropDownEditor, selectList: [
        { pk: 'EA', name: 'EA' },
        { pk: 'g', name: 'g' },
        { pk: 'kg', name: 'kg' },
        { pk: 'Ton', name: 'Ton' },
        { pk: 'ml', name: 'ml' },
        { pk: 'L', name: 'L' },
      ]
    },
    { key: 'stock', name: '부자재 재고량', formatter: UnitContainer, type: 'selectUnit', placeholder: "0", toFix: 2 },
    { key: 'customer_id', name: '거래처', formatter: SearchModalTest, type: 'customer', placeholder: "-" },
  ],
  mold: [
    { key: 'customer_id', },
    { key: 'cm_id', },
    { key: 'code', },
    { key: 'name', },
    { key: 'seq', },
    { key: 'process_id', },
    { key: 'mold_name' },
    { key: 'cavity', },
    { key: 'spm', editor: TextEditor },
    { key: 'slideHeight', editor: TextEditor },
    { key: 'limit', editor: TextEditor },
    { key: 'inspect', editor: TextEditor },
    { key: 'current', editor: TextEditor },

  ],
  moldV2: [
    { key: 'code', name: 'CODE', editor: TextEditor, formatter: PlaceholderBox, placeholder: 'CODE 입력', headerRenderer: HeaderSort, sortOption: "none", sorts: {} },
    { key: 'name', name: '금형명', editor: TextEditor, formatter: PlaceholderBox, placeholder: '금형명 입력' },
    { key: 'cavity', name: '캐비티', editor: TextEditor, formatter: UnitContainer, unitData: 'EA', placeholder: '1', inputType: 'number', toFix: 1 },
    { key: 'spm', name: 'SPM', editor: TextEditor, formatter: PlaceholderBox, placeholder: '0', inputType: 'number' },
    { key: 'slideHeight', name: '슬라이드 위치', editor: TextEditor, formatter: PlaceholderBox, placeholder: '0', inputType: 'number' },
    { key: 'limit', name: '최대타수', editor: TextEditor, formatter: PlaceholderBox, placeholder: '타수 입력', inputType: 'number' },
    { key: 'inspect', name: '점검타수', editor: TextEditor, formatter: PlaceholderBox, placeholder: '타수 입력', inputType: 'number' },
    {
      key: 'period', name: '점검주기', editorOptions: { editOnClick: true }, formatter: InputWithDropDown, selectList: [
        { pk: 'day', name: '일' },
        { pk: 'week', name: '주' },
        { pk: 'month', name: '월' },
      ]
    },
    {
      key: 'current', name: '현재타수', formatter: PlaceholderBox,
      placeholder: '-',
      inputType: 'number',
    },
    {
      key: 'product_id', name: '생산품목', formatter: ProductInfoModal, type: "mold",
      headerItems: [[{key: 'code', title:'CODE', infoWidth: 300},{ key: 'name', title: '금형명', infoWidth: 300 }]],unprintable : true
    },
    { key: 'form_id', name: '일상 점검', width: 118, formatter: CellButtonComponent /*FactoryInfoModal*/, type: 'inspection' ,unprintable : true},
  ],
  productprocess: [
    { key: 'customer', name: '거래처명', width: 118 },
    { key: 'model', name: '모델', width: 118 },
    { key: 'code', name: 'CODE', width: 118 },
    { key: 'name', name: '품명', width: 118 },
    { key: 'texture', name: '재질', width: 118 },
    { key: 'seq', name: '공정 순서', width: 118 },
    { key: 'process_id', name: '공정 종류', width: 118, formatter: ProcessSearchModal }, //ProcessSearchModal로 변경
    { key: 'mold_name', name: '금형명', width: 118, editor: TextEditor },
    { key: 'cavity', name: '캐비티', width: 118, editor: TextEditor, formatter: UnitContainer, unitData: 'EA' },
    {
      key: 'last', name: '최종 공정 체크', formatter: DropDownEditor, selectList: [
        { pk: false, name: '-' },
        { pk: true, name: '최종 공정' },
      ], width: 118
    },
    { key: 'wip_name', name: '반제품명', width: 118, editor: TextEditor },
  ],
  additionalItem: [
    { key: 'title', editor: TextEditor, name: "추가 항목명", width: 1290 },
    {
      key: 'moddable', formatter: DropDownEditor, selectList: [
        { unit_id: '0', name: "필요" },
        { unit_id: '1', name: "불필요" }
      ], name: "단위 필요 유무"
    },
    {
      key: 'unit', formatter: DropDownEditor, selectList: [
        { unit_id: '0', name: "개별관리" },
        { unit_id: '1', name: "통일" },
        { unit_id: '2', name: "없음" },
      ], name: "단위 관리"
    },
  ],
  rawin: [
    { key: 'customer_id', frozen: true },
    { key: 'cm_id', searchType: 'rawin', frozen: true },
    { key: 'code', formatter: ProductSearchModal, searchType: 'rawin', frozen: true },
    { key: 'name', frozen: true },
    { key: 'texture', },
    { key: 'depth', formatter: UnitContainer, unitData: 'T' },
    { key: 'width', formatter: UnitContainer, unitData: 'mm' },
    { key: 'height', formatter: UnitContainer, unitData: 'mm' },
    { key: 'type', },
    { key: 'amount', editor: TextEditor, formatter: UnitContainer, unitData: 'kg', searchType: 'rawin' },
    { key: 'date', editor: CalendarBox },
    { key: 'number', editor: TextEditor },
    { key: 'current', },
  ],

  rawstock: [
    { key: 'customer_id', frozen: true },
    { key: 'cm_id', frozen: true },
    { key: 'code', frozen: true },
    { key: 'name', frozen: true },
    { key: 'texture' },
    { key: 'depth', formatter: UnitContainer, unitData: 'T' },
    { key: 'width', formatter: UnitContainer, unitData: 'mm' },
    { key: 'height', formatter: UnitContainer, unitData: 'mm' },
    { key: 'type', },
    { key: 'amount', formatter: UnitContainer, unitData: 'kg', searchType: 'rawin' },
    { key: 'date', },
    { key: 'number' },
    { key: 'blanking', formatter: UnitContainer, unitData: 'EA' },
    { key: 'current', formatter: UnitContainer, unitData: 'kg', searchType: 'rawin', },
    {
      key: 'exhaustion', formatter: DropDownEditor, headerRenderer: HeaderFilter,
      options: [{ status: 0, name: "재고 현황" }, { status: 1, name: "사용 가능" }],
      selectList: [
        { pk: false, name: '-' },
        { pk: true, name: '사용완료' }
      ]
    },
  ],

  rawinV1u: (basicRow, setBasicRow) => ([
    { key: 'rm_id', name: '원자재 CODE', formatter: MultiSelectModal, type: 'rawMaterialImport', searchType: 'rawMaterial', frozen: true, placeholder: '원자재 CODE', noSelect: true,basicRow, setBasicRow },
    { key: 'name', name: '원자재 품명', frozen: true, formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: 'texture', name: '재질', formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: 'depth', name: '두께', formatter: UnitContainer, unitData: 'T', placeholder: '0' },
    { key: 'width', name: '가로(COIL 폭)', formatter: UnitContainer, unitData: 'mm', placeholder: '0' },
    { key: 'height', name: '세로(Feeder)', formatter: UnitContainer, unitData: 'mm', placeholder: '0' },
    { key: 'type', name: '재질 종류', formatter: PlaceholderBox, placeholder: '자동 입력' },
    // { key: 'customer_id', name: '거래처', formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: 'customer_id', name: '거래처', formatter: SearchModalTest, type: 'customer', placeholder: "-" },
    { key: 'expiration', name: '사용 기준일', formatter: UnitContainer, unitData: '일', placeholder: '자동 입력' },
    { key: 'amount', name: '입고량(필수)', editor: TextEditor, formatter: UnitContainer, unitData: 'kg', searchType: 'rawin', placeholder: '0', inputType: 'number' },
    { key: 'date', name: '입고일(필수)', formatter: CalendarBox },
    { key: 'lot_number', name: '원자재 LOT 번호(필수)', editor: TextEditor, formatter: PlaceholderBox, placeholder: 'LOT 입력' },
    { key: 'addRow', name: '행 추가', formatter: AddRowButton, basicRow, setBasicRow  },
  ]),

  rawstockV1u: [
    {key: 'elapsed', name: '경과일', formatter: UseDateCell, width: 118},
    {key: 'rm_id',name:'원자재 CODE', formatter: PlaceholderBox, placeholder: '원자재 CODE', width: 118},
    {key: 'name', name:'원자재 품명', formatter: PlaceholderBox, placeholder:'자동 입력', width: 118},
    {key: 'texture', name:'재질', formatter: PlaceholderBox, placeholder:'자동 입력', width: 118},
    {key: 'depth', name:'두께', formatter: UnitContainer, unitData: 'T', placeholder: '0', width: 118},
    {key: 'width', name:'가로(COIL 폭)', formatter: UnitContainer, unitData: 'mm', placeholder: '0', width: 118 },
    {key: 'height', name:'세로(Feeder)', formatter: UnitContainer, unitData: 'mm', placeholder: '0', width: 118},
    {key: 'type', name:'재질 종류',formatter: PlaceholderBox, placeholder:'자동 입력', width: 118 },
    {key: 'warehousing',name: '입고량', formatter: UnitContainer, unitData: 'kg', searchType: 'rawin', width: 118},
    {key: 'date', name: '입고일', width: 118, headerRenderer: HeaderSort, sortOption: "none",sorts: {} },
    {key: 'lot_number', name: '원자재 LOT 번호', width: 118},
    {key: 'current', name: 'LOT 재고량', formatter: UnitContainer, unitData: 'kg', searchType: 'rawin',width: 118},
    {key: 'customer_id', name: '거래처', width: 118},
    {key: 'expiration', name: '사용 기준일', formatter: UnitContainer, unitData: '일', width: 118},
    {key: 'exhaustion', name: '재고 현황', formatter: CompleteButton, width: 118, beforeEventTitle:'사용 완료', afterEventTitle:'사용 완료 취소'},
    {key: 'export', name: '출고', formatter: ExportButton, width: 118, type: 'rawMaterial', action: 'register'}
  ],

  rawstockModify: [
    { key: 'rm_id', name: '원자재 CODE', formatter: PlaceholderBox, placeholder: '원자재 CODE', width: 118 },
    { key: 'name', name: '원자재 품명', formatter: PlaceholderBox, placeholder: '자동 입력', width: 118 },
    { key: 'texture', name: '원자재 재질', formatter: PlaceholderBox, placeholder: '자동 입력', width: 118 },
    { key: 'depth', name: '두께', formatter: UnitContainer, unitData: 'T', placeholder: '0', width: 118 },
    { key: 'width', name: '가로(COIL 폭)', formatter: UnitContainer, unitData: 'mm', placeholder: '0', width: 118 },
    { key: 'height', name: '세로(Feeder)', formatter: UnitContainer, unitData: 'mm', placeholder: '0', width: 118 },
    { key: 'type', name: '재질 종류', formatter: PlaceholderBox, placeholder: '자동 입력', width: 118 },
    { key: 'customer_id', name: '거래처', formatter: SearchModalTest, type: 'customer', placeholder: "-" , width: 118},
    { key: 'expiration', name: '사용 기준일', formatter: UnitContainer, unitData: '일', width: 118 },
    { key: 'warehousing', name: '입고량', editor: TextEditor, formatter: UnitContainer, unitData: 'kg', searchType: 'rawin', width: 118 },
    { key: 'date', name: '입고일', formatter: CalendarBox, width: 118 },
    { key: 'lot_number', name: '원자재 LOT 번호', editor: TextEditor, width: 118 },
    // {key: 'exhaustion', formatter: DropDownEditor, width: 118, name: '재고 현황' ,
    //   selectList: [
    //     {pk: false, name: '-'},
    //     {pk: true, name: '사용완료'}
    //   ]},
  ],

  rawstockExport: [
    {key: 'rm_id',name:'원자재 CODE', formatter: PlaceholderBox, placeholder: '원자재 CODE', width: 118},
    {key: 'name', name:'원자재 품명', formatter: PlaceholderBox, placeholder:'자동 입력', width: 118},
    {key: 'texture', name:'재질', formatter: PlaceholderBox, placeholder:'자동 입력', width: 118},
    {key: 'depth', name:'두께', formatter: UnitContainer, unitData: 'T', placeholder: '0', width: 118},
    {key: 'width', name:'가로(COIL 폭)', formatter: UnitContainer, unitData: 'mm', placeholder: '0', width: 118 },
    {key: 'height', name:'세로(Feeder)', formatter: UnitContainer, unitData: 'mm', placeholder: '0', width: 118},
    {key: 'type', name:'재질 종류',formatter: PlaceholderBox, placeholder:'자동 입력', width: 118 },
    {key: 'export_count',name: '출고량', formatter: UnitContainer, unitData: 'kg', searchType: 'rawin', width: 118},
    {key: 'date', name: '출고일', width: 118, headerRenderer: HeaderSort, sortOption: "none",sorts: {} },
    {key: 'export_type', name: '출고 구분', formatter: PlaceholderBox, width: 118},
    {key: 'lot_number', name: '원자재 LOT 번호', width: 118},
    {key: 'current', name: 'LOT 재고량', formatter: UnitContainer, unitData: 'kg', searchType: 'rawin',width: 118},
    {key: 'customer_id', name: '거래처', formatter: PlaceholderBox, placeholder:"-", width: 118},
    {key: 'remark', name: '비고', formatter: PlaceholderBox, overlay:true, placeholder:"-", width: 118},
    {key: 'cancel', name: '출고 취소', formatter: CompleteButton, width: 118, beforeEventTitle:'출고 취소'},
    {key: 'export', name: '수정', formatter: ExportButton, width: 118, type: 'rawMaterial', action: 'modify'}
  ],

  subinV1u: (basicRow, setBasicRow) => ([
    { key: 'wip_id', name: '부자재 CODE', formatter: MultiSelectModal, type: 'subMaterialImport', searchType: 'subMaterial', frozen: true, placeholder: '부자재 CODE', noSelect: true, basicRow, setBasicRow },
    { key: 'name', name: '부자재 품명', frozen: true, formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: 'unit', name: '단위', formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: 'customer_id', name: '거래처', formatter: SearchModalTest, type: 'customer', placeholder: "-" },
    { key: 'warehousing', name: '입고량(필수)', editor: TextEditor, formatter: UnitContainer, unitData: '', placeholder: '0', inputType: 'number' },
    { key: 'date', name: '입고일(필수)', formatter: CalendarBox },
    { key: 'lot_number', name: '부자재 LOT 번호(필수)', editor: TextEditor, formatter: PlaceholderBox, placeholder: 'LOT 입력' },
  ]),

  substockV1u: [
    {key: 'wip_id',name:'부자재 CODE', formatter: PlaceholderBox, placeholder: '부자재 CODE', width: 118},
    {key: 'name', name:'부자재 품명', formatter: PlaceholderBox, placeholder:'자동 입력', width: 118},
    {key: 'unit', name:'단위', formatter: PlaceholderBox, placeholder:'자동 입력', width: 118},
    {key: 'customer_id', name:'거래처', width: 118},
    {key: 'warehousing',name: '입고량', searchType: 'rawin', width: 118},
    {key: 'date', name: '입고일', width: 118, headerRenderer: HeaderSort, sortOption: "none",sorts: {} },
    {key: 'lot_number', name: '부자재 LOT 번호', width: 118},
    {key: 'current', name: 'LOT 재고량', width: 118},
    {key: 'export', name: '출고', formatter: ExportButton, width: 118, type: 'subMaterial', action: 'register'}
  ],

  substockModify: [
    { key: 'wip_id', name: '부자재 CODE', formatter: PlaceholderBox, placeholder: '원자재 CODE', width: 118 },
    { key: 'name', name: '부자재 품명', formatter: PlaceholderBox, placeholder: '자동 입력', width: 118 },
    { key: 'unit', name: '단위', formatter: PlaceholderBox, placeholder: '자동 입력', width: 118 },
    { key: 'customer_id', name: '거래처', formatter: SearchModalTest, type: 'customer', placeholder: "-" , width: 118},
    { key: 'warehousing', name: '입고량', editor: TextEditor, width: 118 },
    { key: 'date', name: '입고일', formatter: CalendarBox, width: 118 },
    { key: 'lot_number', name: '부자재 LOT 번호', editor: TextEditor, width: 118 },
  ],

  substockExport: [
    {key: 'wip_id',name:'부자재 CODE', formatter: PlaceholderBox, placeholder: '부자재 CODE', width: 118},
    {key: 'name', name:'부자재 품명', formatter: PlaceholderBox, placeholder:'자동 입력', width: 118},
    {key: 'unit', name:'단위', formatter: PlaceholderBox, placeholder:'자동 입력', width: 118},
    {key: 'customer_id', name:'거래처', width: 118},
    {key: 'export_count',name: '출고량', searchType: 'rawin', width: 118},
    {key: 'date', name: '입고일', width: 118, headerRenderer: HeaderSort, sortOption: "none",sorts: {} },
    {key: 'export_type', name: '출고 타입', width: 118},
    {key: 'lot_number', name: '부자재 LOT 번호', width: 118},
    {key: 'current', name: 'LOT 재고량', width: 118},
    {key: 'remark', name: '비고', width: 118, formatter: PlaceholderBox, overlay:true, placeholder:"-"},
    {key: 'cancel', name: '출고 취소', formatter: CompleteButton, width: 118, beforeEventTitle:'출고 취소'},
    {key: 'export', name: '수정', formatter: ExportButton, width: 118, type: 'subMaterial', action: 'modify'}
  ],

  baseItem: [
    { key: 'title', editor: TextEditor, name: "기본 항목명" },
  ],
  pause: [
    { key: 'name', formatter: OnClickContainer }
  ],
  pauseReason: (rows?, setRows?) => ([
    { key: 'seq', name: "순번", width: 80 },
    { key: 'reason', name: "일시정지 유형", width: 500, editor: TextEditor },
    { key: 'moveButtons', width: 200, formatter: MoveButtons, rows, setRows },
  ]),
  defect: [
    { key: 'name', formatter: OnClickContainer }
  ],
  defectReason: (rows?, setRows?) => ([
    { key: 'seq', name: "순번", width: 80 },
    { key: 'reason', name: "불량 유형", width: 500, editor: TextEditor },
    { key: 'moveButtons', width: 200, formatter: MoveButtons, rows, setRows },
  ]),
  stock: [
    { key: 'customer_id' },
    { key: 'customer_name' },
    { key: 'cm_id', },
    { key: 'code', },
    { key: 'name', },
    { key: 'unused', formatter: UnitContainer, unitData: 'kg' },
    { key: 'wip', formatter: UnitContainer, unitData: 'EA' },
    { key: 'current_stock', formatter: UnitContainer, unitData: 'EA' },
    { key: 'expectation', formatter: UnitContainer, unitData: 'EA' },
    { key: 'inverse_expectation', formatter: UnitContainer, unitData: 'EA' },
  ],
  stockProduct: [
    { key: 'customer_name', name: "거래처명" },
    { key: 'customer_model', name: "모델" },
    { key: 'code', name: "CODE" },
    { key: 'name', name: "품명" },
  ],
  stockDate: [
    { key: 'title', name: "생산/납품" },
  ],
  workStandardList: [
    { key: 'customer', name: '거래처', width: 120 },
    { key: 'model', name: '모델', width: 240 },
    { key: 'code', name: 'CODE', width: 464 },
    { key: 'material_name', name: '품명', width: 464 },
    {
      key: 'type', name: '품목 종류', width: 120, selectList: [
        { pk: '0', name: '반제품' },
        { pk: '1', name: '재공품' },
        { pk: '2', name: '완제품' },
      ]
    },
    { key: 'work_standard_image', name: '작업 표준서', formatter: FileEditer, type: "image", readonly: true, width: 120 ,unprintable : true},
  ],
  midrange: [
    {
      key: 'samples', name: '시료 개수 선택 (최소 1 ~ 최대 10개)', formatter: DropDownEditor, selectList: [
        { pk: 'one', name: 1 },
        { pk: 'two', name: 2 },
        { pk: 'three', name: 3 },
        { pk: 'four', name: 4 },
        { pk: 'five', name: 5 },
        { pk: 'six', name: 6 },
        { pk: 'seven', name: 7 },
        { pk: 'eight', name: 8 },
        { pk: 'nine', name: 9 },
        { pk: 'ten', name: 10 },
      ]
    }
  ],
  midrangeDetail: [
    { key: 'samples', name: '시료 개수 선택 (최소 1 ~ 최대 10개)' }
  ],
  midrangeExam: [
    { key: 'customer', name: '거래처', width: 240 },
    { key: 'model', name: '모델', width: 424 },
    { key: 'code', name: 'CODE', width: 432 },
    { key: 'material_name', name: '품명', width: 360 },
    { key: 'type', name: '품목 종류', width: 120 },
  ],
  midrangeExamDetail: [
    { key: 'customer', name: '거래처', width: 240 },
    { key: 'model', name: '모델', width: 424 },
    { key: 'code', name: 'CODE', width: 432 },
    { key: 'material_name', name: '품명', width: 360 },
    { key: 'type', name: '품목 종류', width: 120 },
  ],
  midrangeLegendary: [
    {key: "sequence", name: '구분', formatter: PlaceholderBox, width:48},
    {key: 'legendary', name: '범례', formatter: PlaceholderBox, width:908 , placeholder: '범례 입력', editor: TextEditor},
    {key: 'LegendaryExplain', name: '범례 설명',  formatter: PlaceholderBox, width:588, placeholder: '범례 설명 입력', editor: TextEditor},
  ],
  midrangeLegendaryDetail: [
    { key: 'legendary', name: '범례', width: 968, },
    { key: 'LegendaryExplain', name: '범례 설명', width: 608 },
  ],
  midrangeInspectionItem: [
    {key: "sequence", name: '구분', formatter: PlaceholderBox, width: 48,},
    {key: 'name', name: '검사 항목',width: 480, formatter: PlaceholderBox, placeholder: '검사 항목 입력', editor: TextEditor},
    {key: 'unit', name: '단위', width: 80, formatter: DropDownEditor, selectList: [
        {pk: 'mm', name: 'mm'},
        {pk: 'cm', name: 'cm'},
        {pk: 'm', name: 'm'},
        {pk: 'EA', name: 'EA'},
        {pk: 'g', name: 'g'},
        {pk: 'kg', name: 'kg'},
        {pk: 'Ton', name: 'Ton'},
        {pk: 'ml', name: 'ml'},
        {pk: 'L', name: 'L'},
        {pk: 'phi', name: 'phi(내경)'},
      ]},
    {key: 'standard', name: '점검 기준', width: 384, placeholder: '점검 기준 입력', editor: TextEditor, formatter: PlaceholderBox,},
    {key: 'error_minimum', name: '최소값(오차범위 최소)', width: 216, formatter: UnitContainer, placeholder: '최소값 입력',editor: TextEditor, inputType:'number'},
    {key: 'error_maximum', name: '최대값(오차범위 최대)', width: 216, formatter: UnitContainer, placeholder: '최대값 입력',editor: TextEditor, inputType:'number'},
    {key: 'type', name: '기록 방법', width: 118, formatter: DropDownEditor, selectList: [
        {pk: '0', name: '수치 입력'},
        {pk: '1', name: '범례 적용'},
      ] },
  ],
  midrangeInspectionItemDetail: [
    { key: 'name', name: '검사 항목', width: 480, },
    { key: 'unit', name: '단위', width: 120, },
    { key: 'standard', name: '점검 기준', width: 424, },
    { key: 'error_minimum', name: '최소값(오차범위 최소)', width: 216 },
    { key: 'error_maximum', name: '최대값(오차범위 최대)', width: 216, },
    { key: 'type', name: '기록 방법', width: 120 },
  ],
  midrangeList: [
    { key: 'contract_id', name: '수주 번호', width: 120 },
    { key: 'identification', name: '지시 고유 번호', width: 120 },
    { key: 'code', name: 'CODE', width: 120 },
    { key: 'name', name: '품명', width: 120 },
    {
      key: 'type', name: '품목 종류', width: 120, selectList: [
        { pk: '0', name: '반제품' },
        { pk: '1', name: '재공품' },
        { pk: '2', name: '완제품' },
      ]
    },
    { key: 'unit', name: '단위', width: 120 },
    { key: 'process_id', name: '생산 공정', width: 120 },
    { key: 'lot_number', name: 'LOT 번호', width: 120 },
    { key: 'worker', name: '작업자', width: 120 },
    { key: 'start', name: '작업 시작 일시', width: 164 },
    { key: 'end', name: '작업 종료 일시', width: 164 },
    { key: 'sic_id', name: '초ㆍ중ㆍ종 검사', width: 120, formatter: MidrangeFrameButton , unprintable : true}
  ],
  qualityDefectTop: [
    { key: 'customer', name: '거래처명', searchType: 'rawin', formatter: PlaceholderBox, placeholder: '자동입력' },
    { key: 'model', name: '모델', searchType: 'rawin', formatter: PlaceholderBox, placeholder: '자동입력' },
    { key: 'code', name: 'CODE', formatter: SearchModalTest, type: 'product', noSelect: true },
    { key: 'name', name: '품명', formatter: PlaceholderBox, placeholder: '자동입력' },
  ],
  qualityDefectContents: [
    { key: 'process_id', name: '공정명', width: 220 },
    { key: 'reason', name: '불량 유형', width: 550 },
    {
      key: 'amount', name: '개수', width: 250, headerRenderer: HeaderFilter,
      options: [{ status: 0, name: "개수" }, { status: 1, name: "개수 많은순" }, { status: 2, name: "개수 적은순" }],
    },
  ],
  // delivery: [
  //   {key:"customer_id", name:"거래처명",   },
  //   {key:"cm_id", name:"모델",  },
  //   {key:"code", name:"CODE", formatter: /*ProductSearchModal*/ MultipleSelectModal},
  //   {key:"name", name:"품명"},
  //   {key:"date", name:"납품 날짜", editor: CalendarBox, maxDate:true},
  //   {key:"amount", name:"납품 개수", editor: TextEditor, formatter: UnitContainer, unitData: 'EA'},
  // ],
  operationCodeRegisterV2: [
    { key: "contract_id", name: "수주 번호", type: 'order', formatter: PlaceholderBox, placeholder: '-', disableType: "true", width: 118 },
    { key: "date", name: "지시 날짜", formatter: CalendarBox, width: 118, type: 'date' , dependency : 'deadline'},
    { key: "deadline", name: "작업 기한", formatter: CalendarBox, width: 118, type: 'deadline' },
    { key: "customer_id", name: "거래처", formatter: PlaceholderBox, placeholder: '자동입력', type: 'autoInput', width: 118 },
    { key: "cm_id", name: "모델", formatter: PlaceholderBox, placeholder: '자동입력', type: 'autoInput', width: 118 },
    { key: "product_id", name: "CODE", formatter: SearchModalTest, type: 'product', placeholder: '검색', disableType: "true", width: 118, noSelect: true },
    { key: "name", name: "품명", formatter: PlaceholderBox, placeholder: '자동입력', type: 'autoInput', width: 118 },
    { key: "type", name: "품목 종류", formatter: PlaceholderBox, placeholder: '자동입력', type: 'autoInput', width: 118 },
    { key: "unit", name: "단위", formatter: PlaceholderBox, placeholder: '자동입력', type: 'autoInput', width: 118 },
    { key: "process_id", name: "생산 공정", formatter: PlaceholderBox, placeholder: '자동입력', type: 'autoInput', width: 118 },
    { key: "goal", name: "목표 생산량", editor: TextEditor, formatter: PlaceholderBox, placeholder: '0', width: 118, inputType: 'number' },
    { key: 'input', name: '자재 선택', formatter: BomRegisterModal, width: 118 },
  ],
  operationIdentificationRegisterV2: [
    { key: "contract_id", name: "수주 번호", formatter: SearchModalTest, type: 'order', placeholder: '검색', disableType: "true", width: 118, noSelect: true },
    { key: "date", name: "지시 날짜", formatter: CalendarBox, width: 118 , dependency : 'deadline'},
    { key: "deadline", name: "작업 기한", formatter: CalendarBox, width: 118 },
    { key: "customer_id", name: "거래처", formatter: PlaceholderBox, placeholder: '자동입력', type: 'autoInput', width: 118 },
    { key: "cm_id", name: "모델", formatter: PlaceholderBox, placeholder: '자동입력', type: 'autoInput', width: 118 },
    { key: "product_id", name: "CODE", type: 'product', formatter: PlaceholderBox, placeholder: '-', disableType: "true", width: 118 },
    { key: "name", name: "품명", formatter: PlaceholderBox, placeholder: '자동입력', type: 'autoInput', width: 118 },
    { key: "type", name: "품목 종류", formatter: PlaceholderBox, placeholder: '자동입력', type: 'autoInput', width: 118 },
    { key: "unit", name: "단위", formatter: PlaceholderBox, placeholder: '자동입력', type: 'autoInput', width: 118 },
    { key: "process_id", name: "생산 공정", formatter: PlaceholderBox, placeholder: '자동입력', type: 'autoInput', width: 118 },
    { key: "goal", name: "목표 생산량", editor: TextEditor, formatter: PlaceholderBox, placeholder: '0', width: 118, inputType: 'number' },
    { key: 'input', name: '자재 선택', formatter: BomRegisterModal, width: 118 },
  ],
  operationListV2: [
    { key: "status", name: "상태", width: 118 },
    { key: "contract_id", name: "수주 번호", width: 118 },
    { key: "identification", name: "지시 고유 번호", width: 118 },
    { key: "date", name: "지시 날짜", width: 118, headerRenderer: HeaderSort, sortOption: "none", sorts: {} },
    { key: "deadline", name: "작업 기한", width: 118, headerRenderer: HeaderSort, sortOption: "none", sorts: {} },
    { key: "customer_id", name: "거래처", width: 118 },
    { key: "cm_id", name: "모델", width: 118 },
    { key: "product_id", name: "CODE", width: 118 },
    { key: "name", name: "품명", width: 118 },
    { key: "type", name: "품목 종류", width: 118 },
    { key: "unit", name: "단위", width: 118 },
    { key: "process_id", name: "생산 공정", width: 118 },
    { key: "goal", name: "목표 생산량", width: 118 },
    { key: 'input', name: '투입 자재', formatter: InputMaterialInfoModal, width: 118, type: 'readonly',unprintable : true },
    { key: 'route_record_register', name: '작업 일보 등록', formatter: WorkRegisterModal, width: 118 ,unprintable : true},
    { key: 'route_record_list', name: '작업 이력', formatter: WorkListModal, width: 118, modalInitData: BomRegisterInit ,unprintable : true},
    { key: 'total_counter', name: '총 카운터', width: 118 },
    { key: 'total_good_quantity', name: '총 양품 수량', width: 118 },
    { key: 'total_poor_quantity', name: '총 불량 수량', width: 118, formatter: DefectInfoModal, type: 'readonly', load: 'sheet' },
    { key: 'force_kill', name: '작업완료 처리', formatter: FinishButton, width: 118 ,unprintable : true},
  ],
  operationModifyV2: [
    { key: "contract_id", name: "수주 번호", width: 118 },
    { key: "identification", name: "지시 고유 번호", width: 118 },
    { key: "date", name: "지시 날짜", formatter: CalendarBox, width: 118, type: 'date' , dependency : 'deadline'},
    { key: "deadline", name: "작업 기한", formatter: CalendarBox, width: 118, type: 'deadline' },
    { key: "customer_id", name: "거래처", formatter: PlaceholderBox, placeholder: '자동입력', width: 118, type: 'autoInput' },
    { key: "cm_id", name: "모델", formatter: PlaceholderBox, placeholder: '자동입력', width: 118, type: 'autoInput' },
    { key: "product_id", name: "CODE", formatter: SearchModalTest, type: 'product', placeholder: '검색', width: 150, disableType: "true" },
    { key: "name", name: "품명", formatter: PlaceholderBox, placeholder: '자동입력', width: 120, type: 'autoInput' },
    { key: "type", name: "품목 종류", formatter: PlaceholderBox, placeholder: '자동입력', width: 118, type: 'autoInput' },
    { key: "unit", name: "단위", formatter: PlaceholderBox, placeholder: '자동입력', width: 118, type: 'autoInput' },
    { key: "process_id", name: "생산 공정", formatter: PlaceholderBox, placeholder: '자동입력', width: 118, type: 'autoInput' },
    { key: "goal", name: "목표 생산량", editor: TextEditor, formatter: PlaceholderBox, width: 118, placeholder: '0' },
    { key: 'input', name: '자재 선택', formatter: BomRegisterModal, width: 118 },
  ],
  recordListV2: [
    { key: "contract_id", name: "수주 번호", width: 118 },
    { key: "identification", name: "지시 고유 번호", width: 118 },
    { key: "date", name: "지시 날짜", formatter: CalendarBox, width: 118 , dependency : 'deadline'},
    { key: "deadline", name: "작업 기한", formatter: CalendarBox, width: 118 },
    { key: "customer_id", name: "거래처", formatter: PlaceholderBox, placeholder: '자동입력', type: 'autoInput', width: 118 },
    { key: "cm_id", name: "모델", formatter: PlaceholderBox, placeholder: '자동입력', type: 'autoInput', width: 118 },
    { key: "product_id", name: "CODE", formatter: SearchModalTest, type: 'product', placeholder: '검색', disableType: "true", width: 118 },
    { key: "name", name: "품명", formatter: PlaceholderBox, placeholder: '자동입력', type: 'autoInput', width: 118 },
    { key: "type", name: "품목 종류", formatter: PlaceholderBox, placeholder: '자동입력', type: 'autoInput', width: 118 },
    { key: "unit", name: "단위", formatter: PlaceholderBox, placeholder: '자동입력', type: 'autoInput', width: 118 },
    { key: "process_id", name: "생산 공정", formatter: PlaceholderBox, placeholder: '자동입력', type: 'autoInput', width: 118 },
    { key: "goal", name: "목표 생산량", editor: TextEditor, formatter: PlaceholderBox, placeholder: '0' },
    { key: 'input', name: '자재 선택', formatter: BomRegisterModal, width: 118 },
    { key: "customer_id", name: "거래처", width: 118 },
    { key: "lot_number", name: "LOT 번호", width: 118 },
    { key: "worker", name: "작업자", width: 118 },
    { key: "start", name: "작업 시작 일시", width: 118 },
    {
      key: "end", name: "작업 종료 일시", width: 118, headerRenderer: HeaderFilter,
      options: [{ status: "none", name: "작업 종료 일시" }, { status: 'ASC', name: "오름차순" }, { status: 'DESC', name: "내림차순" }],
      selectList: [{ status: "none", name: "작업 종료 일시" }, { status: 'ASC', name: "오름차순" }, { status: 'DESC', name: "내림차순" }],
    },
    { key: "paused_time", name: "일시 정지 시간", formatter: PauseInfoModal, type: 'readonly', modalType: false, width: 118 },
    { key: "good_quantity", name: "양품 수량", width: 118 },
    { key: "poor_quantity", name: "불량 수량", formatter: DefectInfoModal, type: 'readonly', width: 118 },
    { key: "uph", name: "UPH", width: 118 },
    { key: 'input', name: '투입 자재', formatter: LotInputInfoModal, width: 118, readonly: true },
    { key: 'mold_id', name: '금형', formatter: MoldListModal, width: 118, modalInitData: BomRegisterInit },
    { key: 'tool_id', name: '공구', formatter: ToolListModal, width: 118, modalInitData: BomRegisterInit },
    { key: 'machine_id', name: '기계', formatter: MachineListModal, width: 118, modalInitData: BomRegisterInit },
  ],
  cncRecordListV2: [
    { key: "contract_id", name: "수주 번호", width: 118 },
    { key: "identification", name: "지시 고유 번호", width: 118 },
    { key: "product_id", name: "CODE", width: 118 },
    { key: "name", name: "품명", width: 118 },
    { key: "type", name: "품목 종류", width: 118 },
    { key: "unit", name: "단위", width: 118 },
    { key: "process_id", name: "생산 공정", width: 118 },
    { key: "lot_number", name: "LOT 번호", width: 118 },
    { key: "worker", name: "작업자", width: 118 },
    { key: "start", name: "작업 시작 일시", width: 118 },
    { key: "end", name: "작업 종료 일시", width: 118, headerRenderer: HeaderSort, sortOption: "none", sorts: {} },
    { key: "paused_time", name: "일시 정지 시간", formatter: PauseInfoModal, type: 'readonly', modalType: false, width: 118 },
    { key: "good_quantity", name: "양품 수량", width: 118 },
    { key: "poor_quantity", name: "불량 수량", formatter: DefectInfoModal, type: 'readonly', width: 118 },
    { key: "sic_id", name: "초ㆍ중ㆍ종 검사", width: 118, formatter: MidrangeFrameButton ,unprintable : true},
    { key: "uph", name: "UPH", width: 118 },
    { key: 'input', name: '투입 자재', formatter: LotInputInfoModal, width: 118, readonly:true ,unprintable : true},
    { key: 'mold_id', name: '금형', formatter: MoldListModal, width: 118, modalInitData: BomRegisterInit ,unprintable : true},
    { key: 'tool_id', name: '공구', formatter: ToolListModal, width: 118, modalInitData: BomRegisterInit ,unprintable : true},
    { key: 'machine_id', name: '기계', formatter: MachineListModal, width: 118, modalInitData: BomRegisterInit ,unprintable : true},
  ],
  finishListV2: [
    { key: "status", name: "상태", formatter: FinishCancelButton, width: 118 ,unprintable : true},
    { key: "contract_id", name: "수주 번호", width: 118 },
    { key: "identification", name: "지시 고유 번호", width: 118 },
    { key: "date", name: "지시 날짜", width: 118, headerRenderer: HeaderSort, sortOption: "none", sorts: {} },
    { key: "deadline", name: "작업 기한", width: 118, headerRenderer: HeaderSort, sortOption: "none", sorts: {} },
    { key: "customer_id", name: "거래처", width: 118 },
    { key: "cm_id", name: "모델", width: 118 },
    { key: "product_id", name: "CODE", width: 118 },
    { key: "name", name: "품명", width: 118 },
    { key: "type", name: "품목 종류", width: 118 },
    { key: "unit", name: "단위", width: 118 },
    { key: "process_id", name: "생산 공정", width: 118 },
    { key: "goal", name: "목표 생산량", width: 118 },
    { key: 'input', name: '투입 자재', formatter: InputMaterialInfoModal, width: 118, type: 'readonly' ,unprintable : true},
    { key: 'route_record_list', name: '작업 이력', formatter: WorkListModal, width: 118, modalInitData: BomRegisterInit ,unprintable : true},
    { key: 'total_counter', name: '총 카운터', width: 118 },
    { key: 'total_good_quantity', name: '총 양품 수량', width: 118 },
    { key: 'total_poor_quantity', name: '총 불량 수량', width: 118, formatter: DefectInfoModal, type: 'readonly', load: 'sheet' },
    { key: "avg_uph", name: "총 UPH", width: 118 },
  ],
  stockV2 : [
    { key: 'expanded' , name : '' , minWidth : 30 , width : 30 ,
      colSpan(args) {
        return args.row?.rowType === 'DETAIL' ? 12 : undefined;
      },
      cellClass(args){
        return args.rowType === 'DETAIL' ? 'detail': undefined;
      },
      formatter : DetailFormatter
    },
    { key: "customer_name", name: "거래처", width: 118 },
    { key: "customer_model", name: "모델", width: 118 },
    { key: "code", name: "CODE", width: 250 },
    { key: "name", name: "품명", width: 450 },
    { key: "type", name: "품목 종류", width: 118, headerRenderer: HeaderFilter,
      options: [
        {status: undefined, name: '품목 종류'},
        {status: '0', name: '반제품'},
        {status: '1', name: '재공품'},
        {status: '2', name: '완제품'}
      ]},
    { key: "unit", name: "단위", width: 118 },
    { key: 'bom', name: 'BOM', formatter: BomInfoModal, width: 118, type: 'readonly' ,unprintable : true},
    { key: 'lot_number', name: 'LOT별 재고', formatter: LotInfoModal, width: 118, type: 'readonly' ,unprintable : true},
    { key: "stock", name: "재고량", width: 118 },
    { key: "basic_stock", name: "기존 재고", width: 118, editor: TextEditor, inputType: 'number' },
    { key: "stock_adjust", name: "재고 조정", width: 118, formatter: AdjustQuantityModal, modalTitle: '재고 조정' },
  ],

  stockAdjustList: [
    { key: "customer_name", name: "거래처" },
    { key: "customer_model", name: "모델" },
    { key: "product_id", name: "CODE"},
    { key: "name", name: "품명"},
    { key: "worker", name: "작업자"},
    { key: "date", name: "조정 날짜"},
    { key: "adjust_stock", name: "조정 수량"},
    { key: 'lot_number', name: 'LOT 보기', formatter: AdjustLotInfo, width: 118,unprintable : true},
  ],

  stockDetail : [
    { key : 'type' , name : '구분', width: 15 },
    { key : 'productType' , name : '품목 종류', width: 15},
    { key : 'customer_name' , name : '거래처', width: 118 },
    { key : 'customer_model' , name : '모델', width: 118},
    { key : 'code' , name : 'CODE', width: 118},
    { key : 'stock' , name : '재고',width: 118 },
    { key : 'totalWeight' , name : '총중량',width: 118},
  ],

  orderRegister: (basicRow?, setBasicRow?) => ([
    { key: "date", name: "수주 날짜", formatter: CalendarBox, width: 118, type: "date", dependency : 'deadline'},
    { key: "deadline", name: "납품 기한", formatter: CalendarBox, width: 118, type: "deadline"},
    { key: "product_id", name: "CODE", width: 118, formatter: MultiSelectModal, type: 'orderRegister', searchType: 'product', basicRow, setBasicRow},
    {key: 'customer_id', name: '거래처', formatter: SearchModalTest, type: 'customer', placeholder: '-',width: 118},
    {key: 'cm_id', name: '모델', formatter: SearchModalTest, type: 'customerModel', placeholder: '-',width: 118},
    { key: "name", name: "품명", width: 118, formatter: PlaceholderBox, placeholder: '자동입력' },
    { key: "type", name: "품목 종류", width: 118, formatter: PlaceholderBox, placeholder: '자동입력' },
    { key: "unit", name: "단위", width: 118, formatter: PlaceholderBox, placeholder: '자동입력' },
    { key: "amount", name: "수주량", width: 118, editor: TextEditor, formatter: PlaceholderBox, placeholder: 0, inputType: 'number' },
  ]),

  orderList: [
    { key: "identification", name: "수주 번호", width: 118 },
    { key: "date", name: "수주 날짜", width: 118, headerRenderer: HeaderSort, sortOption: "none", sorts: {} },
    { key: "deadline", name: "납품 기한", width: 118, headerRenderer: HeaderSort, sortOption: "none", sorts: {} },
    { key: "product_id", name: "CODE", width: 118, formatter: PlaceholderBox, placeholder: '자동입력' },
    { key: "customer_id", name: "거래처", width: 118, formatter: PlaceholderBox, placeholder: '자동입력' },
    { key: "cm_id", name: "모델", width: 118, formatter: PlaceholderBox, placeholder: '자동입력' },
    { key: "name", name: "품명", width: 118, formatter: PlaceholderBox, placeholder: '자동입력' },
    { key: "type", name: "품목 종류", width: 118, formatter: PlaceholderBox, placeholder: '자동입력' },
    { key: "unit", name: "단위", width: 118, formatter: PlaceholderBox, placeholder: '자동입력' },
    { key: "amount", name: "수주량", width: 118, formatter: PlaceholderBox, placeholder: '자동입력' },
    { key: "operation_sheet_list", name: "작업 지시 목록", width: 118, formatter: OperationInfoModal ,unprintable : true},
    { key: "route_sheet_register", name: "작업 지시 등록", width: 118, formatter: OperationInfoModal, type: "register" ,unprintable : true},
    { key: "shipment_id", name: "납품 수량", width: 118, formatter: DeliveryInfoModal },
    { key: "route_shipment_register", name: "납품 등록", width: 118, formatter: OrderRegisterButton, title: '납품 등록', url: '/mes/delivery/register',unprintable : true },
  ],
  orderModify: [
    { key: "identification", name: "수주 번호", width: 118 },
    { key: "date", name: "수주 날짜", formatter: CalendarBox, width: 118, type: "date" , dependency : 'deadline'},
    { key: "deadline", name: "납품 기한", formatter: CalendarBox, width: 118, type: "deadline" },
    { key: "product_id", name: "CODE", width: 118 },
    {key: 'customer_id', name: '거래처', formatter: SearchModalTest, type: 'customer', placeholder: '-' , width: 118},
    {key: 'cm_id', name: '모델', formatter: SearchModalTest, type: 'customerModel', placeholder: '-' , width: 118},
    { key: "name", name: "품명", width: 118 },
    { key: "type", name: "품목 종류", width: 118 },
    { key: "unit", name: "단위", width: 118 },
    { key: "amount", name: "수주량", width: 118, editor: TextEditor },
    // {key:"route_operation_register", name:"지시 고유 번호", width: 118,},
    { key: "shipment_id", name: "납품 수량", width: 118, },
  ],
  deliveryCodeRegister: (basicRow,setBasicRow) => ([
    {key:"contract_id", name:"수주 번호", width: 118, formatter: PlaceholderBox, type: 'order', placeholder:"-"},
    {key:"product_id", name:"CODE", width: 118, formatter: MultiSelectModal, searchType: 'product', type : 'deliveryRegister',basicRow, setBasicRow},
    {key:'customer_id', name: '거래처', formatter: SearchModalTest, type: 'customer', placeholder: '-',width: 118},
    {key:'cm_id', name: '모델', formatter: SearchModalTest, type: 'customerModel', placeholder: '-',width: 118},
    {key:"name", name:"품명", width: 118 , formatter: PlaceholderBox, placeholder: '자동입력'  },
    {key:"type", name:"품목 종류", width: 118, formatter: PlaceholderBox, placeholder: '자동입력'   },
    {key:"unit", name:"단위", width: 118 , formatter: PlaceholderBox, placeholder: '자동입력'  },
    {key:"date", name:"납품 날짜", width: 118, formatter: CalendarBox},
    {key:"lot_number", name:"LOT 선택", width: 118, formatter: LotDeliveryInfoModal, searchType: 'code'},
    {key:"amount", name:"총 납품 수량", width: 118, formatter: PlaceholderBox, placeholder: '0', type:"placeholder" },
  ]),
  deliveryIdentificationRegister: (basicRow,setBasicRow) => ([
    { key: "contract_id", name: "수주 번호", width: 118, formatter: MultiSelectModal, searchType: 'order', type : 'deliveryRegister',basicRow, setBasicRow},
    { key: 'customer_id', name: '거래처', formatter: SearchModalTest, type: 'customer', placeholder: '-',width: 118},
    { key: 'cm_id', name: '모델', formatter: SearchModalTest, type: 'customerModel', placeholder: '-',width: 118},
    // { key: "customer_id", name: "거래처", width: 118, formatter: PlaceholderBox, placeholder: '자동입력' },
    // { key: "cm_id", name: "모델", width: 118, formatter: PlaceholderBox, placeholder: '자동입력' },
    { key: "product_id", name: "CODE", width: 118, formatter: PlaceholderBox, type: 'product', placeholder: "자동입력" },
    { key: "name", name: "품명", width: 118, formatter: PlaceholderBox, placeholder: '자동입력' },
    { key: "type", name: "품목 종류", width: 118, formatter: PlaceholderBox, placeholder: '자동입력' },
    { key: "unit", name: "단위", width: 118, formatter: PlaceholderBox, placeholder: '자동입력' },
    { key: "date", name: "납품 날짜", width: 118, formatter: CalendarBox},
    { key: "lot_number", name: "LOT 선택", width: 118, formatter: LotDeliveryInfoModal, searchType: 'contract' },
    { key: "amount", name: "총 납품 수량", width: 118, formatter: PlaceholderBox, placeholder: '0', type: "placeholder" },
  ]),
  deliveryList: [
    { key: "identification", name: "납품 번호",  width: 118 },
    { key: "contract_id", name: "수주 번호", width: 118 },
    { key: "customer_id", name: "거래처", width: 118 },
    { key: "cm_id", name: "모델", width: 118 },
    { key: "product_id", name: "CODE", width: 118, },
    { key: "name", name: "품명", width: 118 },
    { key: "type", name: "품목 종류", width: 118 },
    { key: "unit", name: "단위", width: 118 },
    { key: "date", name: "납품 날짜", width: 118, headerRenderer: HeaderSort, sortOption: "none", sorts: {} },
    { key: "amount", name: "총 납품 수량", width: 118 },
    { key: "lot_number", name: "LOT별 납품 수량", width: 118, formatter: LotDeliveryInfoModal, readonly: true ,unprintable : true},
  ],
  deliveryModify: [
    { key: "identification", name: "수주 번호", width: 118, type: 'order' },
    { key: 'customer_id', name: '거래처', formatter: SearchModalTest, type: 'customer', placeholder: '-', width: 118},
    { key: 'cm_id', name: '모델', formatter: SearchModalTest, type: 'customerModel', placeholder: '-',width: 118},
    { key: "code", name: "CODE", width: 118, type: 'product' },
    { key: "name", name: "품명", width: 118 },
    { key: "type", name: "품목 종류", width: 118 },
    { key: "unit", name: "단위", width: 118 },
    { key: "date", name: "납품 날짜", width: 118, formatter: CalendarBox },
    { key: "lot_number", name: "LOT 선택", width: 118, formatter: LotDeliveryInfoModal },
    { key: "amount", name: "총 납품 수량", width: 118 },
  ],
  productChangeRegister: [
    { key: "customer_id", name: '거래처', formatter: PlaceholderBox, placeholder: '자동 입력', width: 168, type: 'autoInput' },
    { key: "cm_id", name: '모델', formatter: PlaceholderBox, placeholder: '자동 입력', width: 480, type: 'autoInput' },
    { key: "code", name: 'CODE', formatter: SearchModalTest, type: 'allProduct', width: 480 },
    { key: "name", name: "품명", formatter: PlaceholderBox, placeholder: '자동입력', type: 'autoInput' },
  ],
  productChangeList: [
    { key: "customer_id", name: '거래처', width: 120 },
    { key: "cm_id", name: '모델', width: 120 },
    { key: "code", name: 'CODE', width: 208 },
    { key: "material_name", name: '품명', width: 240 },
    {
      key: 'type', name: '품목 종류', width: 120, selectList: [
        { pk: '0', name: '반제품' },
        { pk: '1', name: '재공품' },
        { pk: '2', name: '완제품' },
      ]
    },
    { key: 'process_id', name: '생산 공정', width: 120 },
    { key: 'title', name: '제목', width: 360 },
    { key: 'register', name: '등록 날짜' },
    { key: 'writer', name: '작성자' }
  ],
  productChangeModify: [
    { key: "customer_id", name: '거래처', formatter: PlaceholderBox, placeholder: '자동 입력', width: 168, type: 'autoInput' },
    { key: "cm_id", name: '모델', formatter: PlaceholderBox, placeholder: '자동 입력', width: 480, type: 'autoInput' },
    { key: "code", name: 'CODE', width: 480 },
    { key: "name", name: "품명", formatter: PlaceholderBox, placeholder: '자동입력', type: 'autoInput' },
  ],
  dailyInspectionMachine: [
    { key: "mfrName", name: '기계 제조사', formatter: PlaceholderBox, placeholder: '자동 입력', width: 168, type: 'autoInput' },
    { key: "name", name: '기계 이름', formatter: PlaceholderBox, placeholder: '자동 입력', width: 480, type: 'autoInput' },
    { key: "mfrCode", name: '제조 번호', formatter: PlaceholderBox, width: 480, type: 'autoInput' },
    { key: "type", name: "기계 종류", formatter: PlaceholderBox, placeholder: '자동입력', type: 'autoInput' },
    { key: "weldingType", name: "용접 종류", formatter: PlaceholderBox, placeholder: '자동입력', type: 'autoInput' },
    { key: "madeAt", name: "제조 연원일", formatter: PlaceholderBox, placeholder: '자동입력', type: 'autoInput' },
    { key: "manager", name: "담당자", formatter: PlaceholderBox, placeholder: '자동입력', type: 'autoInput' },
  ],
  dailyInspectionMachinePicture: [
    { key: "machinePicture", name: '기계 사진', formatter: FileEditer, width: 300, type: 'image', readonly: true },
    { key: "photo1", name: '점검사항 부위01', formatter: FileEditer, type: 'image' },
    { key: "photo2", name: '점검사항 부위02', formatter: FileEditer, type: 'image' },
    { key: "photo3", name: "점검사항 부위03", formatter: FileEditer, type: 'image' },
    { key: "photo4", name: "점검사항 부위04", formatter: FileEditer, type: 'image' },
    { key: "photo5", name: "점검사항 부위05", formatter: FileEditer, type: 'image' },
    { key: "photo6", name: "점검사항 부위06", formatter: FileEditer, type: 'image' },
    { key: "photo7", name: "점검사항 부위07", formatter: FileEditer, type: 'image' },
    { key: "photo8", name: "점검사항 부위08", formatter: FileEditer, type: 'image' },
    { key: "photo9", name: "점검사항 부위09", formatter: FileEditer, type: 'image' },
  ],
  dailyInspectionMoldPicture: [
    { key: "machinePicture", name: '금형 사진', formatter: FileEditer, width: 300, type: 'image', readonly: true },
    { key: "photo1", name: '점검사항 부위01', formatter: FileEditer, type: 'image' },
    { key: "photo2", name: '점검사항 부위02', formatter: FileEditer, type: 'image' },
    { key: "photo3", name: "점검사항 부위03", formatter: FileEditer, type: 'image' },
    { key: "photo4", name: "점검사항 부위04", formatter: FileEditer, type: 'image' },
    { key: "photo5", name: "점검사항 부위05", formatter: FileEditer, type: 'image' },
    { key: "photo6", name: "점검사항 부위06", formatter: FileEditer, type: 'image' },
    { key: "photo7", name: "점검사항 부위07", formatter: FileEditer, type: 'image' },
    { key: "photo8", name: "점검사항 부위08", formatter: FileEditer, type: 'image' },
    { key: "photo9", name: "점검사항 부위09", formatter: FileEditer, type: 'image' },
  ],
  dailyInspectionMachineLegendary: [
    { key: "sequence", name: '구분', formatter: PlaceholderBox, placeholder: '자동 입력', width: 48, },
    { key: "legendary", name: '범례', formatter: PlaceholderBox, editor: TextEditor, placeholder: '범례 입력', },
    { key: "content", name: '범례 설명', formatter: PlaceholderBox, editor: TextEditor, placeholder: '범례 설명 입력', },
  ],
  dailyInspectionMachineCheck: [
    { key: "sequence", name: '구분', formatter: PlaceholderBox, width: 48, type: 'autoInput' },
    { key: "title", name: '점검 항목', formatter: PlaceholderBox, editor: TextEditor, width: 500, placeholder: '점검 항목 입력', },
    { key: "standard", name: '점검 기준', formatter: PlaceholderBox, editor: TextEditor, width: 424, placeholder: '점검 기준 입력', },
    { key: "method", name: '점검 방법', formatter: PlaceholderBox, editor: TextEditor, width: 432, placeholder: '점검 방법 입력', },
    {
      key: "dropDown", name: '기록 방법', formatter: DropDownEditor, placeholder: '자동 입력',
      selectList: [
        { pk: 0, name: "수치 입력" },
        { pk: 1, name: "범례 적용" },
      ]
    },
  ],
  dailyInspectionMachineETC: [
    { key: "etc", name: '기타 사항', formatter: PlaceholderBox, editor: TextEditor, placeholder: '기타 사항 입력' },
  ],
  dailyInspectionMachineModal: [
    { key: "date", name: '점검 날짜', formatter: CalendarBox, width: 304, type: "Modal", readonly: true },
    { key: "name", name: '기계 이름', formatter: LineBorderContainer, width: 360 },
    { key: "mfrCode", name: '제조 번호', formatter: LineBorderContainer, width: 880 },
    { key: "type", name: '기계 종류', formatter: LineBorderContainer, },
  ],
  dailyInspectionMoldModal: [
    { key: "date", name: '점검 날짜', formatter: CalendarBox, width: 304, type: "Modal", readonly: true },
    { key: "name", name: '금형명', formatter: LineBorderContainer, width: 360 },
    { key: "code", name: 'CODE', formatter: LineBorderContainer, width: 880 },
    { key: "type", name: '금형 종류', formatter: LineBorderContainer, },
  ],
  dailyInspectionCheckList: [
    // {key:"contract_id", name:"수주 번호", formatter: SearchModalTest, type: 'order', placeholder: '검색', disableType:"true"  },
    { key: "sequence", name: 'NO.', width: 40 },
    { key: "title", name: '점검 항목', width: 256 },
    { key: "standard", name: '점검 기준', width: 368 },
    { key: "method", name: '점검 방법', width: 256 },
    {
      key: "type", name: '결과', width: 144, formatter: MultiTypeInputEditor, selectList: [
        { pk: 0, name: "범례 적용" },
        { pk: 1, name: "수치 입력" },
      ], type: "Modal", textType: "black", readonly: true
    },
  ],
  dailyInspectionMachineManagement: [
    { key: "writer", name: '작성자 확인', type: "worker", },
    { key: "manager", name: '관리자 확인', type: "user", },
    {
      key: "problem_info", name: '문제 사항', formatter: InputInfoModal, title: "기계 정보", subTitle: "문제 사항", headerItems: [
        [
          { title: '기계 이름', infoWidth: 144, key: 'name' },
          { title: '제조 번호', infoWidth: 144, key: 'mfrCode' },
          { title: '기계 종류', infoWidth: 144, key: 'type' },
          { title: '날짜', infoWidth: 144, key: 'date' },
        ]
      ], width: 120
    },
  ],
  dailyInspectionMoldManagement: [
    { key: "writer", name: '작성자 확인', type: "worker", },
    { key: "manager", name: '관리자 확인', type: "user", },
    {
      key: "problem_info", name: '문제 사항', formatter: InputInfoModal, title: "금형 정보", subTitle: "문제 사항", headerItems: [
        [
          { title: '금형명', infoWidth: 144, key: 'name' },
          { title: 'CODE', infoWidth: 144, key: 'code' },
          { title: '금형 종류', infoWidth: 144, key: 'type' },
          { title: '날짜', infoWidth: 144, key: 'date' },
        ]
      ], width: 120
    },
  ],
  dailyInspectionMold: [
    { key: "code", name: 'CODE', formatter: PlaceholderBox, placeholder: '자동 입력', type: 'autoInput' },
    { key: "name", name: '금형명', formatter: PlaceholderBox, placeholder: '자동 입력', type: 'autoInput' },
  ],
  kpiLeadtimeManufacture: [
    { key: "customer_id", name: '거래처', width: 120, formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: "cm_id", name: '모델', width: 480, formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: "code", name: 'CODE', width: 472, formatter: SearchModalTest, type: 'product', noSelect: true },
    { key: "name", name: '품명', width: 296, formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: "manufacturing_leadtime_average", name: '평균 제조리드타임 (초)', width: 208, formatter: PlaceholderBox, placeholder: '자동 입력' }
  ],
  kpiLeadtimeManufactureContent: [
    { key: 'osd_id', name: '지시 고유 번호', width: 126, formatter: PlaceholderBox, placeholder: '-'  },
    { key: 'code', name: 'CODE', width: 120, disableType: 'record' },
    { key: 'name', name: '품명', width: 120, formatter: PlaceholderBox, placeholder: '-'  },
    { key: 'process_id', name: '생산 공정', width: 120, formatter: PlaceholderBox, placeholder: '-'  },
    { key: 'lot_number', name: 'LOT 번호', width: 120, },
    { key: 'user_id', name: '작업자', width: 120 },
    { key: 'start', name: '작업 시작 일시', width: 120 },
    { key: 'end', name: '작업 종료 일시', width: 120 },
    { key: 'paused_time', name: '일시 정지 시간', width: 120, formatter: PauseInfoModal, type: 'readonly', modalType: false },
    { key: 'good_quantity', name: '양품 수량', width: 120, formatter: UnitContainer, unitData: 'EA' },
    { key: "poor_quantity", name: "불량 수량", formatter: DefectInfoModal, type: 'readonly', width: 120 },
    { key: "manufacturing_leadtime", name: '제조리드타임 (초)', width: 208 },
  ],
  kpiManHour: [
    { key: "customer_id", name: '거래처', width: 120, formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: "cm_id", name: '모델', width: 480, formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: "code", name: 'CODE', width: 320, formatter: SearchModalTest, type: 'product', noSelect: true },
    { key: "name", name: '품명', width: 296, formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: "standard_production", name: '기준 생산량', width: 208, editor: TextEditor, formatter: UnitContainer, inputType: 'number', unitData: 'EA', placeholder: '0' },
    { key: "manDays_average", name: '평균 작업공수 (일)', width: 150, formatter: PlaceholderBox, placeholder: '자동 입력' }
  ],
  kpiManHourContent: [
    { key: 'osd_id', name: '지시 고유 번호', width: 126, formatter: PlaceholderBox, placeholder: '-'  },
    { key: 'code', name: 'CODE', width: 120, disableType: 'record' },
    { key: 'name', name: '품명', width: 120, formatter: PlaceholderBox, placeholder: '-'  },
    { key: 'process_id', name: '생산 공정', width: 120, formatter: PlaceholderBox, placeholder: '-'  },
    { key: 'lot_number', name: 'LOT 번호', width: 120, },
    { key: 'user_id', name: '작업자', width: 120, },
    { key: 'start', name: '작업 시작 일시', width: 120, },
    { key: 'end', name: '작업 종료 일시', width: 120 },
    { key: 'paused_time', name: '일시 정지 시간', width: 120, formatter: PauseInfoModal, type: 'readonly', modalType: false },
    { key: 'good_quantity', name: '양품 수량', width: 120, formatter: UnitContainer, unitData: 'EA' },
    { key: "poor_quantity", name: "불량 수량", formatter: DefectInfoModal, type: 'readonly', width: 120 },
    { key: "manufacturing_leadtime", name: '제조리드타임 (초)', width: 120 },
    { key: "manDays", name: '작업공수 (일)', width: 120 },
  ],
  kpiDefect: [
    { key: "customer_id", name: '거래처', width: 120, formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: "cm_id", name: '모델', width: 240, formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: "code", name: 'CODE', width: 248, formatter: SearchModalTest, type: 'product', noSelect: true },
    { key: "name", name: '품명', width: 248, formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: "unit", name: '단위', width: 120, formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: "total_number", name: '총 생산 수량', width: 240, formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: "total_defectNumber", name: '총 불량 수량', width: 240, formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: "defectiveRate_average", name: '평균 불량률(%)', width: 120, formatter: PlaceholderBox, placeholder: '자동 입력' }
  ],
  kpiDefectContent: [
    { key: 'osd_id', name: '지시 고유 번호', width: 126, formatter: PlaceholderBox, placeholder: '-'  },
    { key: 'code', name: 'CODE', width: 120, },
    { key: 'name', name: '품명', width: 120, formatter: PlaceholderBox, placeholder: '-'  },
    { key: 'process_id', name: '생산 공정', width: 120, formatter: PlaceholderBox, placeholder: '-'  },
    { key: 'lot_number', name: 'LOT 번호', width: 120, },
    { key: 'user_id', name: '작업자', width: 120, },
    { key: 'start', name: '작업 시작 일시', width: 120, },
    { key: 'end', name: '작업 종료 일시', width: 120, },
    { key: 'paused_time', name: '일시 정지 시간', width: 120, formatter: PauseInfoModal, type: 'readonly', modalType: false },
    { key: 'total_quantity', name: '생산 수량', width: 120, formatter: UnitContainer, unitData: 'EA' },
    { key: 'good_quantity', name: '양품 수량', width: 120, formatter: UnitContainer, unitData: 'EA' },
    { key: "poor_quantity", name: "불량 수량", formatter: DefectInfoModal, type: 'readonly', width: 120 },
    { key: "defective_rate", name: '불량률(%)', width: 120 },
  ],
  kpiLeadtimeOrder: [
    { key: "customer_id", name: '거래처', width: 120, formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: "cm_id", name: '모델', width: 480, formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: "code", name: 'CODE', width: 472, formatter: SearchModalTest, type: 'product', noSelect: true },
    { key: "name", name: '품명', width: 296, formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: "leadTime_average", name: '평균 수주/납품 리드타임(일)', width: 208, formatter: PlaceholderBox, placeholder: '자동 입력' }
  ],
  kpiLeadtimeOrderContent: [
    { key: 'identification', name: '수주 번호', width: 688, formatter: PlaceholderBox, placeholder: '-'  },
    { key: 'date', name: '수주 날짜', width: 120, },
    { key: 'deadline', name: '납품 기한', width: 120 },
    { key: 'amount', name: '수주량', width: 120 },
    { key: 'shipment_amount', name: '납품 수량', width: 120, },
    { key: 'shipment_date', name: '납품 완료 날짜', width: 120 },
    { key: 'leadTime', name: '수주/납품 리드타임(일)', width: 240 },
  ],
  kpiPowerUsage: [
    { key: "customer_id", name: '거래처', width: 120, formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: "cm_id", name: '모델', width: 480, formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: "code", name: 'CODE', width: 472, formatter: SearchModalTest, type: 'product', noSelect: true },
    { key: "name", name: '품명', width: 296, formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: "powerUsage_average", name: '개당 평균 전력 사용량 (kW)', width: 208, formatter: PlaceholderBox, placeholder: '자동 입력' }
  ],
  kpiPowerUsageContent: [
    { key: 'osd_id', name: '지시 고유 번호', width: 126, formatter: PlaceholderBox, placeholder: '-'  },
    { key: 'code', name: 'CODE', width: 120},
    { key: 'name', name: '품명', width: 120, formatter: PlaceholderBox, placeholder: '-'  },
    { key: 'process_id', name: '생산 공정', formatter: PlaceholderBox, placeholder: '-' },
    { key: 'lot_number', name: 'LOT 번호', width: 120, },
    { key: 'user_id', name: '작업자', width: 120 },
    { key: 'start', name: '작업 시작 일시', width: 120},
    { key: 'end', name: '작업 종료 일시', width: 120},
    { key: 'paused_time', name: '일시 정지 시간', width: 120, formatter: PauseInfoModal, type: 'readonly', modalType: false },
    { key: 'good_quantity', name: '양품 수량', width: 120, editor: TextEditor, formatter: UnitContainer, unitData: 'EA' },
    { key: 'poor_quantity', name: '불량 수량', width: 120, editor: TextEditor, formatter: UnitContainer, unitData: 'EA' },
    { key: "power_per_unit", name: '개당 전력 사용량 (kW)', width: 208 },
  ],
  kpiUph: [
    { key: "customer_id", name: '거래처', width: 120, formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: "cm_id", name: '모델', width: 480, formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: "code", name: 'CODE', width: 472, formatter: SearchModalTest, type: 'product', noSelect: true },
    { key: "name", name: '품명', width: 296, formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: "uph_average", name: '평균 UPH(시간당 생산량)', width: 208, formatter: PlaceholderBox, placeholder: '자동 입력' }
  ],
  kpiUphContent: [
    { key: 'osd_id', name: '지시 고유 번호', width: 126, formatter: PlaceholderBox, placeholder: '-'  },
    { key: 'code', name: 'CODE', width: 120, },
    { key: 'name', name: '품명', width: 120, formatter: PlaceholderBox, placeholder: '-'  },
    { key: 'process_id', name: '생산 공정', width: 120, formatter: PlaceholderBox, placeholder: '-'  },
    { key: 'lot_number', name: 'LOT 번호', width: 120, },
    { key: 'user_id', name: '작업자', width: 120, },
    { key: 'start', name: '작업 시작 일시', width: 120 },
    { key: 'end', name: '작업 종료 일시', width: 120 },
    { key: 'paused_time', name: '일시 정지 시간', width: 120, formatter: PauseInfoModal, type: 'readonly', modalType: false },
    { key: 'good_quantity', name: '양품 수량', width: 120, formatter: UnitContainer, unitData: 'EA' },
    { key: "poor_quantity", name: "불량 수량", formatter: DefectInfoModal, type: 'readonly', width: 120 },
    { key: "uph", name: 'UPH(시간당 생산량)', width: 208 },
  ],
  kpiOperation: [
    { key: "mfrName", name: '기계 제조사', width: 120, formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: "name", name: '기계 이름', width: 480, formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: "mfrCode", name: '제조 번호', width: 472, formatter: SearchModalTest, type: 'machine', noSelect: true },
    { key: "machine_type", name: '기계 종류', width: 296, formatter: PlaceholderBox, placeholder: '자동 입력' },
    { key: "operation_average", name: '평균 설비가동률', width: 208, formatter: PlaceholderBox, placeholder: '자동 입력' }
  ],
  kpiOperationContent: [
    { key: 'osd_id', name: '지시 고유 번호', width: 126, formatter: PlaceholderBox, placeholder: '-'  },
    { key: 'code', name: 'CODE', width: 120, },
    { key: 'name', name: '품명', width: 120, formatter: PlaceholderBox, placeholder: '-'  },
    { key: 'process_id', name: '생산 공정', width: 120, formatter: PlaceholderBox, placeholder: '-'  },
    { key: 'lot_number', name: 'LOT 번호', width: 120, },
    { key: 'user_id', name: '작업자', width: 120, },
    { key: 'start', name: '작업 시작 일시', width: 200, },
    { key: 'end', name: '작업 종료 일시', width: 200, },
    { key: 'paused_time', name: '일시 정지 시간', width: 120, formatter: PauseInfoModal, type: 'readonly', modalType: false },
    { key: 'good_quantity', name: '양품 수량', width: 120, formatter: UnitContainer, unitData: 'EA' },
    { key: "poor_quantity", name: "불량 수량", formatter: DefectInfoModal, type: 'readonly', width: 120 },
    { key: "operation", name: '설비가동률', width: 208 },
  ],
  toolRegister: [
    { key: "code", name: '공구 CODE', editor: TextEditor, formatter: PlaceholderBox, placeholder: 'CODE 입력', headerRenderer: HeaderSort, sortOption: "none", sorts: {} },
    { key: "name", name: '공구 품명', editor: TextEditor, formatter: PlaceholderBox, placeholder: '품명 입력' },
    {
      key: "unit", name: '단위', formatter: DropDownEditor,
      selectList: [
        { pk: 0, name: "EA" },
        { pk: 1, name: "g" },
        { pk: 2, name: "kg" },
        { pk: 3, name: "Ton" },
        { pk: 4, name: "ml" },
        { pk: 5, name: "L" },
      ]
    },
    { key: "customer_id", name: '거래처', formatter: SearchModalTest, placeholder: '거래처 입력', type: "customer" },
    { key: "stock", name: '공구 재고량', formatter: UnitContainer, unitData: "EA", },
    { key: "product_id", name: '생산 품목', formatter: ProductInfoModal, type: "tool", headerItems: [[{key: 'name', title:'공구 품명', infoWidth: 300},{ key: 'code', title: '공구 CODE', infoWidth: 300 }]] ,unprintable : true},
  ],
  toolList: [
    {key: "code", name: '공구 CODE',  formatter: PlaceholderBox, placeholder: 'CODE 입력'},
    {key: "name", name: '공구 품명',  formatter: PlaceholderBox, placeholder: '품명 입력'},
    {key: "unit", name: '단위', },
    {key: "customer_id", name: '거래처', formatter: PlaceholderBox, placeholder: '-', type:"customer"},
    {key: "stock", name: '공구 재고량', formatter: UnitContainer, unitData:"EA", },
  ],
  toolWarehousingRegister:[
    {key: "tool_id", name: '공구 CODE', formatter: SearchModalTest, type:"tool", placeholder: 'CODE 입력', toolType: 'register', noSelect:true},
    {key: "name", name: '공구 품명', formatter: PlaceholderBox, placeholder: '자동 입력'},
    {key: "unit", name: '단위', formatter: PlaceholderBox, placeholder: '자동 입력'},
    { key: 'customer_id', name: '거래처', formatter: SearchModalTest, type: 'customer', placeholder: "-" },
    {key: "amount", name: '입고량', editor:TextEditor, formatter: PlaceholderBox, placeholder: '입고량 압력'},
    {key: "date", name: '입고일', formatter: CalendarBox, maxDate:true},
  ],
  toolWarehousingList:[
    // {key: 'elapsed', name: '경과일', formatter: UseDateCell, width: 118},
    {key: "tool_id", name: '공구 CODE',  formatter: PlaceholderBox, placeholder: 'CODE 입력'},
    {key: "name", name: '공구 품명', formatter: PlaceholderBox, placeholder: '품명 입력'},
    {key: "unit", name: '단위', formatter: PlaceholderBox,},
    {key: "customer_id", name: '거래처', formatter: PlaceholderBox, placeholder: '-', type:"customer"},
    {key: "warehousing", name: '입고량', formatter: PlaceholderBox, placeholder: '입고량 압력'},
    {key: "date", name: '입고일', },
  ],
  toolWarehousingUpdate:[
    {key: "code", name: '공구 CODE', },
    {key: "name", name: '공구 품명', formatter: PlaceholderBox, placeholder: '-' },
    {key: "unit", name: '단위', },
    { key: 'customer_id', name: '거래처', formatter: SearchModalTest, type: 'customer', placeholder: "-" },
    {key: "warehousing", name: '입고량', editor:TextEditor, formatter: PlaceholderBox, placeholder: '입고량 입력'},
    {key: "date", name: '입고일', formatter: CalendarBox, maxDate:true},
  ],
  documentManage:({move})=>[
    {key:"name", name:"이름", width:1056, formatter: UnderLineContainer , callback : move },
    {key:"type", name:"종류", width:247 },
    {key:"date", name:"날짜", width:224},
  ],
  documentLog:[
    {key:"content", name:"변경 사항", width:1056 },
    {key:"type", name:"종류", width:247 },
    {key:"date", name:"날짜", width:224},
  ],
  productionLog : [
    {key: 'order',frozen:true, name: '순서',  type: 'machineInfo', formatter:PlaceholderBox, summaryType: 'product_no_cavity', width: 48 },
    {key: 'machine_name',frozen:true, name: '기계 이름',  type: 'machineInfo', formatter:PlaceholderBox, summaryType: 'product_no_cavity', width: 120, placeholder : '-'},
    // {key: 'machine_type',frozen:true, name: '기계 종류',  type: 'machineInfo', formatter:PlaceholderBox, summaryType: 'product_no_cavity', width: 120,},
    { key: 'identification', frozen: true, name: '지시 고유 번호', type: 'machineInfo', formatter: PlaceholderBox, summaryType: 'product_no_cavity', width: 120, placeholder: '-' },
    { key: 'deadline', frozen: true, name: '작업 기한', formatter: PlaceholderBox, width: 120 },
    { key: 'customer', frozen: true, name: '거래처', type: 'machineInfo', formatter: PlaceholderBox, summaryType: 'product_no_cavity', width: 120, placeholder: '-' },
    { key: 'model', frozen: true, name: '모델', type: 'machineInfo', formatter: PlaceholderBox, summaryType: 'product_no_cavity', width: 120, placeholder: '-' },
    { key: 'product_code', frozen: true, name: 'CODE', type: 'machineInfo', formatter: PlaceholderBox, summaryType: 'product_no_cavity', width: 120, placeholder: '-' },
    { key: 'product_name', frozen: true, name: '품명', type: 'machineInfo', formatter: PlaceholderBox, summaryType: 'product_no_cavity', width: 120, placeholder: '-' },
    // {key: 'process', name: '생산 공정',  type: 'machineInfo', formatter:PlaceholderBox, summaryType: 'product_no_cavity', width: 120,},
    { key: 'goal', name: '목표 생산량', type: 'machineInfo', formatter: PlaceholderBox, summaryType: 'product_no_cavity', width: 120, placeholder: '0' },
    { key: 'total_good_quantity', name: '총 양품 수량', type: 'machineInfo', formatter: PlaceholderBox, summaryType: 'product_no_cavity', width: 120, placeholder: '0' },
    { key: 'total_poor_quantity', name: '총 불량 수량', type: 'machineInfo', formatter: PlaceholderBox, summaryType: 'product_no_cavity', width: 120, placeholder: '0' },
    { key: 'poor_rate', name: '불량률', type: 'machineInfo', formatter: PlaceholderBox, summaryType: 'product_no_cavity', width: 120, placeholder: '0' },
    { key: 'achievement', name: '달성률', formatter: CommonProgressBar, type: 'machineInfo', summaryType: 'product_no_cavity', width: 170 },
  ],
  outsourcingOrder:[
    {key: 'product_name', name: '품명', formatter:SearchModalTest, type: 'outsourceProduct', placeholder: '-', noSelect: true },
    {key: 'code', name: 'CODE', formatter:PlaceholderBox, placeholder: '자동 입력',},
    {key: 'customer_id', name: '거래처', formatter: SearchModalTest, type: 'customer', placeholder: '-'},
    // {key: 'cm_id', name: '모델', formatter:PlaceholderBox, placeholder: '자동 입력'},
    {key: 'cm_id', name: '모델', formatter: SearchModalTest, type: 'customerModel', placeholder: '-'},
    {key: 'user', name: '발주자', formatter:SearchModalTest, type: 'user', placeholder: '-',  noSelect: true},
    {key: 'order_date', name: '발주 날짜', formatter:CalendarBox, placeholder: '-', dependency : 'due_date'} ,
    {key: 'due_date', name: '입고 희망일', formatter:CalendarBox, placeholder: '-', type: 'outsourcingOrder'},
    {key: 'input', name: '투입 자재', formatter:InputMaterialListModal, textAlign: 'center', type:'outsourcing', action:'register'},
    {key: 'order_quantity', name: '발주량', formatter:PlaceholderBox, editor: TextEditor, placeholder: '0', disabledCase: [{key:'bomChecked', value: undefined}] },
  ],
  outsourcingOrderList: [
    {key: 'identification', name: '발주 고유번호', formatter:PlaceholderBox, type: 'product', placeholder: '-'},
    {key: 'name', name: '품명', formatter:PlaceholderBox, type: 'product', placeholder: '-'},
    {key: 'product_id', name: 'CODE', formatter:PlaceholderBox, placeholder: '-'},
    {key: 'customer_id', name: '거래처', formatter:PlaceholderBox, placeholder: '-'},
    {key: 'cm_id', name: '모델', formatter:PlaceholderBox, placeholder: '-'},
    {key: 'current', name: '미입고량', formatter:PlaceholderBox, placeholder: '0'},
    {key: 'order_quantity', name: '총 발주량', formatter:PlaceholderBox, placeholder: '-'},
    {key: 'order_date', name: '발주 날짜', formatter: PlaceholderBox},
    {key: 'due_date', name: '입고 희망일', formatter:PlaceholderBox},
    // {key: 'customer', name: '거래처', formatter:PlaceholderBox, placeholder: '-'},
    {key: 'bom', name: '투입 자재', formatter:LotInputInfoModal, width: 118, readonly: true, type:"outsourcing" ,unprintable : true},
  ],
  outsourcingOrderModify: [
    {key: 'product_id', name: '품명', formatter:PlaceholderBox, type: 'product', placeholder: '-'},
    {key: 'code', name: 'CODE', formatter:PlaceholderBox, placeholder: '-'},
    {key: 'customer_id', name: '거래처', formatter: SearchModalTest, type: 'customer', placeholder: '-'},
    {key: 'cm_id', name: '모델', formatter: SearchModalTest, type: 'customerModel', placeholder: '-'},
    {key: 'worker', name: '발주자', formatter:PlaceholderBox, type: 'user', placeholder: '-'},
    {key: 'order_date', name: '발주 날짜', formatter:CalendarBox, placeholder: '-' , dependency : 'due_date'},
    {key: 'due_date', name: '입고 희망일', formatter:CalendarBox, placeholder: '-', type: 'outsourcingOrder'},
    {key: 'input', name: '투입 자재', formatter:InputMaterialListModal, type:'outsourcing', action:'modify', unprintable : true},
    {key: 'order_quantity', name: '발주량', formatter:PlaceholderBox, editor: TextEditor, placeholder: '0'},
  ],
  outsourcingImport:(basicRow?, setBasicRow?, importByProduct?: boolean) =>(
    [
      {key: 'name', name: '품명', formatter: PlaceholderBox, placeholder: '자동 입력'},
      {key: 'product_id', name: 'CODE', formatter:importByProduct ? MultiSelectModal : PlaceholderBox, searchType: 'outsourceProduct', type: 'outsourcingImport', basicRow, setBasicRow, placeholder: '자동 입력'},
      {key: 'customer_id', name: '거래처', formatter:PlaceholderBox, placeholder: '자동 입력'},
      {key: 'cm_id', name: '모델', formatter:PlaceholderBox, placeholder: '자동 입력'},
      {key: 'identification', name: '발주내역', formatter: importByProduct ? PlaceholderBox : MultiSelectModal, searchType: 'outsourcingOrder', type: 'outsourcingImport', basicRow, setBasicRow, placeholder: '-'},
      {key: 'order_date', name: '발주 날짜', formatter:PlaceholderBox, placeholder: importByProduct ? '-' : '자동 입력' },
      {key: 'user', name: importByProduct ? '입고자' : '발주자', formatter:importByProduct ? SearchModalTest : PlaceholderBox, type: 'user', placeholder: '자동 입력'},
      {key: 'import_date', name: '입고 날짜', formatter:CalendarBox, placeholder: '-', type: 'outsourcingImport'},
      // {key: 'bom', name: '투입 자재', formatter: LotInputInfoModal, width: 118, readonly:true, type:'outsourcing'  },
      {key: 'order_quantity', name: '총 발주량', formatter:PlaceholderBox, placeholder: '-'},
      {key: 'current', name: '미입고량', formatter:PlaceholderBox, placeholder: '0'},
      {key: 'warehousing', name: '입고량', formatter:PlaceholderBox, editor:TextEditor, inputType:'number', placeholder: '입고량 입력'},
      {key: 'lot_number', name: 'LOT 번호', formatter:PlaceholderBox, editor:TextEditor, placeholder: 'Lot번호 입력'},
    ]
  ),
  outsourcingImportList: [
    {key: 'contract_id', name: '발주 고유번호', formatter:PlaceholderBox, placeholder: '-'},
    {key: 'name', name: '품명', formatter:PlaceholderBox, placeholder: '-'},
    {key: 'product_id', name: 'CODE', formatter:PlaceholderBox, placeholder: '-'},
    {key: 'customer_id', name: '거래처', formatter:PlaceholderBox, placeholder: '-'},
    {key: 'cm_id', name: '모델', formatter:PlaceholderBox, placeholder: '-'},
    {key: 'import_date', name: '입고 날짜', formatter:PlaceholderBox, placeholder: '-'},
    {key: 'warehousing', name: '입고량', formatter:PlaceholderBox, placeholder: '0'},
    {key: 'current', name: 'LOT 재고량', formatter:PlaceholderBox, placeholder: '0'},
    {key: 'lot_number', name: 'LOT 번호', formatter:PlaceholderBox, placeholder: '-'},
  ],

  outsourcingImportModify: (basicRow?, setBasicRow?) => [
    {key: 'identification', name: '발주 고유번호', formatter: PlaceholderBox , basicRow, setBasicRow},
    {key: 'name', name: '품명', formatter: PlaceholderBox, type: 'product', basicRow, setBasicRow},
    {key: 'product_id', name: 'CODE', formatter:PlaceholderBox, placeholder: '-'},
    {key: 'customer_id', name: '거래처', formatter:PlaceholderBox, placeholder: '-'},
    {key: 'cm_id', name: '모델', formatter:PlaceholderBox, placeholder: '-'},
    {key: 'order_date', name: '발주 날짜', formatter:PlaceholderBox, placeholder: '-'},
    {key: 'import_date', name: '입고 날짜', formatter:CalendarBox, placeholder: '-'},
    // {key: 'bom', name: '투입 자재', formatter: LotInputInfoModal, width: 118, type: 'readonly', type:'outsourcing' },
    {key: 'order_quantity', name: '총 발주량', formatter:PlaceholderBox, placeholder: '0'},
    {key: 'current', name: '미입고량', formatter:PlaceholderBox, placeholder: '0'},
    {key: 'warehousing', name: '입고량', formatter:PlaceholderBox, editor:TextEditor, inputType:'number', placeholder: '0'},
    {key: 'lot_number', name: 'LOT 번호', formatter:PlaceholderBox, editor:TextEditor, placeholder: 'Lot번호 입력'},
  ],

  outsourcingDelivery: [
    {key: 'product_name', name: '품명', formatter:PlaceholderBox, placeholder: '자동 입력'},
    {key: 'code', name: 'CODE', formatter:SearchModalTest, type: 'outsourceProduct', noSelect:true,  placeholder: '-'},
    // {key: "customer_id", name: "거래처", formatter: PlaceholderBox, placeholder: '자동 입력' },
    {key: 'customer_id', name: '거래처', formatter: SearchModalTest, type: 'customer', placeholder: '-'},
    // {key: 'cm_id', name: '모델', formatter:PlaceholderBox, placeholder: '자동 입력'},
    {key: 'cm_id', name: '모델', formatter: SearchModalTest, type: 'customerModel', placeholder: '-'},
    {key: 'date', name: '납품 날짜', formatter:CalendarBox, placeholder: '-'},
    {key: 'input', name: '투입 자재', formatter: LotDeliveryInfoModal, type:"outsourcing"},
    {key: 'amount', name: '총 납품 수량', formatter:PlaceholderBox, placeholder: '자동 입력'},
  ],
  outsourcingDeliveryModify: [
    {key: 'product_name', name: '품명', formatter:PlaceholderBox, placeholder: '-'},
    {key: 'code', name: 'CODE', formatter:PlaceholderBox, placeholder: '-'},
    // {key: "customer_id", name: "거래처", formatter: PlaceholderBox, placeholder: '-' },
    {key: 'customer_id', name: '거래처', formatter: SearchModalTest, type: 'customer', placeholder: '-'},
    // {key: 'cm_id', name: '모델', formatter:PlaceholderBox, placeholder: '-'},
    {key: 'cm_id', name: '모델', formatter: SearchModalTest, type: 'customerModel', placeholder: '-'},
    {key: 'date', name: '납품 날짜', formatter:CalendarBox, placeholder: '-'},
    {key: 'input', name: '투입 자재', formatter: LotDeliveryInfoModal, type:"outsourcing"},
    {key: 'amount', name: '총 납품 수량', formatter:PlaceholderBox, placeholder: '자동 입력'},
  ],
  outsourcingDeliveryList: [
    {key: 'identification', name: '납품 고유번호', formatter:PlaceholderBox, placeholder: '-'},
    {key: 'name', name: '품명', formatter:PlaceholderBox, placeholder: '-'},
    {key: 'product_id', name: 'CODE', formatter:PlaceholderBox, placeholder: '-'},
    {key: "customer_id", name: "거래처", formatter: PlaceholderBox, placeholder: '-' },
    {key: 'cm_id', name: '모델', formatter:PlaceholderBox, placeholder: '-'},
    {key: 'date', name: '납품 날짜', formatter:PlaceholderBox, placeholder: '-'},
    {key: 'amount', name: '총 납품 수량', formatter:PlaceholderBox, placeholder: '-'},
    {key: 'lots', name: 'LOT별 납품수량', formatter: LotDeliveryInfoModal, type:"outsourcing", readonly:true},
  ]
}
