import { CommonParams } from "types/common";

// API Params
interface BoardListParams extends CommonParams {
    staff_no: number;
    search_type: 1|2; // 1: 공지사항, 2: 자료실
}
interface SalesTermsParams extends CommonParams {
    search_type: 'W'|'M'; // W: 1주 매출, M: 월별 매출 
    search_month: string;
}

// Component Props
interface BoardProps {
	boardClass: string;     // className
	title: string;		    // 제목
	url: string;			// 게시판 url
    suffix?: string;        // 부제: (총 매출/누적)
	showLink?: boolean;
	children: React.ReactNode;
}
interface BoardItemProps {
	url: string;
	boardType: number;
	boardId: number;
	important: string;  // 긴급, 중요 표시
	name: string;
	title: string;
	date: string;
}
interface CalendarHeaderProps {
	currentDate: Date;
	prevMonth: () => void;
	nextMonth: () => void;
}
interface CalendarBodyProps {
	currentDate: Date;
	data: any;
}

export type {
    CommonParams,
    BoardListParams,
    SalesTermsParams,
    BoardProps,
    BoardItemProps,
	CalendarHeaderProps,
	CalendarBodyProps,
}