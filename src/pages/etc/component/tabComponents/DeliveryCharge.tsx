import { useState } from 'react';
import { format, subMonths, lastDayOfMonth } from 'date-fns';

// type
import { SearchInfoType, PageInfoType } from "types/etc/etcType";

// component
import EtcTable from "../EtcTable";
// import EtcSearch from "../EtcSearch";
import CalanderSearch from 'pages/common/calanderSearch';
import EtcSearchDetail from "../EtcSearchDetail";
import EtcDetailTable from "../EtcDetailTable";
import EtcDetailFooter from "../EtcDetailFooter";

const DeliveryCharge = () => {
    // TODO: 상태 관련
    const [searchInfo, setSearchInfo] = useState<SearchInfoType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM-01'),
        to: format(lastDayOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
        searchOption: [''], // ['구분 전체', '현장카드', '현장현금', '어플선결제'] 중 하나
    }); // etcSearch 내부 검색 날짜
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용  

    // TODO: 프로시저
    // isSuccess로 확인 뒤 아래 관련 데이터 업데이트
    // dataCnt 갯수로 EtcDetailFooter 노출 여부 추가 필요

    // TODO: EtcTable 관련 데이터
    // ?프로시저 데이터 확인 후 tbody 타입 지정 + 수정 (isSuccess 이후?)
    const tableColGroup = ['188', '*', '150', '150', '150'];
    const tableHead = ['기간', '품목', '수수료 공급가 (2%)', '부가세 (0.2%)', '수수료 합계 (2.2%)'];
    const tableBody = [
        ['22/06/01~22/06/30', '바나 딜리버리 수수료(주문금액의 2%, VAT 별도)', '100,000', '100,000', '100,000']
    ];

    // TODO: EtcSearchDetail 관련 데이터
    // ?프로시저 데이터 확인 후 detailSearchResult 수정 (isSuccess 이후?)
    const detailSearchResult = [
        ['바나 딜리버리 주문금액 합계', '10,000'],
        ['바나 딜리버스 수수료 공급가(주문금액*2%) 합계', '10,000'],
        ['바나 딜리버리 수수료(수수료 공급가+부가세) 합계', '10,000']
    ];
    const detailPriceInfo = [
        ['주문금액', '배달비를 제외한 카드/현금/포인트/쿠폰 결제금액의 합계.'],
        ['수수료 공급가', '주문금액의 2% (부가세 별도.)']
    ];

    // TODO: EtcDetailTable 관련 데이터
    const detailTableColGroup = ['188', '*', '120', '120', '150', '190', '136', '150', '150', '150'];
    const detailTableHead = [
        [{ itemName: '결제일시', rowSpan: 2 }, { itemName: '메뉴', rowSpan: 2 }, { itemName: '주문금액', rowSpan: 2 }, { itemName: '배달비', rowSpan: 2 }, { itemName: '결제방식', rowSpan: 2 }, { itemName: '결제수단', rowSpan: 2 }, { itemName: '주문자', rowSpan: 2 }, { itemName: '바나 딜리버리 수수료', colSpan: 3, className: 'price-area' }],
        [{ itemName: '수수료 공급가 (2%)', className: "price-area" }, { itemName: '부가세 (0.2%)', className: "price-area" }, { itemName: '수수료 합계 (2.2%)', className: "price-area" },]
    ];
    const detailTableBody = [
        ['22/06/01~22/06/30', '아메리카노 외 1건', '1,000', '2,900', '현장카드', '카드, 바나포인트', '0101234****', '130,000', '130,000', '130,000'],
        ['22/06/01~22/06/30', '아메리카노 외 1건', '2,000', '2,900', '현장카드', '카드, 바나포인트', '0101234****', '130,000', '130,000', '130,000'],
        ['22/06/01~22/06/30', '아메리카노 외 1건', '3,000', '2,900', '현장카드', '카드, 바나포인트', '0101234****', '130,000', '130,000', '130,000'],
        ['22/06/01~22/06/30', '아메리카노 외 1건', '4,000', '2,900', '현장카드', '카드, 바나포인트', '0101234****', '130,000', '130,000', '130,000'],
        ['22/06/01~22/06/30', '아메리카노 외 1건', '5,000', '2,900', '현장카드', '카드, 바나포인트', '0101234****', '130,000', '130,000', '130,000'],
        ['22/06/01~22/06/30', '아메리카노 외 1건', '6,000', '2,900', '현장카드', '카드, 바나포인트', '0101234****', '130,000', '130,000', '130,000'],
        ['22/06/01~22/06/30', '아메리카노 외 1건', '7,000', '2,900', '현장카드', '카드, 바나포인트', '0101234****', '130,000', '130,000', '130,000'],
        ['22/06/01~22/06/30', '아메리카노 외 1건', '8,000', '2,900', '현장카드', '카드, 바나포인트', '0101234****', '130,000', '130,000', '130,000'],
        ['22/06/01~22/06/30', '아메리카노 외 1건', '9,000', '2,900', '현장카드', '카드, 바나포인트', '0101234****', '130,000', '130,000', '130,000'],
        ['22/06/01~22/06/30', '아메리카노 외 1건', '10,000', '2,900', '현장카드', '카드, 바나포인트', '0101234****', '130,000', '130,000', '130,000'],
        ['22/06/01~22/06/30', '아메리카노 외 1건', '11,000', '2,900', '현장카드', '카드, 바나포인트', '0101234****', '130,000', '130,000', '130,000'],
        ['22/06/01~22/06/30', '아메리카노 외 1건', '12,000', '2,900', '현장카드', '카드, 바나포인트', '0101234****', '130,000', '130,000', '130,000'],
    ];

    // TODO: 엑셀 프린트 관련 함수
    const handleExcelPrint = () => {
        console.log(`엑셀 다운 버튼 클릭`);
    }; // 엑셀 다운로드 관련 

    return (
        <div id="tab1" className="tab-content active">
            <div className="info-wrap">
                <p>※ 바나 딜리버리 수수료 내역을 조회할 수 있습니다. <strong>(가상계좌 자동 차감되므로 정산내역에는 반영되지 않습니다.)</strong></p>
            </div>

            <div className="board-date-wrap">
                {/* 수수료 내역 */}
                <EtcTable title={`${format(subMonths(new Date(), 1), 'yyyy년 MM월')} 바나 딜리버리 수수료 내역`} colGroup={tableColGroup} thead={tableHead} tbody={tableBody} />
                {/* 검색 */}
                {/* <EtcSearch title={`상세내역`} searchInfo={searchInfo} updateSearchInfo={setSearchInfo} option={['구분 전체', '현장카드', '현장현금', '어플선결제']} /> */}
                <CalanderSearch title={`상세내역`} searchInfo={searchInfo} updateSearchInfo={setSearchInfo} handleSearch={() => console.log('검색')} dateType={'yyyy-MM-dd'} option={[['구분 전체', '현장카드', '현장현금', '어플선결제']]} />
                {/* 조회 기간 */}
                <EtcSearchDetail searchDate={`${searchInfo.from} ~ ${searchInfo.to}`} searchResult={detailSearchResult} priceInfo={detailPriceInfo} />
                {/* 게시판 */}
                <EtcDetailTable colGroup={detailTableColGroup} theadData={detailTableHead} tbodyData={detailTableBody} pageInfo={pageInfo} />
                {/* 엑셀다운, 페이징, 정렬 */}
                <EtcDetailFooter excelFn={handleExcelPrint} pageFn={setPageInfo} dataCnt={detailTableBody.length || 0} pageInfo={pageInfo} />
            </div>
        </div>
    )
}

export default DeliveryCharge;