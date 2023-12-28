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
