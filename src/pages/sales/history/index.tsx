import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useRecoilValue } from "recoil";
import { format, subDays, subYears } from "date-fns";

// global state
import { franState, loginState } from "state";

// Types
import { HISTORY_GIFT_CERT, HISTORY_ORDER_STATE, HISTORY_ORDER_TYPE, HISTORY_PAY_TYPE, HISTORY_RCP_TYPE, HISTORY_SEARCH_TYPE_LIST, SalesHistoryData, SalesHistorySearch } from "types/sales/salesType";
// Utils
import Utils from "utils/Utils";

// Components
import CalanderSearch from "pages/common/calanderSearch";
import PrefixSum from "pages/sales/history/PrefixSum";
import SalesHistory from "pages/sales/history/SalesHistory";
import Pagination from "pages/common/pagination";
import Loading from "pages/common/loading";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";
import Sticky from "pages/common/sticky";
import TableColGroup from "./table/TableColGroup";
import TableHead from "./table/TableHead";
import TableRow from "./table/TableRow";

const SalesHistoryContainer = () => {
	// global state
	const { userInfo } = useRecoilValue(loginState);
	const fCode = useRecoilValue(franState);
	const selectedFran = userInfo?.f_list.filter((info) => { return (info.f_code === fCode) });
	const fCodeName = selectedFran[0]?.f_code_name; // 가맹점명
	
	const today = new Date();

	// query data on SalesHistory
	const [totalData, setTotalData] = useState<SalesHistoryData[]>([]); // prefixSum 계산용 data (filter x)
	const [filteredData, setFilteredData] = useState<SalesHistoryData[]>([]); // table data (filter o)

	// filter options
	const [historySearch, setHistorySearch] = useState<SalesHistorySearch>({ 
		from: format(new Date(subDays(today, 6)), 'yyyy-MM-dd'), 
		to: format(new Date(today), 'yyyy-MM-dd'),
		searchOption: [
			{ title: '주문유형 전체', value: 'total' },
			{ title: '주문상태 전체', value: 'total' },
			{ title: '접수타입 전체', value: 'total' },
			{ title: '결제방식 전체', value: 'total' },
			{ title: '상품 전체', value: 'total' },
		]
	});

	// queryTrigger for refetching
	const [queryTrigger, setQueryTrigger] = useState({ from: historySearch.from, to: historySearch.to });
	
	// 취소 주문 표시 여부 0: 취소주문감추기 1: 취소주문표시
	const [isCancelShow, setIsCancelShow] = useState<0|1>(1);
	// 쿠팡/배민 주문 제외 여부 0: 쿠팡/배민표시 1:쿠팡/배민제외
	const [isExcludeCouBae, setIsExcludeCouBae] = useState<0|1>(0);

	// 엑셀 컴포넌트 생성용
	const [isDownloadExcel, setIsDownloadExcel] = useState<boolean>(false);
	
	// pagination
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [rowPerPage, setRowPerPage] = useState<number>(20);

	// select options 내용
	const searchOptionList = [
		{
			[HISTORY_ORDER_TYPE.TOTAL]: { title: '주문유형 전체', value: 'total' },
			[HISTORY_ORDER_TYPE.CAFE]: { title: '매장주문', value: '0' },
			[HISTORY_ORDER_TYPE.APP]: { title: '앱배달주문', value: '1' },
			[HISTORY_ORDER_TYPE.COUBAE]: { title: '쿠팡/배민주문', value: '2' },
			// [HISTORY_ORDER_TYPE.BAEMIN]: { title: '배민주문', value: '3' },
		},
		{
			[HISTORY_ORDER_STATE.TOTAL]: { title: '주문상태 전체', value: 'total' },
			[HISTORY_ORDER_STATE.AWAIT]: { title: '대기', value: '0' },
			[HISTORY_ORDER_STATE.MAKING]: { title: '제조중', value: '10' },
			[HISTORY_ORDER_STATE.MAKING_FINISH]: { title: '제조완료', value: '30' },
			[HISTORY_ORDER_STATE.DELIVERY]: { title: '배달중', value: '35' },
			[HISTORY_ORDER_STATE.COMPLETE]: { title: '완료', value: '40' },
			// [HISTORY_ORDER_STATE.CANCEL]: { title: '취소', value: '50' },
		},
		{
			[HISTORY_RCP_TYPE.TOTAL]: { title: '접수타입 전체', value: 'total' },
			[HISTORY_RCP_TYPE.APP]: { title: '앱', value: '앱' },
			[HISTORY_RCP_TYPE.KIOSK]: { title: '키오스크', value: '키오스크' },
			[HISTORY_RCP_TYPE.POS]: { title: '직접결제POS', value: '직접결제POS' },
			[HISTORY_RCP_TYPE.FPROCESS]: { title: '매장앱', value: '매장앱' },
			[HISTORY_RCP_TYPE.NA]: { title: 'N/A', value: 'N/A' },
		},
		{
			[HISTORY_PAY_TYPE.TOTAL]: { title: '결제방식 전체', value: 'total' },
			[HISTORY_PAY_TYPE.COMPLETE]: { title: '결제완료', value: '결제완료' },
			[HISTORY_PAY_TYPE.CARD]: { title: '현장카드결제', value: '현장카드' },
			[HISTORY_PAY_TYPE.CASH]: { title: '현장현금결제', value: '현장현금' },
			// [HISTORY_PAY_TYPE.CANCEL]: { title: '결제취소', value: '결제취소' },
		},
		{
			[HISTORY_GIFT_CERT.TOTAL]: { title: '상품 전체', value: 'total' },
			[HISTORY_GIFT_CERT.PRODUCT]: { title: '일반제품', value: '0' },
			[HISTORY_GIFT_CERT.GIFT_CERT]: { title: '실물상품권', value: '1' },
		}
	];

	/* sticky 기준 ref */
	const stickyRef = useRef<HTMLTableRowElement>(null);
    const tableRef = useRef<HTMLTableElement>(null); // 실제 data가 들어간 table
   
	/* excel download */
    const excelRef = useRef<HTMLTableElement>(null); // excel 출력용 table
  
    const excelDownload = useCallback(() => {
		const {from, to} = historySearch;
        if (excelRef.current) {
            // Excel - sheet options: 셀 시작 위치, 셀 크기
            const options = {
                type: 'table', // 필수 O
                sheetOption: { origin: "A1" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
                colspan: [{wch: 13}, {wch: 13}, {wch: 13}, {wch: 13}, {wch: 13}, {wch: 13}, {wch: 28}, {wch: 6}, {wch: 15}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 14}, {wch: 14}, {wch: 14}, ], // 셀 너비 설정, 필수 X
                addRowColor: { row: [1,2], color: ['d3d3d3','d3d3d3'] },
                sheetName: '주문내역', // 시트이름, 필수 X
            };
            try { Utils.excelDownload(excelRef.current, options, `${fCodeName}_주문내역(${from}~${to})`); }
            catch (error) { console.log(error); }
        }
		return setIsDownloadExcel(false);
    }, [fCodeName, historySearch]);

	// queryKey changing function for search(refetch)
	const handleSearch = () => {
		const { from, to } = historySearch;
		setQueryTrigger({ from, to });
	}
	
	useEffect(() => {
		isDownloadExcel && excelDownload();
	}, [isDownloadExcel, excelDownload]);

	return (
		<>
			<div className='info-wrap'>
				<p>※ 주문내역을 조회할 수 있습니다. (최대 12개월 이내)</p>
			</div>
			<div className='fixed-paid-point-wrap'>
				{/* <!-- 공통 검색 Calendar with select --> */}
				<CalanderSearch 
					dateType='yyyy-MM-dd' 
					searchInfo={historySearch} 
					setSearchInfo={setHistorySearch} 
					optionType='SELECT' 
					selectOption={searchOptionList}
					optionList={HISTORY_SEARCH_TYPE_LIST} // option 맵핑할 때 사용  
					handleSearch={handleSearch} // 실제 검색하는 함수 (ex. refetch)
					minDate={subYears(today, 1)} // 검색가능한 기간(시작일) 설정
				/>
				<div className='search-result-wrap'>
					<div className='search-date'>
						<p>조회기간: {historySearch.from} ~ {historySearch.to}</p>
					</div>
					{/* 누적 합계 */}
					<PrefixSum data={totalData} />
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
				{/* <!-- 주문내역 Table --> */}
				<Sticky reference={stickyRef.current} contentsRef={tableRef.current}>
					<TableColGroup />
					<TableHead />
				</Sticky>
				<table className='board-wrap board-top' cellPadding='0' cellSpacing='0' ref={tableRef}>
					<TableColGroup />
					<TableHead ref={stickyRef} />
					<tbody>
						<ErrorBoundary fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage isTable={true} resetErrorBoundary={resetErrorBoundary} />} onError={(e) => console.log('error on Today: ', e)}>
							<Suspense fallback={<Loading width={100} height={100} marginTop={16} isTable={true} />}>
								<SalesHistory
									queryTrigger={queryTrigger}
									tableData={filteredData}
									setTableData={setFilteredData}
									setTotalData={setTotalData}
									historySearch={historySearch}
									isCancelShow={isCancelShow}
									isExcludeCouBae={isExcludeCouBae}
									currentPage={currentPage}
									rowPerPage={rowPerPage}
								/>
							</Suspense>
						</ErrorBoundary>
					</tbody>
				</table>
				{/* excel table */}
				{
					isDownloadExcel ? (
						<table className='board-wrap board-top excel-table' cellPadding='0' cellSpacing='0' ref={excelRef}>
							<TableColGroup />
							<TableHead />
							<tbody>
								{
									filteredData.map((data) => <TableRow data={data} key={`history_excel_${data.nOrderID}`} />)
								}
							</tbody>
						</table>
					) : 
					null
				}
			</div>
			{/* <!-- 엑셀다운, 페이징, 정렬 --> */}
			<div className='result-function-wrap'>
				<div className='function'>
					<button className='goast-btn' onClick={() => setIsDownloadExcel(true)} disabled={filteredData.length === 0 && isDownloadExcel}>엑셀다운</button>
				</div>
				<Pagination
					dataCnt={filteredData.length}
					pageInfo={{row: rowPerPage, currentPage}}
					handlePageChange={setCurrentPage}
					handlePageRow={setRowPerPage}
				/>
			</div>
		</>
	);
};

export default SalesHistoryContainer;