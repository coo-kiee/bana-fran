import { useEffect, useMemo, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { format, subYears } from "date-fns";

// global states
import { franState } from "state";

// API
import SALES_SERVICE from 'service/salesService'
// Types
import { SalesHistorySearch } from "types/sales/salesType";
// Utils
import Utils from "utils/Utils";

// Components
import CalanderSearch from "pages/common/calanderSearch";
import Pagination from "pages/common/pagination";
import SalesHistoryTable from "pages/sales/history/table";
import PrefixSum from "pages/sales/history/PrefixSum";
import StickyHeader from "./table/StickyHeader";


/* option value에 사용할 값 관련 타입들 */

// 주문 유형(ORDER_TYPE)
const HISTORY_ORDER_TYPE = {
	TOTAL: 'total',
	CAFE: '0',
	APP: '1',
	COUPANG: '2',
	BAEMIN: '3',
}
// 주문 상태(ORDER_STATE)
const HISTORY_ORDER_STATE = {
	TOTAL: 'total',
	AWAIT: '5',
	MAKING: '10',
	MAKING_FINISH: '30',
	DELIVERY: '35',
	COMPLETE: '40',
	CANCEL: '50',
}
// 접수타입(RCP_TYPE)
const HISTORY_RCP_TYPE = {
	TOTAL: 'total',
	APP: '앱',
	KIOSK: '키오스크',
	POS: '직접결제POS',
	FPROCESS: '매장앱'
}
// 결제방식(PAY_TYPE)
const HISTORY_PAY_TYPE = {
	TOTAL: 'total',
	COMPLETE: '결제완료',
	CARD: '현장카드',
	CASH: '현장현금',
	CANCEL: '결제취소',
}
// 일반제품(GIFT_CERT)
const HISTORY_GIFT_CERT = {
	TOTAL: 'total',
	GIFT: '0',
	CERT: '1',
}

// select안에서 사용할 option의 타입 LIST
const HISTORY_SEARCH_TYPE_LIST = [
	[
		HISTORY_ORDER_TYPE.TOTAL,
		HISTORY_ORDER_TYPE.CAFE,
		HISTORY_ORDER_TYPE.APP,
		HISTORY_ORDER_TYPE.COUPANG,
		HISTORY_ORDER_TYPE.BAEMIN,
	],
	[
		HISTORY_ORDER_STATE.TOTAL,
		HISTORY_ORDER_STATE.AWAIT,
		HISTORY_ORDER_STATE.MAKING,
		HISTORY_ORDER_STATE.MAKING_FINISH,
		HISTORY_ORDER_STATE.DELIVERY,
		HISTORY_ORDER_STATE.COMPLETE,
		HISTORY_ORDER_STATE.CANCEL,
	],
	[
		HISTORY_RCP_TYPE.TOTAL,
		HISTORY_RCP_TYPE.APP,
		HISTORY_RCP_TYPE.KIOSK,
		HISTORY_RCP_TYPE.POS,
		HISTORY_RCP_TYPE.FPROCESS,
	],
	[
		HISTORY_PAY_TYPE.TOTAL,
		HISTORY_PAY_TYPE.COMPLETE,
		HISTORY_PAY_TYPE.CARD,
		HISTORY_PAY_TYPE.CASH,
		HISTORY_PAY_TYPE.CANCEL,
	],
	[
		HISTORY_GIFT_CERT.TOTAL,
		HISTORY_GIFT_CERT.GIFT,
		HISTORY_GIFT_CERT.CERT,
	],
]

const SalesHistory = () => {
	// global states
	const fCode = useRecoilValue(franState);
	
	const today = new Date();
	
	// filter options
	const [historySearch, setHistorySearch] = useState<SalesHistorySearch>({ 
		from: format(new Date(today.getFullYear(), today.getMonth()-1, today.getDate()), 'yyyy-MM-dd'), 
		to: format(new Date(today), 'yyyy-MM-dd'),
		searchOption: [
			{ title: '주문유형 전체', type: 'total' },
			{ title: '주문상태 전체', type: 'total' },
			{ title: '접수타입 전체', type: 'total' },
			{ title: '결제방식 전체', type: 'total' },
			{ title: '상품 전체', type: 'total' },
		]
	});

	// 취소 주문 표시 여부 0: 취소주문감추기 1: 취소주문표시
	const [isCancelShow, setIsCancelShow] = useState<0|1>(0);
	// 쿠팡/배민 주문 제외 여부 0: 쿠팡/배민표시 1:쿠팡/배민제외
	const [isExcludeCouBae, setIsExcludeCouBae] = useState<0|1>(0);

	// pagination
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [rowPerPage, setRowPerPage] = useState<number>(3);
    
	// sticky header display
	const [showSticky, setShowSticky] = useState<boolean>(false);
	const { data, isLoading, isRefetching, refetch } = SALES_SERVICE.useSalesOrderList({ from_date: historySearch.from, to_date: historySearch.to, f_code: fCode });


	// select options 내용
	const searchOptionList = [
		{
			[HISTORY_ORDER_TYPE.TOTAL]: { title: '주문유형 전체', value: 'total' },
			[HISTORY_ORDER_TYPE.CAFE]: { title: '매장주문', value: 'cafe' },
			[HISTORY_ORDER_TYPE.APP]: { title: '앱주문', value: 'app' },
			[HISTORY_ORDER_TYPE.COUPANG]: { title: '쿠팡주문', value: 'coupang' },
			[HISTORY_ORDER_TYPE.BAEMIN]: { title: '배민주문', value: 'baemin ' },
		},
		{
			[HISTORY_ORDER_STATE.TOTAL]: { title: '주문상태 전체', value: 'total' },
			[HISTORY_ORDER_STATE.AWAIT]: { title: '대기', value: '0' },
			[HISTORY_ORDER_STATE.MAKING]: { title: '제조중', value: '10' },
			[HISTORY_ORDER_STATE.MAKING_FINISH]: { title: '제조완료', value: '30' },
			[HISTORY_ORDER_STATE.DELIVERY]: { title: '배달중', value: '35' },
			[HISTORY_ORDER_STATE.COMPLETE]: { title: '완료', value: '40' },
			[HISTORY_ORDER_STATE.CANCEL]: { title: '취소', value: '50' },
		},
		{
			[HISTORY_RCP_TYPE.TOTAL]: { title: '접수타입 전체', value: 'total' },
			[HISTORY_RCP_TYPE.APP]: { title: '앱', value: 'app' },
			[HISTORY_RCP_TYPE.KIOSK]: { title: '키오스크', value: 'kiosk' },
			[HISTORY_RCP_TYPE.POS]: { title: '직접결제POS', value: 'pos' },
			[HISTORY_RCP_TYPE.FPROCESS]: { title: '매장앱', value: 'fprocess' },
		},
		{
			[HISTORY_PAY_TYPE.TOTAL]: { title: '결제방식 전체', value: 'total' },
			[HISTORY_PAY_TYPE.COMPLETE]: { title: '결제완료', value: 'complete' },
			[HISTORY_PAY_TYPE.CARD]: { title: '현장카드결제', value: 'card' },
			[HISTORY_PAY_TYPE.CASH]: { title: '현장현금결제', value: 'cash' },
			[HISTORY_PAY_TYPE.CANCEL]: { title: '결제취소', value: 'cancel' },
		},
		{
			[HISTORY_GIFT_CERT.TOTAL]: { title: '상품 전체', value: 'total' },
			[HISTORY_GIFT_CERT.GIFT]: { title: '실물상품권', value: 'gift' },
			[HISTORY_GIFT_CERT.CERT]: { title: '일반제품', value: 'cert' },
		}
		
	]

	data && console.log(data);

	// select box filter (change on refetch): order_type, order_state, rcp_rtpe, pay_type, gift_cert
	const filteredData = useMemo(() => {
		const orderType = historySearch.searchOption[0].type; 	// 주문유형 1: 앱 2:쿠팡 3: 배민 else: 매장
		const orderState = historySearch.searchOption[1].type;	// 주문상태
		const rcpType = historySearch.searchOption[2].type;		// 접수타입
		const payType = historySearch.searchOption[3].type;		// 결제방식 
		const giftCert = historySearch.searchOption[4].type;	// 0: 일반결제, 1: 상품권
		// console.log(orderType)
		let resultData = data;

		if (orderType !== 'total') { 
			resultData = resultData.filter((dd: any) => {return dd.order_type === Number(orderType)})
		}
		if (orderState !== 'total' && orderState !== '10') { // 주문상태
			// total과 제조중(10) 제외한 나머지 state			
			resultData = resultData.filter((dd: any) => {return dd.order_state === Number(orderState)})
		} else if (orderState !== 'total' && orderState === '10') { 
			// 제조중(10)이면 order_state === 10 또는 20
			resultData = resultData.filter((dd: any) => {return dd.order_state === 10 || dd.order_state === 20})
		}
		if (rcpType !== 'total') {
			resultData = resultData.filter((dd: any) => {return dd.rcp_type === rcpType})
		}
		if (payType !== 'total') {
			resultData = resultData.filter((dd: any) => {return dd.pay_type === payType})			
		}
		if (giftCert !== 'total') {
			resultData = resultData.filter((dd: any) => {return dd.gift_cert === Number(giftCert)})
		}
		// console.log(resultData)
		return resultData;
	}, [data, isRefetching]);

	// checkbox filter (without refetch)
	const checkedFilteredData = useMemo(() => {
		let resultData = filteredData;
		if (isCancelShow === 0) { // 취소주문 감출 때 (unchecked)
			resultData = resultData?.filter((dd: any) => {return dd.order_state !== 50});
		}
		if (isExcludeCouBae === 1) { // 쿠팡/배민 제외시 (checked)
			resultData = resultData?.filter((fd: any) => {return fd.order_type !== 2 && fd.order_type !== 3});
		}
		return resultData
	}, [isExcludeCouBae, filteredData, isCancelShow]);


    /* excel download */
    const tableRef = useRef<HTMLTableElement>(null); // 엑셀 다운로드 대상 table
  
    const excelDownload = () => {
		const {from, to} = historySearch;
        if (tableRef.current) {
            // Excel - sheet options: 셀 시작 위치, 셀 크기
            const options = {
                type: 'table', // 필수 O
                sheetOption: { origin: "A1" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
                colspan: [{wch: 13}, {wch: 13}, {wch: 13}, {wch: 13}, {wch: 13}, {wch: 13}, {wch: 28}, {wch: 6}, {wch: 15}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 14}, {wch: 14}, {wch: 14}, ], // 셀 너비 설정, 필수 X
                addRowColor: { row: [1,2], color: ['d3d3d3','d3d3d3'] },
                sheetName: '매출 통계', // 시트이름, 필수 X
            };
            try { Utils.excelDownload(tableRef.current, options, `바나프레소 주문내역(${from}~${to})`); }
            catch (error) { console.log(error); }
        }
    }
	
	return (
		// <Suspense fallback={<div style={{width: '800px', height: '1000px', backgroundColor: '#0000ff', position: 'fixed', zIndex: '10'}}>loading</div>}>
			<>
				<div className="loading-container"></div>
				<div className='info-wrap'>
					<p>※ 주문내역을 조회할 수 있습니다. (최대 12개월 이내)</p>
				</div>
				{/* <p>
					titles: {historySearch.searchOption[0].title}/{historySearch.searchOption[1].title}/{historySearch.searchOption[2].title}/{historySearch.searchOption[3].title}/{historySearch.searchOption[4].title} <br/>
					typeof: {typeof historySearch.searchOption[0].type}/{typeof historySearch.searchOption[1].type}/{typeof historySearch.searchOption[2].type}/{typeof historySearch.searchOption[3].type}/{typeof historySearch.searchOption[4].type}<br/>
					types: {historySearch.searchOption[0].type}/{historySearch.searchOption[1].type}/{historySearch.searchOption[2].type}/{historySearch.searchOption[3].type}/{historySearch.searchOption[4].type}
				</p> */}
				<div className='fixed-paid-point-wrap'>
					{/* <!-- 검색 --> */}
					<CalanderSearch 
						title='상세내역' 
						dateType='yyyy-MM-dd' 
						searchInfo={historySearch} 
						setSearchInfo={setHistorySearch} 
						optionType='SELECT' 
						selectOption={searchOptionList}
						optionList={HISTORY_SEARCH_TYPE_LIST} // option 맵핑할 때 사용  
						handleSearch={refetch} // 실제 검색하는 함수 (ex. refetch)
						minDate={subYears(today, 1)} // 검색가능한 기간(시작일) 설정
	 				/>
					{/* <!-- // 검색 --> */}
					{/* <!-- 조회기간 --> */}
					<div className='search-result-wrap'>
						<div className='search-date'>
							<p>조회기간: {historySearch.from} ~ {historySearch.to}</p>
						</div>
						<PrefixSum data={data || []} />
						<div className='detail-info-wrap'>
							<div className='price-info'>
								<p className='hyphen'>
									앱주문 배달이 아닌 배민/쿠팡 주문건의 경우 배달비가 표시되지 않습니다. (쿠팡/배민
									프로그램에서 확인 요망)
								</p>
								<p className='hyphen'>
									실물 상품권 주문금액은 어플 주문 건인 경우 본사계정으로 결제되며, 키오스크 주문건인 경우
									가상계좌에서 자동으로 출금됩니다.
								</p>
							</div>
							<div className='board-filter'>
								<div className='check-box'>
									<input className='check' type='checkbox' id='order' checked={isCancelShow === 1} onChange={(e) => {setIsCancelShow(e.target.value === '0' ? 1 : 0)}} value={isCancelShow} />
									<label htmlFor='order'>취소주문표시</label>
								</div>
								<div className='check-box'>
									<input className='check' type='checkbox' id='delivery' checked={isExcludeCouBae === 1} onChange={(e) => {setIsExcludeCouBae(e.target.value === '0' ? 1 : 0)}} value={isExcludeCouBae} />
									<label htmlFor='delivery'>쿠팡/배민 주문 제외</label>
								</div>
							</div>
						</div>
					</div>
					{/* <!-- // 조회기간 --> */}
					{/* <!-- 게시판 --> */}
					<table className='board-wrap board-top' cellPadding='0' cellSpacing='0' ref={tableRef}>
						<SalesHistoryTable 
							data={checkedFilteredData || []} isLoading={isLoading || isRefetching} rowPerPage={rowPerPage} currentPage={currentPage} />
					</table>
					{showSticky ? <StickyHeader /> : null}
					{/* <!-- 게시판 --> */}
				</div>
				{/* <!-- 엑셀다운, 페이징, 정렬 --> */}
				<div className='result-function-wrap'>
					<div className='function'>
						<button className='goast-btn' onClick={excelDownload}>엑셀다운</button>
					</div>
					<Pagination
						dataCnt={checkedFilteredData?.length || 0}
						pageInfo={{row: rowPerPage, currentPage, boundaryRange: 5}}
						handlePageChange={setCurrentPage}
						handlePageRow={setRowPerPage}
					/>
				</div>
			</>
		// </Suspense>
	);
};

export default SalesHistory;
