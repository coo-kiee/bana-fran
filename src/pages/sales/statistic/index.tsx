import { useMemo, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { format, isBefore, subDays } from "date-fns";
// import { ko } from 'date-fns/locale';
// datepicker
// import DatePicker from "react-datepicker";
// import 'react-datepicker/dist/react-datepicker.css';

// global states
import { franState } from "state";

// API
import SALES_SERVICE from 'service/salesService'
// Types
import { SalesStatisticSearch, FilterChart } from "types/sales/salesType";
// Utils
import Utils from "utils/Utils";
// Components
import LineChart from "pages/sales/statistic/chart";
import Loading from "pages/common/loading";
import SalesStatisticTable from "pages/sales/statistic/table";
import Pagination from "pages/common/pagination";
import CalanderSearch from "pages/common/calanderSearch";

// option value에 사용할 값 관련 타입
const STATISTIC_SEARCH_TYPE = {
	DAY: 'D',
	MONTH: 'M'
}
// select안에서 사용할 option의 타입 LIST
const STATISTIC_SEARCH_LIST = [
	STATISTIC_SEARCH_TYPE.DAY,
	STATISTIC_SEARCH_TYPE.MONTH
]

const SalesStatistic = () => {
	// global states
	const fCode = useRecoilValue(franState);

	// today
	const today = new Date();

	// filter options
    const [statisticSearch, setStatisticSearch] = useState<SalesStatisticSearch>({ searchType: 'D', from: format(new Date(today.getFullYear(), today.getMonth()-1, today.getDate()), 'yyyy-MM-dd'), to: format(new Date(today), 'yyyy-MM-dd') });
    const [filterChart, setFilterChart] = useState<FilterChart>({ total: 1, paid: 0, app: 0, free: 0 });

	// pagination
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [rowPerPage, setRowPerPage] = useState<number>(3);

	// query
	// 월별 검색(M)이면 from/to에 -01 string 추가
	const { data, isLoading, isFetching, refetch } = SALES_SERVICE.useSalesStatistic({ 
		f_code: fCode, search_type: statisticSearch.searchType, 
		from_date: statisticSearch.searchType === 'M' ? (statisticSearch.from + '-01') : statisticSearch.from, 
		to_date: statisticSearch.searchType === 'M' ? (statisticSearch.to + '-01') : statisticSearch.to 
	})

	// searchTypeMemo for Line Chart
	const searchTypeMemo = useMemo(() => {return statisticSearch.searchType}, [data]);
	
    // data && console.log(data);
	
	// 상태가 바뀔 때, 제한 조건(90일)을 넘어가면 제한날짜로 바꿔주는 함수
	// 구현해야함~!~!~!~!~!~!
	const handleSearch = () => {
		const limitDate = subDays(today.getFullYear(), 90);
		// console.log(isBefore(new Date('2022-08-17').setTime(today.getTime()), new Date(limitDate))) 
		// console.log(new Date(limitDate)) // 시간 있음(현재시간)
		// console.log(new Date('2022-08-17').setTime(today.getTime())) // 시간없음 09:00
		if (statisticSearch.searchType === 'D' && isBefore(new Date(statisticSearch.from), limitDate)) {
			setStatisticSearch((prev) => ({...prev, from: format(limitDate, 'yyyy-MM-dd')}))
			return alert('일별 매출 통계는 90일 이내로만 조회할 수 있습니다.')
		} else if (statisticSearch.searchType === 'D' && isBefore(new Date(statisticSearch.to), limitDate)) {
			setStatisticSearch((prev) => ({...prev, to: format(today, 'yyyy-MM-dd')}))
			return alert('조회 기간을 확인해주세요')
		}
		refetch()
	}

	// statisticSearch바뀔 때마다 제한조건에 맞는지 확인

	// useEffect(() => {
	// 	const limitDate = subDays(today, 90);
	// 	if (statisticSearch.searchType === 'D') {
	// 		isBefore(new Date(statisticSearch.from), limitDate) && setStatisticSearch((prev) => ({...prev, from: format(limitDate, 'yyyy-MM-dd')}))
	// 		isBefore(new Date(statisticSearch.to), limitDate) && setStatisticSearch((prev) => ({...prev, to: format(limitDate, 'yyyy-MM-dd')}))
	// 	} else {
	// 		setStatisticSearch((prev) => ({...prev, from: format(new Date(statisticSearch.from), 'yyyy-MM'), to: format(new Date(statisticSearch.to), 'yyyy-MM')}))
	// 	}
	// }, [statisticSearch, today])
	
	/* 검색 기간 필터링 (onChange) */
	
    /* excel download */
    const tableRef = useRef<HTMLTableElement>(null); // 엑셀 다운로드 대상 table
  
    const excelDownload = () => {
		const {searchType, from, to} = statisticSearch;
        if (tableRef.current) {
            // Excel - sheet options: 셀 시작 위치, 셀 크기
            const options = {
                type: 'table', // 필수 O
                sheetOption: { origin: "A1" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
                colspan: [{wch: 15}, {wch: 18}, {wch: 18}, {wch: 16}, {wch: 16}, {wch: 22}, {wch: 16}, {wch: 16}, {wch: 16}, {wch: 16}, {wch: 16}, {wch: 20}, {wch: 18}, {wch: 18}, ], // 셀 너비 설정, 필수 X
                addRowColor: { row: [1,2,3], color: ['d3d3d3','d3d3d3','ffc89f'] },
                sheetName: '매출 통계', // 시트이름, 필수 X
            };
            try { Utils.excelDownload(tableRef.current, options, `바나프레소 ${searchType === 'D' ? '일별' : '월별'} 매출통계(${from}~${to})`); }
            catch (error) { console.log(error); }
        }
    }

	// select options list
	const searchOptionList = [
		{
			[STATISTIC_SEARCH_TYPE.DAY]: { title: '일별', id: 'day', value: 'D' },
			[STATISTIC_SEARCH_TYPE.MONTH]: { title: '월별', id: 'month', value: 'M' },
		}
	]
	
	return (
		<>
			<div className='info-wrap'>
				<p>※ 매출통계를 조회할 수 있습니다. (최대 {statisticSearch.searchType === 'M' ? '12개월' : '90일'} 이내)</p>
			</div>
			<div className='fixed-paid-point-wrap'>
				<div className='chart-filter-wrap'>
					{/* <!-- 검색 --> */}
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
					{/* <!-- // 검색 --> */}
					<div className='chart-filter'>
						<div className='checkbox-wrap'>
							<input
								className='check'
								type='checkbox'
								id='total-sales'
								checked={filterChart.total === 1}
								value={filterChart.total}
								onChange={(e) => {
									e.target.checked
										? setFilterChart({ ...filterChart, total: 1 })
										: setFilterChart({ ...filterChart, total: 0 });
								}}
							/>
							<label htmlFor='total-sales'>총 매출</label>
						</div>
						<div className='checkbox-wrap'>
							<input
								className='check'
								type='checkbox'
								id='paid-sales'
								checked={filterChart.paid === 1}
								value={filterChart.paid}
								onChange={(e) => {
									e.target.checked
										? setFilterChart({ ...filterChart, paid: 1 })
										: setFilterChart({ ...filterChart, paid: 0 });
								}}
							/>
							<label htmlFor='paid-sales'>유상매출</label>
						</div>
						<div className='checkbox-wrap'>
							<input
								className='check'
								type='checkbox'
								id='delivery-sales'
								checked={filterChart.app === 1}
								value={filterChart.app}
								onChange={(e) => {
									e.target.checked
										? setFilterChart({ ...filterChart, app: 1 })
										: setFilterChart({ ...filterChart, app: 0 });
								}}
							/>
							<label htmlFor='delivery-sales'>배달매출</label>
						</div>
						<div className='checkbox-wrap'>
							<input
								className='check'
								type='checkbox'
								id='free-sales'
								checked={filterChart.free === 1}
								value={filterChart.free}
								onChange={(e) => {
									e.target.checked
										? setFilterChart({ ...filterChart, free: 1 })
										: setFilterChart({ ...filterChart, free: 0 });
								}}
							/>
							<label htmlFor='free-sales'>무상서비스</label>
						</div>
					</div>
					{/* <!-- 차트 --> */}
				</div>
				<div className='chart-wrap'>
					<div id='statistic-chart' className='line-chart chart'>
						{!(isLoading || isFetching) && data ? (
							<LineChart filterChart={filterChart} data={data} searchType={searchTypeMemo} />
						) : (
							<div className='chart-loading-wrap'>
								<Loading width={100} height={100} marginTop={0} />
							</div>
						)}
					</div>
				</div>
				{/* <!-- // 차트 --> */}
				{/* <!-- 조회기간 --> */}
				<div className='search-result-wrap'>
					<div className='detail-info-wrap'>
						<div className='price-info'>
							<p className='hyphen'>총 매출(자체 앱주문 배달비 포함): 유상매출+무상서비스</p>
						</div>
					</div>
				</div>
				{/* <!-- // 조회기간 --> */}
				{/* <!-- 게시판 --> */}
				<table className='board-wrap board-top' cellPadding='0' cellSpacing='0' ref={tableRef}>
					<SalesStatisticTable data={data} isLoading={isLoading} rowPerPage={rowPerPage} currentPage={currentPage} />
				</table>
				{/* <!-- 게시판 --> */}
			</div>
			{/* <!-- 엑셀다운, 페이징, 정렬 --> */}
			<div className='result-function-wrap'>
				<div className='function'>
					<button className='goast-btn' onClick={excelDownload}>엑셀다운</button>
				</div>
				<Pagination 
					dataCnt={data?.length} 
					pageInfo={{row: rowPerPage, currentPage, boundaryRange: 5}} 
					handlePageChange={setCurrentPage} 
					handlePageRow={setRowPerPage}
				/>
			</div>
		</>
	);
};

export default SalesStatistic;
