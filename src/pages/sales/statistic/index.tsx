import Utils from "utils/Utils";
import LineChart from "pages/sales/statistic/chart";
import { useEffect, useRef, useState } from "react";
import { format } from 'date-fns';
import ReactDatePicker from "react-datepicker";
import PeriodCalendar from "./PeriodCalendar";
import SALES_SERVICE from 'service/salesService'
import { useRecoilValue } from "recoil";
import { franState } from "state";
import { useQueryClient } from "react-query";
import Loading from "pages/common/loading";
type Props = {};
const tempData = [
    {
        date: '2022-10-31', 
        total: 130000, 
        app: 100000, 
        coubae: 30000, 
        delivery: 50000, 
        paid: 110000, 
        card_kiosk: 60000, 
        card_app: 30000, 
        cash_pos: 0, 
        paid_point: 5000,
        main_coupon: 5000, 
        free_total: 30000, 
        bana_point: 10000, 
        fran_coupon: 20000
    },
    {
        date: '2022-11-30', 
        total: 130000, 
        app: 100000, 
        coubae: 30000, 
        delivery: 50000, 
        paid: 110000, 
        card_kiosk: 60000, 
        card_app: 30000, 
        cash_pos: 0, 
        paid_point: 5000,
        main_coupon: 5000, 
        free_total: 30000, 
        bana_point: 10000, 
        fran_coupon: 20000
    },
    {
        date: '2022-12-31', 
        total: 130000, 
        app: 100000, 
        coubae: 30000, 
        delivery: 50000, 
        paid: 110000, 
        card_kiosk: 60000, 
        card_app: 30000, 
        cash_pos: 0, 
        paid_point: 5000,
        main_coupon: 5000, 
        free_total: 30000, 
        bana_point: 10000, 
        fran_coupon: 20000
    },
];

const SalesStatistic = (props: Props) => {
	const fCode = useRecoilValue(franState);

    const today = new Date();
    const [periodOptions, setPeriodOptions] = useState({ searchType: 'D', fromDate: new Date(today.getFullYear(), today.getMonth(), 1), toDate: new Date() })
    const [filterSales, setFilterSales] = useState({ total: 1, paid: 1, delivery: 1, free: 1 });
    const { data, isLoading, isFetching, isSuccess, isError, refetch } = SALES_SERVICE.useSalesStatistic({ f_code: fCode, search_type: periodOptions.searchType, from_date: periodOptions.fromDate, to_date: periodOptions.toDate })

    

    useEffect(() => {
        isLoading && console.log('isLoading')
        isFetching && console.log('isFetching')
        data && console.log('data done');
        console.log(data)
    }, [data, isFetching, isLoading, refetch])

    console.log(data)

    const handleReFetch = () => {
        refetch();
    }


    /* excel download */
    const tableRef = useRef<HTMLTableElement>(null);
    const headerRef = useRef<any>();
    useEffect(() => {
        const headerNode = document.getElementsByTagName('tbody')[0].childNodes[0].childNodes;
        console.log(Object.values(headerNode).map(node => node.textContent));
        headerRef.current = Object.values(headerNode).map(node => node.textContent);
        console.log(headerRef.current);
    }, []);

    const excelDownload = () => {
        if (tableRef.current) {
            // Excel - sheet options: 셀 시작 위치, 셀 크기
            const options = {
                type: 'table', // 필수 O
                sheetOption: { origin: "A1" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
                colspan: [
                    {wch: 15}, {wch: 18}, {wch: 18}, {wch: 16}, {wch: 16}, {wch: 22}, {wch: 16}, {wch: 16}, {wch: 16}, {wch: 16}, {wch: 16}, {wch: 20}, {wch: 18}, {wch: 18}, 
                ], // 셀 너비 설정, 필수 X
                // header: { 
                //             checkHeader: ['일시', '총매출\n(부가세 포함)', '앱 주문\n배달매출\n(배달비 포함)', '쿠팡/배민\n배달 매출\n(배달비 제외)', '배달비\n(앱 주문)', '유상매출\n합계\n(부가세 포함)', '유상 매출 상세 (부가세 포함)', '무상서비스 비용 합계', '바나포인트 (적립&월간랭킹보상)', '카드매출\n(키오스크)', '카드매출\n(어플)', '현금매출\n(POS)', '유상포인트\n매출', '본사 쿠폰\n매출', '바나포인트\n사용금액', '가맹점 쿠폰\n사용금액'], 
                //             color: '585872', 
                //         }, // 헤더 색상 넣을 때 필요(rgb #빼고 입력), 필수 X
                addRowColor: { row: [1,2,3], color: ['d3d3d3','d3d3d3','ffc89f'] },
                sheetName: '매출 통계', // 시트이름, 필수 X
            };
            
            try {
                Utils.excelDownload(tableRef.current, options, 'sales_statistic');
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    

    const totalSales = {
        total: tempData.reduce((acc: any, cur: any) => { return acc + cur.total; }, 0),
        app: tempData.reduce((acc: any, cur: any) => { return acc + cur.app; }, 0),
        coubae: tempData.reduce((acc: any, cur: any) => { return acc + cur.coubae; }, 0),
        delivery: tempData.reduce((acc: any, cur: any) => { return acc + cur.delivery; }, 0),
        paid: tempData.reduce((acc: any, cur: any) => { return acc + cur.paid; }, 0),
        card_kiosk: tempData.reduce((acc: any, cur: any) => { return acc + cur.card_kiosk; }, 0),
        card_app: tempData.reduce((acc: any, cur: any) => { return acc + cur.card_app; }, 0),
        cash_pos: tempData.reduce((acc: any, cur: any) => { return acc + cur.cash_pos; }, 0),
        paid_point: tempData.reduce((acc: any, cur: any) => { return acc + cur.paid_point; }, 0),
        main_coupon: tempData.reduce((acc: any, cur: any) => { return acc + cur.main_coupon; }, 0),
        free_total: tempData.reduce((acc: any, cur: any) => { return acc + cur.free_total; }, 0),
        bana_point: tempData.reduce((acc: any, cur: any) => { return acc + cur.bana_point; }, 0),
        fran_coupon: tempData.reduce((acc: any, cur: any) => { return acc + cur.fran_coupon; }, 0),
    }
	return (
		<>
			<div className='fixed-paid-point-wrap'>
				<div className='chart-filter-wrap'>
					{/* <!-- 검색 --> */}
					<div className='search-wrap'>
						<div className='input-wrap'>
							<input type='text' placeholder='2022-03-01' />
							<i>~</i>
							<input type='text' placeholder='2022-03-30' />
						</div>
						<div className='radio-wrap'>
							<div>
								<input className='radio' type='radio' name='date' id='day' value={'D'} checked={periodOptions.searchType === 'D'} onChange={(e) => { periodOptions.searchType !== 'D' && setPeriodOptions({...periodOptions, searchType: 'D'}) }} />
								<label htmlFor='day'>일별</label>
							</div>
							<div>
								<input className='radio' type='radio' name='date' value={'M'} id='month' checked={periodOptions.searchType === 'M'} onChange={(e) => { periodOptions.searchType !== 'M' && setPeriodOptions({...periodOptions, searchType: 'M'}) }} />
								<label htmlFor='month'>월별</label>
							</div>
						</div>
						<button className='btn-search' onClick={handleReFetch}>조회</button>
					</div>
					{/* <!-- // 검색 --> */}
					<div className='chart-filter'>
						<div className='checkbox-wrap'>
							<input className='check' type='checkbox' id='total-sales' checked={filterSales.total === 1} value={filterSales.total} onChange={(e) => {e.target.checked ? setFilterSales({...filterSales, total: 1}) : setFilterSales({...filterSales, total: 0})}} />
							<label htmlFor='total-sales'>총매출</label>
						</div>
						<div className='checkbox-wrap'>
							<input className='check' type='checkbox' id='paid-sales' checked={filterSales.paid === 1} value={filterSales.paid} onChange={(e) => {e.target.checked ? setFilterSales({...filterSales, paid: 1}) : setFilterSales({...filterSales, paid: 0})}} />
							<label htmlFor='paid-sales'>유상매출</label>
						</div>
						<div className='checkbox-wrap'>
							<input className='check' type='checkbox' id='delivery-sales' checked={filterSales.delivery === 1} value={filterSales.delivery} onChange={(e) => {e.target.checked ? setFilterSales({...filterSales, delivery: 1}) : setFilterSales({...filterSales, delivery: 0})}} />
							<label htmlFor='delivery-sales'>배달매출</label>
						</div>
						<div className='checkbox-wrap'>
							<input className='check' type='checkbox' id='free-sales' checked={filterSales.free === 1} value={filterSales.free} onChange={(e) => {e.target.checked ? setFilterSales({...filterSales, free: 1}) : setFilterSales({...filterSales, free: 0})}} />
							<label htmlFor='free-sales'>무상서비스</label>
						</div>
					</div>
					{/* <!-- 차트 --> */}
				</div>
				<div className='chart-wrap'>
					{/* <canvas id='myChart' style={{ width: '100%', height: '380px' }}></canvas> */}
                    <div id='statistic-chart' className="line-chart chart">
                        { 
                            !(isLoading || isFetching) ? 
                            <LineChart filterSales={filterSales} /> :
                            <div className="chart-loading-wrap">
                                <Loading width={100} height={100} marginTop={0} />
                            </div>
                        }
                        {/* <div className="chart-loading-wrap">
                            <Loading width={100} height={100} marginTop={0} />
                        </div> */}
                        {/* <LineChart filterSales={filterSales} /> */}
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
					<colgroup>
						<col width='122' />
						<col width='122' />
						<col width='122' />
						<col width='122' />
						<col width='122' />
						<col width='122' />
						<col width='122' />
						<col width='122' />
						<col width='122' />
						<col width='122' />
						<col width='122' />
						<col width='122' />
						<col width='122' />
						<col width='122' />
					</colgroup>
					<tbody>
                        <tr>
                            <th rowSpan={2}>일시</th>
                            <th rowSpan={2} className='bg-a'>
                                총매출<br />(부가세 포함)
                            </th>
                            <th rowSpan={2} className='bg-b'>
                                앱 주문<br />배달매출<br />(배달비 포함)
                            </th>
                            <th rowSpan={2} className='bg-c'>
                                쿠팡/배민<br />배달 매출<br />(배달비 제외)
                            </th>
                            <th rowSpan={2} className='bg_d'>
                                배달비<br />(앱 주문)
                            </th>
                            <th rowSpan={2} className='bg-e bg-e-right'>
                                유상매출<br />합계<br />(부가세 포함)
                            </th>
                            <th colSpan={5} className='bg-e bg-e-bottom'>
                                유상 매출 상세 (부가세 포함)
                            </th>
                            <th rowSpan={2} className='bg-right'>
                                무상서비스 비용 합계
                            </th>
                            <th colSpan={2} className='bg-bottom'>
                                바나포인트 (적립&월간랭킹보상)
                            </th>
                        </tr>
                        <tr>
                            <th className='bg-e height-63'>
                                카드매출<br />(키오스크/POS)
                            </th>
                            <th className='bg-e height-63'>
                                카드매출<br />(어플)
                            </th>
                            <th className='bg-e height-63'>
                                현금매출<br />(POS)
                            </th>
                            <th className='bg-e height-63'>
                                유상포인트<br />매출
                            </th>
                            <th className='bg-e height-63'>
                                본사 쿠폰<br />매출
                            </th>
                            <th>
                                바나포인트<br />사용금액
                            </th>
                            <th>
                                가맹점 쿠폰<br />사용금액
                            </th>
                        </tr>
                        <tr>
                            <td className='total'>합계</td>
                            <td className='total'>
                                {Utils.numberComma(totalSales.total)}<br/><span>({100 * totalSales.total/totalSales.total}%)</span>
                            </td>
                            <td className='total'>
                                {Utils.numberComma(totalSales.app)}<br/><span>({Math.round(100 * totalSales.app/totalSales.total)}%)</span>
                            </td>
                            <td className='total'>
                                {Utils.numberComma(totalSales.coubae)}<br/><span>(1%)</span>
                            </td>
                            <td className='total'>10,000</td>
                            <td className='total'>
                                {Utils.numberComma(totalSales.delivery)}<br/><span>(90%)</span>
                            </td>
                            <td className='total'>
                                60,000<br/><span>(60%)</span>
                            </td>
                            <td className='total'>
                                30,000<br/><span>(20%)</span>
                            </td>
                            <td className='total'>
                                0<br/><span>(0%)</span>
                            </td>
                            <td className='total'>
                                10,000<br/><span>(5%)</span>
                            </td>
                            <td className='total'>
                                10,000<br/><span>(5%)</span>
                            </td>
                            <td className='total'>
                                20,000<br/><span>(10%)</span>
                            </td>
                            <td className='total'>
                                10,000<br/><span>(5%)</span>
                            </td>
                            <td className='total'>
                                10,000<br/><span>(5%)</span>
                            </td>
                        </tr>
                        {data?.map((salesData: any, idx: number) => {
                            const { 
                                std_date, 
                                total_sales_amt, 
                                app_delivery_amt, 
                                etc_delivery_amt, 
                                app_delivery_charge,
                                paid_sales_amt, 
                                kiosk_card_amt, 
                                app_card_amt, 
                                pos_cash_amt,
                                paid_point,
                                hd_coupon_charge,
                                free_sales_amt, 
                                bana_point, 
                                fran_coupon_charge, 
                            } = salesData;
                            return (
                                <tr key={idx}>
                                    <td>{Utils.converDateFormat(new Date(std_date), '-')}</td>
                                    <td>{Utils.numberComma(total_sales_amt)}</td>
                                    <td>{Utils.numberComma(app_delivery_amt)}</td>
                                    <td>{Utils.numberComma(etc_delivery_amt)}</td>
                                    <td>{Utils.numberComma(app_delivery_charge)}</td>
                                    <td>{Utils.numberComma(paid_sales_amt)}</td>
                                    <td>{Utils.numberComma(kiosk_card_amt)}</td>
                                    <td>{Utils.numberComma(app_card_amt)}</td>
                                    <td>{Utils.numberComma(pos_cash_amt)}</td>
                                    <td>{Utils.numberComma(paid_point)}</td>
                                    <td>{Utils.numberComma(hd_coupon_charge)}</td>
                                    <td>{Utils.numberComma(free_sales_amt)}</td>
                                    <td>{Utils.numberComma(bana_point)}</td>
                                    <td>{Utils.numberComma(fran_coupon_charge)}</td>
                                </tr>
                            );
                        })}
                        
                    </tbody>
				</table>
				{/* <!-- 게시판 --> */}
			</div>
			{/* <!-- 엑셀다운, 페이징, 정렬 --> */}
			<div className='result-function-wrap'>
				<div className='function'>
					<button className='goast-btn' onClick={excelDownload}>엑셀다운</button>
				</div>
				<div className='paging-wrap'>
					<button className='btn-prev'></button>
					<ul className='paging'>
						<li className='active'>1</li>
						<li>2</li>
						<li>3</li>
						<li>4</li>
						<li>5</li>
					</ul>
					<button className='btn-next'></button>
				</div>
				<select className='filter-number' name='' id=''>
					<option value=''>50개</option>
				</select>
			</div>
		</>
	);
};

export default SalesStatistic;
