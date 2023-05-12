import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { format, isAfter, subDays, subMonths } from "date-fns";

// global state
import { franState, loginState } from "state";

// API
import SALES_SERVICE from 'service/salesService';
// Types
import { SalesStatisticSearch, ChartFilter, STATISTIC_SEARCH_LIST, STATISTIC_SEARCH_TYPE } from "types/sales/salesType";
// Utils
import Utils from "utils/Utils";
// Components
import Loading from "pages/common/loading";
import Pagination from "pages/common/pagination";
import CalanderSearch from "pages/common/calanderSearch";
import LineChart from "pages/sales/statistic/chart";
import NoData from 'pages/common/noData';
import Sticky from "pages/common/sticky";
import TableColGroup from "./table/TableColGroup";
import TableHead from "./table/TableHead";
import TablePrefixSum from "./table/TablePrefixSum";
import TableRow from "./table/TableRow";
import Wrapper from "pages/common/loading/Wrapper";

const SalesStatistic = () => {
	// global state
	const { userInfo } = useRecoilValue(loginState);
	const fCode = useRecoilValue(franState);
	const selectedFran = userInfo?.f_list.filter((info) => { return (info.f_code === fCode) });
	const fCodeName = selectedFran[0]?.f_code_name || ''; // 가맹점명
	
	// const today = today;
	const today = new Date();
	// filter options
    const [statisticSearch, setStatisticSearch] = useState<SalesStatisticSearch>({ searchType: 'D', from: format(subMonths(today, 1), 'yyyy-MM-dd'), to: format(today, 'yyyy-MM-dd') });
    const [chartFilter, setChartFilter] = useState<ChartFilter>({ total: 1, paid: 0, app: 0, free: 0 });

	// 엑셀 컴포넌트 생성용
	const [isLoadingExcel, setIsLoadingExcel] = useState(false);
	const [isDownloadExcel, setIsDownloadExcel] = useState(false);

	// pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [rowPerPage, setRowPerPage] = useState(20);

	// queryTrigger
	const [queryTrigger, setQueryTrigger] = useState({ from: statisticSearch.from, to: statisticSearch.to });

	// query
	// 월별 검색(M)이면 from/to에 -01 string 추가 M: yy-MM, D: yy-MM-dd 포멧
	const { data, isFetching } = SALES_SERVICE.useSalesStatistic({ 
		f_code: fCode, 
		search_type: statisticSearch.searchType, 
		from_date: statisticSearch.searchType === 'M' ? (statisticSearch.from + '-01') : statisticSearch.from, 
		to_date: statisticSearch.searchType === 'M' ? (statisticSearch.to + '-01') : statisticSearch.to 
	}, queryTrigger)

	// data 역순 정렬 (table용)
	const sortedData =  useMemo(() => {return data ? [...data].reverse() : []}, [data]);
	
	// 데이터 조회 후 검색 조건 저장 (조건 비교용. refetch 전까지 기존 값이 유지되도록)
	const searchTypeMemo = useMemo(() => {return statisticSearch.searchType}, [data]);

	/* 검색 기간 필터링 (onChange) */
	// select options list
	const searchOptionList = [{
		[STATISTIC_SEARCH_TYPE.DAY]: { title: '일별', id: 'day', value: 'D' },
		[STATISTIC_SEARCH_TYPE.MONTH]: { title: '월별', id: 'month', value: 'M' },
	}];

	/* sticky 기준 ref */
	const stickyRef = useRef<HTMLTableRowElement>(null);
    const tableRef = useRef<HTMLTableElement>(null); // 실제 data가 들어간 table
    
	/* excel download */
    const excelRef = useRef<HTMLTableElement>(null); // excel 출력용 table

    const excelDownload = useCallback(() => {
		const {searchType, from, to} = statisticSearch;
        if (excelRef.current) {
            // Excel - sheet options: 셀 시작 위치, 셀 크기
            const options = {
                type: 'table', // 필수 O
                sheetOption: { origin: "A1" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
                colspan: [{wch: 16}, {wch: 16}, {wch: 16}, {wch: 16}, {wch: 16}, {wch: 16}, {wch: 16}, {wch: 16}, {wch: 16}, {wch: 16}, {wch: 16}, {wch: 16}, {wch: 22}, {wch: 16}, {wch: 16},], // 셀 너비 설정, 필수 X
                addRowColor: { row: [1,2,3], color: ['d3d3d3','d3d3d3','ffc89f'] },
                sheetName: '매출통계', // 시트이름, 필수 X
            };
            try { Utils.excelDownload(excelRef.current, options, `${fCodeName}_${searchType === 'D' ? '일별' : '월별'}_매출통계(${from}~${to})`); }
            catch (error) { console.log(error); }
        }
		setIsDownloadExcel(false);
		setIsLoadingExcel(false);
    }, [fCodeName, statisticSearch]);

	// 제한 조건(90일)을 넘어가면 refecth를 막고 날짜 바꿔주는 함수
	const handleSearch = useCallback(() => {
		const today = new Date();
		const limitDate = subDays(today, 90);
		const { searchType, from, to } = statisticSearch;
		// 90일 이내의 날짜인지
		const isFromWithinRange = isAfter(new Date(from + ' 23:59:59'), limitDate);
		const isToWithinRange = isAfter(new Date(to + ' 23:59:59'), limitDate);
		const isPeriodWithinRange = isFromWithinRange && isToWithinRange;

		if (searchType === 'D' && !isPeriodWithinRange) {
			// 범위에 맞는 날짜로 변경
			setStatisticSearch((prev) => ({
				...prev, 
				from: isFromWithinRange ? from : format(limitDate, 'yyyy-MM-dd'), 
				to: isToWithinRange ? to : format(today, 'yyyy-MM-dd')
			}));
			return alert('일별 매출 통계는 오늘부터 90일 전까지만 조회할 수 있습니다.');
		}
		setQueryTrigger({ from, to });
	}, [statisticSearch]);

	// loading띄우고 excelDownload 진행
	useEffect(() => {
		isLoadingExcel && setIsDownloadExcel(true);
	}, [isLoadingExcel]);
	
	useEffect(() => {
		if (isDownloadExcel) {
			excelDownload();
		}
	}, [excelDownload, isDownloadExcel]);		
	
	// 검색하면 현재 페이지 번호 초기화
	useEffect(() => {
		setCurrentPage(1)
	}, [queryTrigger])

	return (
		<>
			<div className='info-wrap'>
				<p>※ 매출통계를 조회할 수 있습니다. (최대 {statisticSearch.searchType === 'M' ? '12개월' : '90일'} 이내)</p>
			</div>
			<div className='fixed-paid-point-wrap'>
				<div className='chart-filter-wrap'>
					{/* <!-- 공통 검색 Calendar with select --> */}
					<CalanderSearch 
						dateType={statisticSearch.searchType === 'M' ? 'yyyy-MM' : 'yyyy-MM-dd'}
						searchInfo={statisticSearch} 
						setSearchInfo={setStatisticSearch}	
						optionType='RADIO'
						radioOption={searchOptionList}
						optionList={STATISTIC_SEARCH_LIST}
						handleSearch={handleSearch}
						minDate={statisticSearch.searchType === 'M' ? new Date(today.getFullYear()-1, today.getMonth(), 1) : subDays(today, 90)}
						showMonthYearPicker={statisticSearch.searchType === 'M' ? true : false}
						showFullMonthYearPicker={statisticSearch.searchType === 'M' ? true : false}
					/>
					{/* <!-- checkbox filter --> */}
					<div className='chart-filter'>
						<div className='checkbox-wrap'>
							<input
								className='check'
								type='checkbox'
								id='total-sales'
								checked={chartFilter.total === 1}
								value={chartFilter.total}
								onChange={(e) => {
									setChartFilter({ ...chartFilter, total: e.target.checked ? 1 : 0 })
								}}
							/>
							<label htmlFor='total-sales'>총 매출</label>
						</div>
						<div className='checkbox-wrap'>
							<input
								className='check'
								type='checkbox'
								id='paid-sales'
								checked={chartFilter.paid === 1}
								value={chartFilter.paid}
								onChange={(e) => {
									setChartFilter({ ...chartFilter, paid: e.target.checked ? 1 : 0 })
								}}
							/>
							<label htmlFor='paid-sales'>유상매출</label>
						</div>
						<div className='checkbox-wrap'>
							<input
								className='check'
								type='checkbox'
								id='delivery-sales'
								checked={chartFilter.app === 1}
								value={chartFilter.app}
								onChange={(e) => {
									setChartFilter({ ...chartFilter, app: e.target.checked ? 1 : 0 })
								}}
							/>
							<label htmlFor='delivery-sales'>배달매출</label>
						</div>
						<div className='checkbox-wrap'>
							<input
								className='check'
								type='checkbox'
								id='free-sales'
								checked={chartFilter.free === 1}
								value={chartFilter.free}
								onChange={(e) => {
									setChartFilter({ ...chartFilter, free: e.target.checked ? 1 : 0 })
								}}
							/>
							<label htmlFor='free-sales'>무상서비스</label>
						</div>
					</div>
				</div>
				{/* <!-- 차트 --> */}
				<div className='chart-wrap'>
					<div className='line-chart chart'>
						{!(isFetching) ? ( // loading, refetching 아닐 때
							data ? 
							<LineChart chartFilter={chartFilter} data={data} searchType={searchTypeMemo} /> : 
							<div className="no-chart"><NoData /></div>
						) : (
							<div className='chart-loading-wrap'>
								<Loading width={100} height={100} marginTop={0} />
							</div>
						)}
					</div>
				</div>
				<div className='search-result-wrap'>
					<div className='detail-info-wrap'>
						<div className='price-info'>
							<p className='hyphen'>총 매출(자체 앱주문 배달비 포함): 유상매출+무상서비스</p>
						</div>
					</div>
				</div>
				{/* <!-- 매출통계 Table --> */}
				<Sticky reference={stickyRef.current} contentsRef={tableRef.current}>
					<TableColGroup />
					<TableHead />
				</Sticky>
				<table className='board-wrap board-top' cellPadding='0' cellSpacing='0' ref={tableRef}>
					<TableColGroup />
					<TableHead ref={stickyRef} />
					<tbody>
						{
							(isFetching) ?
							<Loading width={100} height={100} marginTop={16} isTable={true} /> :
							<>
								<TablePrefixSum data={data || []} />
								{data && data.length > 0 ? (
									sortedData.map((sData, idx) => {
										// pagination
										const isDisplay = (currentPage - 1) * rowPerPage <= idx && currentPage * rowPerPage > idx;
										return isDisplay ? <TableRow data={sData} key={`statistic_table_row_${idx}`} /> : null;
									})
								) : (
									<NoData isTable={true} rowSpan={1} colSpan={15} paddingTop={20} paddingBottom={20} />
								)}
							</>
						}
					</tbody>
				</table>
				{/* Excel Table */}
				{/* Excel Loading */}
				<Wrapper isRender={isLoadingExcel} isFixed={true} width='100%' height='100%'>
					<Loading marginTop={0} />
				</Wrapper>
				{
					isDownloadExcel ? (
						<>
							<table className='board-wrap board-top excel-table' cellPadding='0' cellSpacing='0' ref={excelRef}>
								<TableColGroup />
								<TableHead />
								<tbody>
									<TablePrefixSum data={data || []} />
									<>
										{sortedData?.map((statisticData, idx) => {
											return <TableRow data={statisticData} key={`statistic_excel_row_${idx}`} />
										})}
									</>
								</tbody>
							</table>
						</>
					) : 
					null
				}
			</div>
			{/* <!-- 엑셀다운, 페이징, 정렬 --> */}
			<div className='result-function-wrap'>
				<div className='function'>
					<button className='goast-btn' onClick={() => setIsLoadingExcel(true)} disabled={isFetching || isDownloadExcel}>엑셀다운</button>
				</div>
				<Pagination 
					dataCnt={sortedData?.length} 
					pageInfo={{row: rowPerPage, currentPage}} 
					handlePageChange={setCurrentPage} 
					handlePageRow={setRowPerPage}
				/>
			</div>
		</>
	);
};

export default SalesStatistic;
