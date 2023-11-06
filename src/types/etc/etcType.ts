/**
 * 옵션 유형을 나타내는 열거형입니다.
 * @enum {string}
 */
enum OPTION_TYPE {
  /**
   * 셀렉트 옵션 유형입니다.
   */
  SELECT = 'SELECT',
  /**
   * 라디오 버튼 옵션 유형입니다.
   */
  RADIO = 'RADIO',
}
/**
 * 기타내역 내 상세내역 조회 시 필요한 시작, 끝 날짜와 조회 트리거를 포함하는 타입입니다.
 * @interface
 */
interface SearchInfoType {
  /**
   * 조회 시작 날짜입니다.
   * @type {string}
   */
  from: string;
  /**
   * 조회 종료 날짜입니다.
   * @type {string}
   */
  to: string;
  /**
   * 조회 트리거 여부를 나타냅니다. true 상태가 되면 조회를 요청합니다.
   * @type {boolean | undefined}
   */
  searchTrigger?: boolean;
}
/**
 * 기타내역 내 상세내역 조회 시 select 옵션을 사용하는 타입입니다.
 *
 * 상세 타입은 {@link SearchInfoType}를 확인하세요.
 */
interface SearchInfoSelectType extends SearchInfoType {
  /**
   * 내역 조회 시 상세 옵션을 나타냅니다.
   * @type { value: string | number, title: string }[]
   */
  searchOption: { value: string | number; title: string }[]; // Select
}
/**
 * 기타내역 내 상세내역 조회 시 radio 옵션을 사용하는 타입입니다.
 *
 * 상세 타입은 {@link SearchInfoType}를 확인하세요.
 */
interface SearchInfoRadioType extends SearchInfoType {
  /**
   * 내역 조회 시 상세 옵션을 나타냅니다.
   * @type {string}
   */
  searchType: string;
}

// 쿼리 결과값 관련 type
interface SummaryDataType {
  item: string;
  std_date: string;
  supply_amt: number;
  total_amt: number;
  vat_amt: number;
}

interface VirtualAccountSummaryDataType {
  fran_name: string;
  bank_code: string;
  account: string;
  total_charge: string;
  used_amount: string;
  balance: number;
}

interface DeliveryDetailListType {
  delivery_pay_type: string;
  dtRcp: string;
  nDeliveryCharge: number;
  payment_type: string;
  sItem: string;
  sPhone: string;
  suply_fee: number;
  suply_fee_tax: number;
  total_charge: number;
  total_fee: number;
} // web_fran_s_etc_delivery_list 결과 타입
interface MusicChargeDetailType {
  state: string;
  std_date: string;
  suply_amount: number;
  tax_amount: number;
  total_amount: number;
} // web_fran_s_etc_music_fee_list 결과 타입 (음악 서비스 이용료, 로열티에서 사용)
interface GiftCardDetailType {
  account_amt: number;
  gubun: string;
  item_amt: number;
  item_cnt: number;
  item_name: string;
  menu_Item: number;
  rcp_type: string;
  std_date: string;
} // web_fran_s_etc_gift_cert_detail_list 결과 타입
interface OrderDetailListType {
  amount: number;
  cancel_staff: string;
  cancel_date: string;
  first_item: string;
  insert_date: string;
  last_modify_date: string;
  last_modify_staff: string;
  nOrderID: number;
  order_count: number;
  staff_name: string;
  state: number;
  state_name: string;
  supply_amt: number;
  vat_amt: number;
} // web_fran_s_etc_order_list 결과 타입
interface OrderDetailListExcelTotalType {
  [key: string]: OrderDetailListExcelType[]; // ex) 123456: [ { cancel_date: "", nOrderId: 123456, ... }, {...}, ... ]
}
interface OrderDetailListExcelType {
  cancel_date: string;
  cancel_staff: string;
  delivery_volume: string;
  delivery_unit: string;
  fran_price: number;
  insert_date: string;
  last_modify_date: string;
  last_modify_staff: string;
  nEAPerPack: number;
  nOrderID: number;
  order_count: number;
  order_detail_cnt: number;
  sGroup: string;
  sItemShort: string;
  staff_name: string;
  state: number;
  state_name: string;
  supply_amt: number;
  total_amt: number;
  vat_amt: number;
} // web_fran_s_etc_order_list_excel
interface RoyaltyDetailListType {
  std_date: string;
  state: string;
  suply_amount: number;
  tax_amount: number;
  total_amount: number;
} // web_fran_s_etc_royalty_list 결과 타입
interface VirtualAccListType {
  balance: number;
  deposit: number;
  division: string;
  log_date: string;
  etc: string;
  state: string;
} // web_fran_s_etc_balance_list 결과 타입
interface OrderDetailModalItemType {
  fOrderCount: number;
  fran_price: number;
  nEAPerPack: number;
  nItem: number;
  sDeliveryUnit: string;
  sEtc: number;
  sGroup: string;
  sItemShort: string;
  suply_amount: number;
  tax_amount: number;
  total_amount: number;
  volume: string;
} // web_fran_s_etc_order_detail 결과 타입

// param
interface GiftCardListParams {
  f_code: number;
  from_date: string;
  to_date: string;
}

/* Type Check */
/**
 * 주어진 객체가 SearchInfoSelectType 유형인지 여부를 확인합니다.
 *
 * 파라미터 타입은 {@link SearchInfoSelectType}을 참고하세요.
 * @param {any} target - 확인하려는 객체.
 * @returns {boolean} 주어진 객체가 SearchInfoSelectType 유형이면 true, 그렇지 않으면 false를 반환합니다.
 */
const isSelect = (target: any): target is SearchInfoSelectType => ('searchOption' in target ? true : false);
/**
 * 주어진 객체가 SearchInfoRadioType 유형인지 여부를 확인합니다.
 *
 * 파라미터 타입은 {@link SearchInfoRadioType}을 참고하세요.
 * @param {any} target - 확인하려는 객체.
 * @returns {boolean} 주어진 객체가 SearchInfoRadioType 유형이면 true, 그렇지 않으면 false를 반환합니다.
 */
const isRadio = (target: any): target is SearchInfoRadioType => ('searchType' in target ? true : false);

/**
 * 기타내역 페이지에서 사용되는 탭, 페이지 유형을 정의하는 열거형입니다.
 * @enum {string}
 */
enum ETC_TAB_TYPE {
  /**
   * 바나 딜리버리 수수료
   */
  DELIVERY,
  /**
   * 음악 서비스 이용료
   */
  MUSIC,
  /**
   * 실물상품권 발주/판매
   */
  GIFTCARD,
  /**
   * 발주내역
   */
  ORDER,
  /**
   * 로열티
   */
  ROYALTY,
  /**
   * 가상계좌 충전/차감
   */
  ACCOUNT,
}

export type {
  SearchInfoType,
  SearchInfoSelectType,
  SearchInfoRadioType,
  GiftCardListParams,
  SummaryDataType,
  VirtualAccountSummaryDataType,
  DeliveryDetailListType,
  MusicChargeDetailType,
  GiftCardDetailType,
  OrderDetailListType,
  OrderDetailListExcelTotalType,
  OrderDetailListExcelType,
  RoyaltyDetailListType,
  VirtualAccListType,
  OrderDetailModalItemType,
};
export { OPTION_TYPE, ETC_TAB_TYPE, isSelect, isRadio };
