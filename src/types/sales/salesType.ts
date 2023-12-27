import { Point } from '@nivo/line';
import { Bit, CommonParams } from 'types/common';

// common
type SearchType = 'D' | 'M';
type CouponType = '가맹점쿠폰' | '본사쿠폰' | '본사쿠폰미보전' | '제휴사쿠폰';

interface DataProps<T> {
  data: T;
}
interface DataArrayProps<T> {
  data: T[];
}
interface SalesTableRowProps<T> {
  data: T;
  isDisplay?: boolean;
}

// API params type
interface SalesHistoryParams extends CommonParams {
  from_date: string;
  to_date: string;
}
interface SalesStatisticParams extends SalesHistoryParams {
  search_type: SearchType;
}
interface SalesCouponDetailParams {
  f_code: number;
  order_id: number;
  coupon_type: CouponType;
}

// API Output
interface SalesHistoryData {
  [key: string]: number | string;
  bOrderGiftCert: '0' | '1';
  bana_point: number;
  bonus_point: number;
  cancel_date: string;
  card_charge: number;
  cash_charge: number;
  dtRcp: string;
  etc_delivery_charge: number;
  e_coupon_charge: number; // 제휴사 쿠폰 금액
  e_pay_charge: number; // 간편결제 금액
  e_pay_type: string; // 간편결제 종류
  filter_pay_type: string; // 결제 수단
  fran_coupon_charge: number;
  hd_coupon_charge: number;
  hd_coupon_charge_2: number;
  item_name: string;
  nChargeTotal: number;
  nCount: number;
  nDeliveryCharge: number;
  nDeliveryPayType: number;
  nEtcDeliveryCharge: number;
  nOrderID: number;
  nSavingPoint: number;
  nStampCount: number;
  order_state: number;
  order_state_name: string;
  order_type: number;
  order_type_name: string;
  paid_point: number;
  pay_type: '결제완료' | '현장카드' | '현장현금';
  phone: string;
  rcp_date: string;
  rcp_type: string;
  sChargeDisDetail: string;
  sChargeDisReason: string;
  sCouponID: string;
  small_point: number;
}
interface SalesStatisticData {
  [key: string]: number | string;
  app_card_amt: number;
  app_delivery_amt: number;
  app_delivery_charge: number;
  app_e_pay_amt: number;
  bana_point: number;
  e_coupon_charge: number;
  etc_delivery_amt: number;
  etc_delivery_charge: number;
  fran_coupon_charge: number;
  free_sales_amt: number;
  hd_coupon_charge: number;
  hd_coupon_charge_2: number;
  kiosk_card_amt: number;
  kiosk_e_pay_amt: number;
  paid_point: number;
  paid_sales_amt: number;
  pos_cash_amt: number;
  std_date: string;
  total_sales_amt: number;
}
interface SalesCouponDetailData {
  sTitle: string;
  sEtc: string;
  nApply: number;
  nUseCouponAmt: number;
}

/* option value에 사용할 값 관련 타입들 */

// history option types
// 주문유형(ORDER_TYPE)
const HISTORY_ORDER_TYPE = {
  TOTAL: 'total',
  COUBAE: '쿠팡배민',
  CAFE: 0,
  APP: 1,
  COUPANG: 2,
  BAEMIN: 3,
};
// 주문상태(ORDER_STATE)
const HISTORY_ORDER_STATE = {
  TOTAL: 'total',
  AWAIT: 5,
  MAKING: 10,
  MAKING20: 20,
  MAKING_FINISH: 30,
  DELIVERY: 35,
  COMPLETE: 40,
  CANCEL: 50,
};
// 접수타입(RCP_TYPE)
const HISTORY_RCP_TYPE = {
  TOTAL: 'total',
  APP: '앱',
  KIOSK: '키오스크',
  POS: '직접결제POS',
  FPROCESS: '매장앱',
  NA: 'N/A',
};
// 결제방식(PAY_TYPE)
const HISTORY_PAY_TYPE = {
  TOTAL: 'total',
  COMPLETE: '결제완료',
  CARD: '현장카드',
  CASH: '현장현금',
  // CANCEL: '결제취소',
};
// 결제수단(PAY_WITH)
const HISTORY_PAY_WITH = {
  TOTAL: 'total',
  CARD: '카드',
  KAKAO: '카카오페이',
  NAVER: '네이버페이',
  APPLE: '애플페이',
  CASH: '현금',
  COUPON: '쿠폰(전체)',
  POINT: '포인트(전체)',
};
// 상품종류(GIFT_CERT)
const HISTORY_GIFT_CERT = {
  TOTAL: 'total',
  PRODUCT: 0,
  GIFT_CERT: 1,
};

// select안에서 사용할 option의 타입 LIST
const HISTORY_SEARCH_TYPE_LIST = [
  [HISTORY_ORDER_TYPE.TOTAL, HISTORY_ORDER_TYPE.CAFE, HISTORY_ORDER_TYPE.APP, HISTORY_ORDER_TYPE.COUBAE],
  [
    HISTORY_ORDER_STATE.TOTAL,
    HISTORY_ORDER_STATE.AWAIT,
    HISTORY_ORDER_STATE.MAKING,
    HISTORY_ORDER_STATE.MAKING_FINISH,
    HISTORY_ORDER_STATE.DELIVERY,
    HISTORY_ORDER_STATE.COMPLETE,
    // HISTORY_ORDER_STATE.CANCEL,
  ],
  [
    HISTORY_RCP_TYPE.TOTAL,
    HISTORY_RCP_TYPE.APP,
    HISTORY_RCP_TYPE.KIOSK,
    HISTORY_RCP_TYPE.POS,
    HISTORY_RCP_TYPE.FPROCESS,
    HISTORY_RCP_TYPE.NA,
  ],
  [
    HISTORY_PAY_TYPE.TOTAL,
    HISTORY_PAY_TYPE.COMPLETE,
    HISTORY_PAY_TYPE.CARD,
    HISTORY_PAY_TYPE.CASH,
    // HISTORY_PAY_TYPE.CANCEL,
  ],
  [
    HISTORY_PAY_WITH.TOTAL,
    HISTORY_PAY_WITH.CARD,
    HISTORY_PAY_WITH.KAKAO,
    HISTORY_PAY_WITH.NAVER,
    HISTORY_PAY_WITH.APPLE,
    HISTORY_PAY_WITH.CASH,
    HISTORY_PAY_WITH.COUPON,
    HISTORY_PAY_WITH.POINT,
  ],
  [HISTORY_GIFT_CERT.TOTAL, HISTORY_GIFT_CERT.PRODUCT, HISTORY_GIFT_CERT.GIFT_CERT],
];

// statistic option types
const STATISTIC_SEARCH_TYPE = {
  DAY: 'D',
  MONTH: 'M',
};
// select안에서 사용할 option의 타입 LIST
const STATISTIC_SEARCH_LIST = [STATISTIC_SEARCH_TYPE.DAY, STATISTIC_SEARCH_TYPE.MONTH];

// history type
interface SalesHistorySearchOption {
  title: string; // select box option name
  value: string; // select box option value
}
interface SalesHistorySearch {
  from: string;
  to: string;
  searchOption: SalesHistorySearchOption[];
}

// 쿠폰 상세 모달 관련
interface CouponUsageDetailContainerProps {
  posX: number;
  posY: number;
  clientY: number;
}

// statistic type
interface SalesStatisticSearch {
  searchType: SearchType;
  from: string;
  to: string;
}
interface ChartFilter {
  total: Bit;
  paid: Bit;
  app: Bit;
  free: Bit;
}
interface SalesLineChartProps {
  chartFilter: ChartFilter;
  searchType: SearchType;
  data: SalesStatisticData[];
}
interface SalesLineChartTooltipProps {
  point: Point;
  searchType: SearchType;
}

export type {
  CouponType,
  DataProps,
  DataArrayProps,
  SalesTableRowProps,
  SalesHistoryParams,
  SalesStatisticParams,
  SalesCouponDetailParams,
  SalesHistorySearch,
  SalesHistorySearchOption,
  SalesHistoryData,
  SalesStatisticData,
  SalesCouponDetailData,
  CouponUsageDetailContainerProps,
  SalesStatisticSearch,
  ChartFilter,
  SalesLineChartProps,
  SalesLineChartTooltipProps,
};
// option types
export {
  HISTORY_ORDER_TYPE,
  HISTORY_ORDER_STATE,
  HISTORY_RCP_TYPE,
  HISTORY_PAY_TYPE,
  HISTORY_PAY_WITH,
  HISTORY_GIFT_CERT,
  HISTORY_SEARCH_TYPE_LIST,
  STATISTIC_SEARCH_TYPE,
  STATISTIC_SEARCH_LIST,
};
