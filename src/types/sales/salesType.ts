import { CommonParams } from "types/common";

// common
type SearchType = 'D'|'M';

interface SalesTable {
	data: any;
    isLoading: boolean;
	rowPerPage: number;
	currentPage: number;
	searchType?: SearchType;
}

interface SalesTableBodyProps {
    data: any;
    currentPage: number;
    rowPerPage: number;
	searchType?: SearchType; 
}

// API params type
interface SalesOrderParams extends CommonParams {
	from_date: string;
	to_date: string;
}

interface SalesStatisticParams extends SalesOrderParams {
	search_type: SearchType;
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

// history
interface SalesHistorySearch {
	from: string;
	to: string;
	searchOption: any;
}
interface PrefixSumProps {
	data: any;
}

interface SalesHistoryProps {
    queryKey: number; // queryKey for react query
	historyData: any[]; // historyData
	setHistoryData: React.Dispatch<React.SetStateAction<any[]>>;
	historySearch: SalesHistorySearch; // 검색조건(filter)
	isCancelShow: 0 | 1; // 취소 주문 표시
	isExcludeCouBae: 0 | 1; // 쿠팡/배민 주문 제외
	currentPage: number; // 현재 페이지
	rowPerPage: number; //페이지 당 컨텐츠 수
}

// statistics
interface SalesStatisticSearch {
    searchType: SearchType;
    from: string;
    to: string;
}
interface FilterChart {
    total: 0 | 1;
    paid: 0 | 1;
    app: 0 | 1;
    free: 0 | 1;
}
interface SalesLineChartProps {
    filterChart: FilterChart;
    data: any;
    searchType: SearchType;
}
interface SalesLineChartTooltipProps {
	point: any;
    searchType: SearchType;
}

// types
export type {
    SalesTable, 
	SalesTableBodyProps,
	SalesOrderParams,
	SalesStatisticParams,
    SalesHistorySearch, 
    PrefixSumProps, 
	SalesHistoryProps,
    SalesStatisticSearch, 
    FilterChart, 
    SalesLineChartProps, 
	SalesLineChartTooltipProps,
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
    STATISTIC_SEARCH_LIST,
}