// export {AddlButton} from "./components/Buttons/AddlButton"
//
//
// //EXCEL
import {menuSelect} from './common/menulist'
//캘린더
import {rootReducer} from './reducer'
import exp from "constants";

export {
  getMachineTypeList,
  getSubMachineTypeList,
  getMaterialTypeList,
  getPartsTypeList,
  getMoldTypeList,
  getBarcodeTypeList,
  subMachineCodes,
  stockReasonCodes,
  moldCodes,
  materialCodes,
  barcodes,
  processcodes,
  weldingcodes,
  keycamcodes,
  machineCodes,
  unitCodes,
  statusCodes,
  transferCodeToName,
  transferStringToCode,
  machineCodeToName,
  machineStringToCode
} from "./common/codeTransferFunctions"

export {columnlist} from "./common/columnInit"

export {
  //스타일 커스텀 변수
  TOKEN_NAME,
  MAX_VALUE,
  SERVICE_TITLE,
  SYSTEM_NAME,
  COMPANY_LOGO,
  COMPANY_NAME,
  MAX_WIDTH,
  POINT_COLOR,
  BG_COLOR,
  BG_COLOR_SUB,
  BG_COLOR_SUB2,
  BUTTON_TEXT_COLOR,
  BG_COLOR_SUB3,
  POINT_COLOR_3,
  //아이피
  SF_ADDRESS,
  isLocalhost,
  SF_ENDPOINT,
  SF_ENDPOINT_EXCEL,
  SF_ENDPOINT_ADMIN,
  SF_ENDPOINT_FILE,
  SF_ENDPOINT_RESOURCE,
  //권한관리
  AUTHORITY_LIST
} from "./common/configset"

export {excelDownload} from "./common/excelDownloadFunction"

export {uploadTempFile} from "./common/fileFuctuons"

export {global} from "./common/global"

export {menuSelect} from "./common/menulist"

export {searchModalList} from "./common/modalInit"

export {requestApi, RequestMethod} from "./common/RequestFunctions"

export {theme} from "./common/theme"

export {setToken} from "./common/tokenManager"

//버튼
export {AddlButton} from "./components/Buttons/AddlButton"
export {CellButtonComponent} from "./components/Buttons/CellButtom"
export {FinishButton} from "./components/Buttons/FinishButton"
export {FinishCancelButton} from "./components/Buttons/FinishCancelButton"
export {OrderRegisterButton} from "./components/Buttons/OrderRegisterButton"
export {MidRangeButton} from "./components/Buttons/MidRangeButton"

export {UseDateCell} from "./components/Cell/UseDateCell"
export {RelationWork} from "./components/Cell/RelationWork"
export {LotNumberRegister} from "./components/Cell/LotNumberRegister"

//드롭다운
export {DropDownEditor} from "./components/Dropdown/ExcelBasicDropdown"
export {MidrangeExcelDropdown} from './components/Dropdown/MidrangeExcelDropdown'

export {MidrangeExcelTable} from "./components/Excel/MidrangeExcelTable"
export {ExcelTable} from "./components/Excel/ExcelTable"

export {FileEditer} from "./components/FileUpload/ExcelBasicFileUpload"
export {TitleFileUpload} from './components/FileUpload/TitleFileUpload'

//textArea
export {TitleTextArea} from './components/TextAreaBox/TitleTextArea'

//formatter
export {NumberingBox} from "./components/Formatter/NumberingBox"
export {ProductTitleFomatter} from "./components/Formatter/ProductTitleFomatter"
export {RecordDetailFormatter} from "./components/Formatter/RecordDetailFormatter"
export {StatusComponent} from "./components/Formatter/StatusComponent"
export {LineBorderContainer} from "./components/Formatter/LineBorderContainer"

//헤더
export {Header} from "./components/Header"
export {MonthSelectCalendar} from "./components/Header/MonthSelectCalendar"
export {PeriodSelectCalendar} from "./components/Header/PeriodSelectCalendar"
export {TitleCalendarBox} from './components/CalendarBox/TitleCalendarBox'

//헤더 필터
export {HeaderFilter} from './components/HeaderFilter/HeaderFilter'

//인풋박스
export {TextEditor} from './components/InputBox/ExcelBasicInputBox'
export {WelcomeInput} from './components/InputBox/WelcomeInput'
export {TitleInput} from './components/InputBox/TitleInput'

//모달
export {AuthoritySearchModal} from './components/Modal/AuthoritySearchModal'
export {CustomerSearchModal} from './components/Modal/CustomerSearchModal'
export {DefectSearchModal} from './components/Modal/DefectSearchModal'
export {MachineSearchModal} from './components/Modal/MachineSearchModal'
export {MemberSearchModal} from './components/Modal/MemeberSearchModal'
export {ModelSearchModal} from './components/Modal/ModelSearchModal'
export {MultipleSelectModal} from './components/Modal/MultipleSelectModal'
export {OperationMachineSearchModal} from './components/Modal/OperationMachineSearchModal'
export {OperationSearchModal} from './components/Modal/OperationSearchModal'
export {PauseModal} from './components/Modal/PauseModal'
export {PoorQuantityModal} from './components/Modal/PoorQuantityModal'
export {ProcessSearchModal} from './components/Modal/ProcessSearchModal'
export {ProcessSeqModal} from './components/Modal/ProcessSeqModal'
export {ProductSearchModal} from './components/Modal/ProductSearchModal'
export {RawMaterialSearchModal} from './components/Modal/RawMaterialSearchModal'
export {SearchModal} from './components/Modal/SearchModal'
export {ExcelDownloadModal} from './components/Modal/ExcelDownloadMoadal'
export {ExcelUploadModal} from './components/Modal/ExcelUploadModal'
export {ManagerSearchModal} from './components/Modal/ManagerSearchModal'
export {FactorySearchModal} from './components/Modal/FactorySearchModal'
export {DeviceSearchModal} from './components/Modal/DeviceSearchModal'
export {FactoryInfoModal} from './components/Modal/FactoryInfoModal'
export {DeviceInfoModal} from './components/Modal/DeviceInfoModal'
export {SegmentFactorySearchModal} from './components/Modal/SegmentFactorySearchModal'
export {ProductInfoModal} from './components/Modal/ProductInfoModal'
export {MoldInfoModal} from './components/Modal/MoldInfoModal'
export {MachineInfoModal} from './components/Modal/MachineInfoModal'
export {InputMaterialInfoModal} from './components/Modal/InputMaterialInfoModal'
export {WorkRegisterModal} from './components/Modal/WorkRegisterModal'
export {OperationInfoModal} from './components/Modal/OperationInfoModal'
export {InfoModal} from './components/Modal/InfoModal'
export {LotInputInfoModal} from './components/Modal/LotInputInfoModal'
export {MidrangeFormReviewModal} from './components/Modal/MidrangeFormReviewModal'
export {MidrangeRegisterModal} from './components/Modal/MidrangeRegisterModal'

export {TestModule} from "./components/ComponentTest"

export {PaginationComponent} from "./components/Pagination/PaginationComponent"

export {UnitContainer} from "./components/Unit/UnitContainer"

export {ProfileHeader} from "./components/Profile/ProfileHeader"

export {rootReducer} from "./reducer"

type RootState = ReturnType<typeof rootReducer>
export type {RootState}

//redux
export {setModifyInitData, SET_MENU_STATE} from "./reducer/modifyInfo"

export type {
  IMenuType,
  IExcelHeaderType,
  IResponseType,
  IMenu,
  IItemMenuType,
  MachineType,
  ProductListType,
} from './@types/type'


