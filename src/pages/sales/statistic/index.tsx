import { useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { format } from "date-fns";
import { ko } from 'date-fns/locale';
// datepicker
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

// global states
import { franState } from "state";

// API
import SALES_SERVICE from 'service/salesService'
// Types
import { SalesStatisticPeriod, FilterSales } from "types/sales";
// Utils
import Utils from "utils/Utils";
// Components
import LineChart from "pages/sales/statistic/chart";
import Loading from "pages/common/loading";
import SalesStatisticTable from "pages/sales/statistic/table";
import Pagination from "pages/common/pagination";

const SalesStatistic = () => {
	// global states
	const fCode = useRecoilValue(franState);

	// today
	const today = new Date();

	// filter options
    const [statisticPeriod, setStatisticPeriod] = useState<SalesStatisticPeriod>({ searchType: 'D', from: format(new Date(today.getFullYear(), today.getMonth()-1, today.getDate()), 'yyyy-MM-dd'), to: format(new Date(today), 'yyyy-MM-dd') });
    const [filterSales, setFilterSales] = useState<FilterSales>({ total: 1, paid: 1, app: 1, free: 1 });

	// pagination
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [rowPerPage, setRowPerPage] = useState<number>(3);
    
	// query
	const { data, isLoading, isFetching, refetch } = SALES_SERVICE.useSalesStatistic({ f_code: fCode, search_type: statisticPeriod.searchType, from_date: statisticPeriod.from, to_date: statisticPeriod.to })

    console.log(data)

	/* 검색 기간 필터링 (onChange) */
	
	// 날짜 범위 설정 (from/to)
	const handlePeriodRange = (date: Date, key: string) => {
		console.log(date)
		setStatisticPeriod({...statisticPeriod, [key]: format(date, 'yyyy-MM-dd')})
	}

	// 일별/월별 설정 (searchType: 'D'|'M')
	const handlePeriodType = (type: 'D'|'M') => {
		type === 'M' ? // 월별 검색이면 선택 기간을 각 월의 1일로 변환
		setStatisticPeriod({
			from: format(new Date(statisticPeriod.from), 'yyyy-MM-01'), 
			to: format(new Date(statisticPeriod.to), 'yyyy-MM-01'),
			searchType: type 
		}) :
		setStatisticPeriod({ ...statisticPeriod, 
			from: format(new Date(statisticPeriod.from), 'yyyy-MM-dd'),
			to: format(new Date(statisticPeriod.to), 'yyyy-MM-dd'),
			searchType: type 
		});

	}
	
    /* excel download */
    const tableRef = useRef<HTMLTableElement>(null); // 엑셀 다운로드 대상 table
  
    const excelDownload = () => {
		console.log(tableRef.current)
        if (tableRef.current) {
            // Excel - sheet options: 셀 시작 위치, 셀 크기
            const options = {
                type: 'table', // 필수 O
                sheetOption: { origin: "A1" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
                colspan: [{wch: 15}, {wch: 18}, {wch: 18}, {wch: 16}, {wch: 16}, {wch: 22}, {wch: 16}, {wch: 16}, {wch: 16}, {wch: 16}, {wch: 16}, {wch: 20}, {wch: 18}, {wch: 18}, ], // 셀 너비 설정, 필수 X
                addRowColor: { row: [1,2,3], color: ['d3d3d3','d3d3d3','ffc89f'] },
                sheetName: '매출 통계', // 시트이름, 필수 X
            };
            try { Utils.excelDownload(tableRef.current, options, 'sales_statistic'); }
            catch (error) { console.log(error); }
        }
    }

	return (
		<>
			<div className='info-wrap'>
				<p>※ 매출통계를 조회할 수 있습니다. (최대 {statisticPeriod.searchType === 'M' ? '12개월' : '90일'} 이내)</p>
			</div>
			<div className='fixed-paid-point-wrap'>
				<div className='chart-filter-wrap'>
					{/* <!-- 검색 --> */}
					<div className='search-wrap'>
						<div className='input-wrap'>
							{/* <input type='text' placeholder={statisticPeriod.from} onClick={() => {}} /> */}
							<DatePicker 
								selected={new Date(today.getFullYear(), today.getMonth()-1, 1)} 
								value={statisticPeriod.from}
								locale={ko}
								dateFormat={'yy-MM-dd'}
								showMonthYearPicker={statisticPeriod.searchType === 'M' ? true : false}
								showFullMonthYearPicker={statisticPeriod.searchType === 'M' ? true : false}
								onChange={(date: Date) => handlePeriodRange(date, 'from')}
							/>
							<i>~</i>
							<DatePicker 
								selected={new Date(today.getFullYear(), today.getMonth(), 1)} 
								value={statisticPeriod.to}
								locale={ko}
								dateFormat={'yy-MM-dd'}
								showMonthYearPicker={statisticPeriod.searchType === 'M' ? true : false}
								showFullMonthYearPicker={statisticPeriod.searchType === 'M' ? true : false}
								onChange={(date: Date) => handlePeriodRange(date, 'to')}
							/>
						</div>
						<div className='radio-wrap'>
							<div>
								<input
									className='radio'
									type='radio'
									name='date'
									id='day'
									value={'D'}
									checked={statisticPeriod.searchType === 'D' ? true : false}
									onChange={(e: any) => { handlePeriodType(e.target.value) }}
								/>
								<label htmlFor='day'>일별</label>
							</div>
							<div>
								<input
									className='radio'
									type='radio'
									name='date'
									value={'M'}
									id='month'
									checked={statisticPeriod.searchType === 'M' ? true : false}
									onChange={(e: any) => { handlePeriodType(e.target.value) }}
								/>
								<label htmlFor='month'>월별</label>
							</div>
						</div>
						
						<button className='btn-search' onClick={() => refetch()}>조회</button>
					</div>
					{/* <!-- // 검색 --> */}
					<div className='chart-filter'>
						<div className='checkbox-wrap'>
							<input
								className='check'
								type='checkbox'
								id='total-sales'
								checked={filterSales.total === 1}
								value={filterSales.total}
								onChange={(e) => {
									e.target.checked
										? setFilterSales({ ...filterSales, total: 1 })
										: setFilterSales({ ...filterSales, total: 0 });
								}}
							/>
							<label htmlFor='total-sales'>총매출</label>
						</div>
						<div className='checkbox-wrap'>
							<input
								className='check'
								type='checkbox'
								id='paid-sales'
								checked={filterSales.paid === 1}
								value={filterSales.paid}
								onChange={(e) => {
									e.target.checked
										? setFilterSales({ ...filterSales, paid: 1 })
										: setFilterSales({ ...filterSales, paid: 0 });
								}}
							/>
							<label htmlFor='paid-sales'>유상매출</label>
						</div>
						<div className='checkbox-wrap'>
							<input
								className='check'
								type='checkbox'
								id='delivery-sales'
								checked={filterSales.app === 1}
								value={filterSales.app}
								onChange={(e) => {
									e.target.checked
										? setFilterSales({ ...filterSales, app: 1 })
										: setFilterSales({ ...filterSales, app: 0 });
								}}
							/>
							<label htmlFor='delivery-sales'>배달매출</label>
						</div>
						<div className='checkbox-wrap'>
							<input
								className='check'
								type='checkbox'
								id='free-sales'
								checked={filterSales.free === 1}
								value={filterSales.free}
								onChange={(e) => {
									e.target.checked
										? setFilterSales({ ...filterSales, free: 1 })
										: setFilterSales({ ...filterSales, free: 0 });
								}}
							/>
							<label htmlFor='free-sales'>무상서비스</label>
						</div>
					</div>
					{/* <!-- 차트 --> */}
				</div>
				<div className='chart-wrap'>
					{/* <canvas id='myChart' style={{ width: '100%', height: '380px' }}></canvas> */}
					<div id='statistic-chart' className='line-chart chart'>
						{!(isLoading || isFetching) && data ? (
							<LineChart filterSales={filterSales} from={statisticPeriod.from} to={statisticPeriod.to} data={data && data} />
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
					<SalesStatisticTable data={data} rowPerPage={rowPerPage} currentPage={currentPage} />
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
