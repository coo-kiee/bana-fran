import { useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { format, subDays, subYears } from "date-fns";

// global states
import { franState, loginState } from "state";

// API
import SALES_SERVICE from 'service/salesService'
// Types
import { HISTORY_GIFT_CERT, HISTORY_ORDER_STATE, HISTORY_ORDER_TYPE, HISTORY_PAY_TYPE, HISTORY_RCP_TYPE, HISTORY_SEARCH_TYPE_LIST, SalesHistorySearch } from "types/sales/salesType";
// Utils
import Utils from "utils/Utils";

// Components
import CalanderSearch from "pages/common/calanderSearch";
import PrefixSum from "pages/sales/history/PrefixSum";
import SalesHistoryTable from "pages/sales/history/table";
import Pagination from "pages/common/pagination";

const SalesHistory = () => {
	// global states
	const { userInfo } = useRecoilValue(loginState);
	const fCode = useRecoilValue(franState);
	const selectedFran = userInfo?.f_list.filter((info: any) => { return (info.f_code === fCode) });
	const fCodeName = selectedFran[0]?.f_code_name || ''; // 가맹점명
	
	const today = new Date();
	
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

	// 취소 주문 표시 여부 0: 취소주문감추기 1: 취소주문표시
	const [isCancelShow, setIsCancelShow] = useState<0|1>(1);
	// 쿠팡/배민 주문 제외 여부 0: 쿠팡/배민표시 1:쿠팡/배민제외
	const [isExcludeCouBae, setIsExcludeCouBae] = useState<0|1>(0);

	// pagination
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [rowPerPage, setRowPerPage] = useState<number>(50);

	// query
	const { data, isLoading, isRefetching, refetch } = SALES_SERVICE.useSalesOrderList({ from_date: historySearch.from, to_date: historySearch.to, f_code: fCode });

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
	]

	// filter (change on select/check): order_type, order_state, rcp_type, pay_type, gift_cert, isCancelShow, isExcludeCouBae
	const filteredData = () => {
		const orderType = historySearch.searchOption[0].value; 		// 주문유형 1: 앱 2,3:쿠팡/배민 else: 매장
		const orderState = historySearch.searchOption[1].value;		// 주문상태
		const rcpType = historySearch.searchOption[2].value;		// 접수타입
		const payType = historySearch.searchOption[3].value;		// 결제방식 
		const giftCert = historySearch.searchOption[4].value;		// 0: 일반결제, 1: 상품권
		
		let resultData = data;
		// selectbox
		if (orderType !== 'total' && orderType !== HISTORY_ORDER_TYPE.COUBAE) { 
			resultData = resultData.filter((dd: any) => {return dd.order_type === Number(orderType)});
		} else if (orderType !== 'total' && orderType === HISTORY_ORDER_TYPE.COUBAE) { 
			resultData = resultData.filter((dd: any) => {return dd.order_type === 2 || dd.order_type === 3});
		}
		if (orderState !== 'total' && orderState !== HISTORY_ORDER_STATE.MAKING) { // 주문상태
			// total과 제조중(10) 제외한 나머지 state			
			resultData = resultData.filter((dd: any) => {return dd.order_state === Number(orderState)});
		} else if (orderState !== 'total' && orderState === HISTORY_ORDER_STATE.MAKING) { 
			// 제조중(10)이면 order_state === 10 || 20
			resultData = resultData.filter((dd: any) => {return dd.order_state === 10 || dd.order_state === 20});
		}
		if (rcpType !== 'total' && rcpType !== HISTORY_RCP_TYPE.NA) {
			resultData = resultData.filter((dd: any) => {return dd.rcp_type === rcpType});
		} else if (rcpType !== 'total' && rcpType === HISTORY_RCP_TYPE.NA) {
			resultData = resultData.filter((dd: any) => {
				return !(dd.rcp_type === '앱' || dd.rcp_type === '키오스크' || dd.rcp_type === '직접결제POS' || dd.rcp_type === '매장앱')
			});
		}
		if (payType !== 'total') {
			resultData = resultData.filter((dd: any) => {return dd.pay_type === payType});
		}
		if (giftCert !== 'total') {
			resultData = resultData.filter((dd: any) => {return dd.bOrderGiftCert === giftCert});
		}
		// checkbox
		if (isCancelShow === 0) { // 취소주문 감출 때 (unchecked)
			resultData = resultData?.filter((dd: any) => {return dd.order_state !== 50});
		}
		if (isExcludeCouBae === 1) { // 쿠팡/배민 제외시 (checked)
			resultData = resultData?.filter((dd: any) => {return dd.order_type !== 2 && dd.order_type !== 3});
		}
		return resultData;
	};

    /* excel download */
    const tableRef = useRef<HTMLTableElement>(null); // 엑셀 다운로드 대상 table
  
    const excelDownload = () => {
		const {from, to} = historySearch;
        if (tableRef.current) {
            // Excel - sheet options: 셀 시작 위치, 셀 크기
            const options = {
                type: 'table', // 필수 O
                sheetOption: { origin: "A1" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
                colspan: [{wch: 13}, {wch: 13}, {wch: 13}, {wch: 13}, {wch: 13}, {wch: 13}, {wch: 28}, {wch: 6}, {wch: 15}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 11}, {wch: 14}, {wch: 14}, {wch: 14}, ], // 셀 너비 설정, 필수 X
                addRowColor: { row: [1,2], color: ['d3d3d3','d3d3d3'] },
                sheetName: '주문내역', // 시트이름, 필수 X
            };
            try { Utils.excelDownload(tableRef.current, options, `${fCodeName}_주문내역(${from}~${to})`); }
            catch (error) { console.log(error); }
        }
    }
	
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
					handleSearch={refetch} // 실제 검색하는 함수 (ex. refetch)
					minDate={subYears(today, 1)} // 검색가능한 기간(시작일) 설정
				/>
				<div className='search-result-wrap'>
					<div className='search-date'>
						<p>조회기간: {historySearch.from} ~ {historySearch.to}</p>
					</div>
					{/* 누적 합계 */}
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
				{/* <!-- 주문내역 Table --> */}
				<SalesHistoryTable data={filteredData() || []} isLoading={isLoading || isRefetching} rowPerPage={rowPerPage} currentPage={currentPage} ref={tableRef} />
			</div>
			{/* <!-- 엑셀다운, 페이징, 정렬 --> */}
			<div className='result-function-wrap'>
				<div className='function'>
					<button className='goast-btn' onClick={excelDownload} disabled={isLoading || isRefetching}>엑셀다운</button>
				</div>
				<Pagination
					dataCnt={filteredData()?.length || 0}
					pageInfo={{row: rowPerPage, currentPage}}
					handlePageChange={setCurrentPage}
					handlePageRow={setRowPerPage}
				/>
			</div>
		</>
	);
};

export default SalesHistory;
