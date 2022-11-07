import { useState } from 'react';
import { format, subMonths, lastDayOfMonth } from 'date-fns';

// type
import { SearchInfoType, PageInfoType } from "types/etc/etcType";

// component
import EtcTable from "../EtcTable";
import CalanderSearch from 'pages/common/calanderSearch';
import EtcSearchDetail from "../EtcSearchDetail";
import EtcDetailTable from "../EtcDetailTable";
import EtcDetailFooter from "../EtcDetailFooter";

const GiftCard = () => {
    // TODO: 상태 관련
    const [searchInfo, setSearchInfo] = useState<SearchInfoType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM-01'),
        to: format(lastDayOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
        searchOption: [''], // '판매기기 전체', '판매', '판매취소(폐기)' 중 하나
    }); // etcSearch 내부 검색 날짜
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용 

    // TODO: 프로시저
    // isSuccess로 확인 뒤 아래 관련 데이터 업데이트

    // TODO: EtcTable 관련 데이터 (프로시저 데이터 확인 후 수정하기)
    const colGroup = ['25%', '25%', '25%', '25%',];
    const thead = ['1만원권', '3만원권', '5만원권', '합계'];
    const tbody = [
        ['10장 (100,000원)', '9장 (270,000원)', '2장 (100,000원)', '21장 (470,000원)'],
    ];

    // TODO: EtcSearchDetail 관련 데이터
    // ? 프로시저 데이터 확인 후 detailSearchResult 수정 (isSuccess 이후?)
    const detailSearchResult = [
        ['발주금액 합계', '10,000'],
        ['키오스크/POS 판매금액 합계', '10,000'],
        ['어플 판매금액 합계', '10,000'],
        ['판매취소(폐기)금액 합계', '10,000'],
    ];
    const detailPriceInfo = [
        ['키오스크/POS 판매금액은 가상계좌에서 자동 차감됩니다.'],
        ['어플 판매금액은 가상계좌에서 차감되지 않습니다.'],
        ['판매취소된 상품권은 폐기되므로 재고에 반영되지 않습니다.']
    ];

    // TODO: EtcDetailTable 관련 데이터 
    const detailTableColGroup = ['195', '195', '195', '195', '195', '195', '150', '150', '150'];
    const detailTableHead = [
        [{ itemName: '일시', rowSpan: 2 }, { itemName: '구분', rowSpan: 2 }, { itemName: '상품권종', rowSpan: 2 }, { itemName: '수령(금액)', rowSpan: 2 }, { itemName: '판매기기', rowSpan: 2 }, { itemName: '가상계좌 충전/차감', rowSpan: 2 }, { itemName: '재고', colSpan: 3, className: 'price-area' }],
        [{ itemName: '1만원권', className: "price-area" }, { itemName: '3만원권', className: "price-area" }, { itemName: '5만원권', className: "price-area" }]
    ];
    const detailTableBody = [
        ['2022/12/31 12:30', '판매취소(폐기)', '3만원', '1장 (30,000)', '어플', '+10,000', '', '', '1장 (50,000)'],
        ['2022/12/31 12:30', '판매취소(폐기)', '3만원', '1장 (30,000)', '어플', '-10,000', '1장 (10,000)', '1장 (10,000)', ''],
        ['2022/12/31 12:30', '판매취소(폐기)', '3만원', '1장 (30,000)', '어플', '+10,000', '', '', '1장 (50,000)'],
        ['2022/12/31 12:30', '판매취소(폐기)', '3만원', '1장 (30,000)', '어플', '-10,000', '1장 (10,000)', '1장 (10,000)', ''],
        ['2022/12/31 12:30', '판매취소(폐기)', '3만원', '1장 (30,000)', '어플', '+10,000', '', '', '1장 (50,000)'],
        ['2022/12/31 12:30', '판매취소(폐기)', '3만원', '1장 (30,000)', '어플', '-10,000', '1장 (10,000)', '1장 (10,000)', ''],
    ];

    // TODO: 엑셀 프린트 관련 함수
    const handleExcelPrint = () => {
        console.log(`엑셀 다운 버튼 클릭`);
    }; // 엑셀 다운로드 관련 

    return (
        <div id="tab3" className="tab-content active">
            <div className="info-wrap">
                <p>※ 실물 상품권 발주/위탁판매내역을 조회할 수 있습니다.<strong>(가상계좌 자동 차감되므로 정산내역에는 반영되지 않습니다.)</strong></p>
            </div>
            <div className="board-date-wrap">
                {/* 재고 현황 */}
                <EtcTable title={`실물 상품권 재고 현황`} colGroup={colGroup} thead={thead} tbody={tbody} />

                {/* 상세 내역 */}
                <CalanderSearch title={`상세내역`} searchInfo={searchInfo} updateSearchInfo={setSearchInfo} handleSearch={() => console.log('검색')} dateType={'yyyy-MM-dd'} option={[['판매기기 전체', '판매', '판매취소(폐기)']]} />

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

export default GiftCard;