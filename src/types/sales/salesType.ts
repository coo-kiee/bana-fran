import { Point } from "@nivo/line";
import { CommonParams } from "types/common";

// common
type SearchType = 'D'|'M';
type Bit = 0|1;

interface DataProps<T> {
	data: T;
}
interface DataArrayProps<T> {
	data: T[]; 
}
// API params type
interface SalesOrderParams extends CommonParams {
	from_date: string;
	to_date: string;
}
interface SalesStatisticParams extends SalesOrderParams {
	search_type: SearchType;
}
interface SalesQueryTrigger {
	from: string;
	to: string;
}

// API Output
interface SalesHistoryData {
	[key: string]: number|string;
	bOrderGiftCert: '0'|'1';
	bana_point: number;
	cancel_date: string;
	card_charge: number;
	cash_charge: number;
	dtRcp: string;
	etc_delivery_charge: number;
	fran_coupon_charge: number;
	hd_coupon_charge: number;
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
	pay_type: '결제완료'|'현장카드'|'현장현금';
	phone: string;
	rcp_date: string;
	rcp_type: string;
	sChargeDisDetail: string;
	sChargeDisReason: string;
	sCouponID: string;
	small_point: number;
}
interface SalesStatisticData {
	[key: string]: number|string;
	app_card_amt: number;
	app_delivery_amt: number;
	app_delivery_charge: number;
	bana_point: number;
	etc_delivery_amt: number;
	etc_delivery_charge: number;
	fran_coupon_charge: number; 
	free_sales_amt: number;
	hd_coupon_charge: number;
	kiosk_card_amt: number;
	paid_point: number;
	paid_sales_amt: number;
	pos_cash_amt: number;
	std_date: string;
	total_sales_amt: number;
}
/* option value에 사용할 값 관련 타입들 */

// history option types
// 주문유형(ORDER_TYPE)
const HISTORY_ORDER_TYPE = {
	TOTAL: 'total',
	CAFE: '0',
	APP: '1',
	COUBAE: '2',
}
// 주문상태(ORDER_STATE)
const HISTORY_ORDER_STATE = {
	TOTAL: 'total',
	AWAIT: '5',
	MAKING: '10',
	MAKING_FINISH: '30',
	DELIVERY: '35',
	COMPLETE: '40',
	// CANCEL: '50',
}
// 접수타입(RCP_TYPE)
const HISTORY_RCP_TYPE = {
	TOTAL: 'total',
	APP: '앱',
	KIOSK: '키오스크',
	POS: '직접결제POS',
	FPROCESS: '매장앱',
	NA: 'N/A'
}
// 결제방식(PAY_TYPE)
const HISTORY_PAY_TYPE = {
	TOTAL: 'total',
	COMPLETE: '결제완료',
	CARD: '현장카드',
	CASH: '현장현금',
	// CANCEL: '결제취소',
}
// 일반제품(GIFT_CERT)
const HISTORY_GIFT_CERT = {
	TOTAL: 'total',
	PRODUCT: '0',
	GIFT_CERT: '1',
}

// select안에서 사용할 option의 타입 LIST
const HISTORY_SEARCH_TYPE_LIST = [
	[
		HISTORY_ORDER_TYPE.TOTAL,
		HISTORY_ORDER_TYPE.CAFE,
		HISTORY_ORDER_TYPE.APP,
		HISTORY_ORDER_TYPE.COUBAE,
	],
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
		HISTORY_GIFT_CERT.TOTAL,
		HISTORY_GIFT_CERT.PRODUCT,
		HISTORY_GIFT_CERT.GIFT_CERT,
	],
]

// statistic option types
const STATISTIC_SEARCH_TYPE = {
	DAY: 'D',
	MONTH: 'M'
}
// select안에서 사용할 option의 타입 LIST
const STATISTIC_SEARCH_LIST = [
	STATISTIC_SEARCH_TYPE.DAY,
	STATISTIC_SEARCH_TYPE.MONTH
]

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
interface SalesHistoryProps {
    queryTrigger: SalesQueryTrigger; // queryTrigger for react query
	tableData: SalesHistoryData[]; // 필터링된 데이터
	setTableData: React.Dispatch<React.SetStateAction<SalesHistoryData[]>>;
	setTotalData: React.Dispatch<React.SetStateAction<SalesHistoryData[]>>;
	historySearch: SalesHistorySearch; // 검색조건(filter)
	isCancelShow: Bit; // 취소 주문 표시
	isExcludeCouBae: Bit; // 쿠팡/배민 주문 제외
	currentPage: number; // 현재 페이지
	rowPerPage: number; //페이지 당 컨텐츠 수
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
interface SalesTableDetailProps {
    currentPage: number;
    rowPerPage: number;
	searchType?: SearchType; 
	data: SalesStatisticData[];
}

export type {
    DataProps, 
	DataArrayProps,
	SalesTableDetailProps,
	SalesOrderParams,
	SalesStatisticParams,
	SalesQueryTrigger,
    SalesHistorySearch, 
	SalesHistoryData,
	SalesStatisticData,
	SalesHistoryProps,
    SalesStatisticSearch, 
    ChartFilter, 
    SalesLineChartProps, 
	SalesLineChartTooltipProps
};
// option types
export {
    HISTORY_ORDER_TYPE,
    HISTORY_ORDER_STATE,
    HISTORY_RCP_TYPE,
    HISTORY_PAY_TYPE,
    HISTORY_GIFT_CERT,
    HISTORY_SEARCH_TYPE_LIST,
    STATISTIC_SEARCH_TYPE,
    STATISTIC_SEARCH_LIST
}