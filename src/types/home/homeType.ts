import { CommonParams } from "types/common";

// API Params
interface BoardListParams extends CommonParams {
    staff_no: number;
    search_type: 1|2; // 1: 공지사항, 2: 자료실
}
interface SalesTermsParams extends CommonParams {
    search_type: 'W'|'M'; 	// W: 주간, M: 월별
    search_month?: string;	// search_type이 M일 때 필요
}
// API Output
interface HomeBoardData {
	board_id: number;
	board_type: 1|6;
	category: number;
	category_name: string;
	important: '0'|'1';
	insert_date: string;
	insert_user_name: string;
	modify_date: string;
	modify_user_name: string;
	open_flag: string;
	title: string;
}
interface HomeMembershipData {
	bana_point: number;
	month_coupon_cnt: number;
	stamp_coupon_amt: number;
	stamp_coupon_cnt: number;
}
interface HomeSalesTodayData {
	bana_point: number;
	card_charge: number;
	cash_charge: number;
	d_store_coupon_charge: number;
	delivery_charge: number;
	etc_delivery_charge: number;
	fran_coupon_charge: number;
	hd_coupon_charge: number;
	paid_point: number;
}
interface HomeSalesTermsData {
	[key: string]: string | number;
	sales_charge: number;
	std_date: string;
	weekday_name: 'S'|'M'|'T'|'W'|'F';
}
interface HomeMonthlyOrderData {
	deposit: number;
	log_date: string;
}
interface HomeCalculateListData {
	receive_charge: number;
	send_charge: number;
	status: number;
	status_name: string;
	std_month: string;
	total_send_charge: number;
}
// Component Props
interface BoardProps {
	boardClass: string; // className
	title: string;
	url: string;
    suffix?: string; // 부제: (총 매출/누적)
	showLink?: boolean;
	children: React.ReactNode;
}
interface BoardItemProps {
	url: string;
	boardType: number;
	boardId: number;
	important: '0'|'1';  // 긴급, 중요 표시
	name: string;
	title: string;
	date: string;
}
interface BarChartTooltipHandlerParams {
	pageX: number;
	pageY: number;
	color: string;
	data: HomeSalesTermsData;
}
interface BarChartTooltipProps {
	id: string;
	color: string;
	value: string;
}
interface CalendarHeaderProps {
	selectedDate: Date;
	prevMonth: () => void;
	nextMonth: () => void;
}
interface CalendarBodyProps {
	selectedDate: Date;
	data: HomeSalesTermsData[];
}

export type {
    CommonParams,
    BoardListParams,
    SalesTermsParams,
	HomeBoardData,
	HomeMembershipData,
	HomeSalesTodayData,
	HomeSalesTermsData,
	HomeMonthlyOrderData,
	HomeCalculateListData,
    BoardProps,
    BoardItemProps,
	BarChartTooltipHandlerParams,
	BarChartTooltipProps,
	CalendarHeaderProps,
	CalendarBodyProps,
}