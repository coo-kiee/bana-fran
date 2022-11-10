import { Suspense, useRef, useState } from "react";
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
// Components
import Pagination from "pages/common/pagination";
import SalesHistoryTable from "pages/sales/history/table";
import Utils from "utils/Utils";
import Loading from "pages/common/loading";
import { ErrorBoundary } from "react-error-boundary";


interface SalesHistoryPeriod {
	from: string;
	to: string;
}

const SalesHistory = () => {
	// global states
	const fCode = useRecoilValue(franState);
	
	const today = new Date();
	
	// filter options
	const [historyPeriod, setHistoryPeriod] = useState<SalesHistoryPeriod>({ from: format(new Date(today.getFullYear(), today.getMonth()-1, today.getDate()), 'yyyy-MM-dd'), to: format(new Date(today), 'yyyy-MM-dd') });
	
	// pagination
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [rowPerPage, setRowPerPage] = useState<number>(3);
    
	const { data, isLoading, isRefetching, refetch } = SALES_SERVICE.useSalesOrderList({ from_date: historyPeriod.from, to_date: historyPeriod.to, f_code: fCode });

	data && console.log(data);



	/* 검색 기간 필터링 (onChange) */
	
	// 날짜 범위 설정 (from/to)
	const handlePeriodRange = (date: Date, key: string) => {
		setHistoryPeriod({...historyPeriod, [key]: format(date, 'yyyy-MM-dd')})
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
		<Suspense fallback={<div style={{width: '800px', height: '1000px', backgroundColor: '#0000ff', position: 'fixed', zIndex: '10'}}>loading</div>}>
			<ErrorBoundary fallback={<div style={{width: '100vw', height: '100vh', backgroundColor: '#ffffff'}}>failed T.T</div>}>
				<div className='info-wrap'>
					<p>※ 주문내역을 조회할 수 있습니다. (최대 12개월 이내)</p>
				</div>
				<div className='fixed-paid-point-wrap'>
					<p className='title bullet'>상세내역</p>
					{/* <!-- 검색 --> */}
					<div className='search-wrap'>
						<div className='input-wrap'>
							<DatePicker
								selected={new Date(today.getFullYear(), today.getMonth()-1, 1)}
								value={historyPeriod.from}
								locale={ko}
								dateFormat={'yy-MM-dd'}
								onChange={(date: Date) => handlePeriodRange(date, 'from')}
								/>
							<i>~</i>
							<DatePicker
								selected={new Date(today.getFullYear(), today.getMonth()-1, 1)}
								value={historyPeriod.to}
								locale={ko}
								dateFormat={'yy-MM-dd'}
								onChange={(date: Date) => handlePeriodRange(date, 'to')}
								/>
						</div>
						<div className='select-wrap'>
							<select name='' id=''>
								<option value=''>주문유형 전체</option>
							</select>
							<select name='' id=''>
								<option value=''>주문상태 전체</option>
							</select>
							<select name='' id=''>
								<option value=''>접수타입 전체</option>
							</select>
							<select name='' id=''>
								<option value=''>결제방식 전체</option>
							</select>
							<select name='' id=''>
								<option value=''>전체</option>
								<option value=''>일반제품</option>
								<option value=''>실물상품권</option>
							</select>
						</div>
						<button className='btn-search' onClick={() => refetch()}>조회</button>
					</div>
					{/* <!-- // 검색 --> */}
					{/* <!-- 조회기간 --> */}
					<div className='search-result-wrap'>
						<div className='search-date'>
							<p>조회기간: 2022-12-31 ~ 2022-12-31</p>
						</div>
						<ul className='search-result'>
							<li>
								주문금액 합계<span className='colon'></span>
								<span className='value'>10,000원</span>
							</li>
							<li>
								배달비 합계<span className='colon'></span>
								<span className='value'>10,000원</span>
							</li>
							<li>
								주문금액+배달비 합계<span className='colon'></span>
								<span className='value'>10,000원</span>
							</li>
							<li>
								카드결제 합계<span className='colon'></span>
								<span className='value'>10,000원</span>
							</li>
							<li>
								현금결제 합계<span className='colon'></span>
								<span className='value'>10,000원</span>
							</li>
							<li>
								유상포인트 결제 합계<span className='colon'></span>
								<span className='value'>10,000원</span>
							</li>
							<li>
								바나포인트/가맹점무료쿠폰 결제 합계<span className='colon'></span>
								<span className='value'>10,000원</span>
							</li>
							<li>
								본사 발급 쿠폰 결제 합계<span className='colon'></span>
								<span className='value'>10,000원</span>
							</li>
							<li>
								적립 스탬프 금액 합계<span className='colon'></span>
								<span className='value'>10,000원</span>
							</li>
							<li>
								적립 바나포인트 금액 합계<span className='colon'></span>
								<span className='value'>10,000원</span>
							</li>
							<li>
								실물 상품권 판매 금액 합계<span className='colon'></span>
								<span className='value'>10,000원</span>
							</li>
							<li>
								쿠팡/배민주문 금액 합계<span className='colon'></span>
								<span className='value'>10,000원</span>
							</li>
						</ul>
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
									<input className='check' type='checkbox' id='order' />
									<label htmlFor='order'>취소주문표시</label>
								</div>
								{/* <div className='check-box'>
									<input className='check' type='checkbox' id='gift' />
									<label htmlFor='gift'>실물상품권 주문 제외</label>
								</div> */}
								<div className='check-box'>
									<input className='check' type='checkbox' id='delivery' />
									<label htmlFor='delivery'>쿠팡/배민 주문 제외</label>
								</div>
							</div>
						</div>
					</div>
					{/* <!-- // 조회기간 --> */}
					{/* <!-- 게시판 --> */}
					<table className='board-wrap board-top' cellPadding='0' cellSpacing='0' ref={tableRef}>
							<SalesHistoryTable data={data} rowPerPage={rowPerPage} currentPage={currentPage} />
					</table>
					{/* <!-- 게시판 --> */}
				</div>
				{/* <!-- 엑셀다운, 페이징, 정렬 --> */}
				<div className='result-function-wrap'>
					<div className='function'>
						<button className='goast-btn' onClick={excelDownload}>엑셀다운</button>
					</div>
					<Pagination
						dataCnt={data?.length || 0}
						pageInfo={{row: rowPerPage, currentPage, boundaryRange: 5}}
						handlePageChange={setCurrentPage}
						handlePageRow={setRowPerPage}
					/>
				</div>
			</ErrorBoundary>
		</Suspense>
	);
};

export default SalesHistory;
