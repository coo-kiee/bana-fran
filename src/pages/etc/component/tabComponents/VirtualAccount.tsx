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

const VirtualAccount = () => {
    // TODO: 상태 관련
    const [searchInfo, setSearchInfo] = useState<SearchInfoType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM-01'),
        to: format(lastDayOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
    }); // etcSearch 내부 검색 날짜
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용 

    // TODO: 프로시저
    // isSuccess로 확인 뒤 아래 관련 데이터 업데이트 
    // TODO: EtcTable 관련 데이터 (프로시저 데이터 확인 후 수정하기) 
    const colGroup = ['300', '270', '270', '*', '270', '270'];
    const thead = ['매장', '은행', '계좌번호', '충 충전금액', '총 차감금액', '잔액'];
    const tbody = [
        ['충무로점', 'OO은행', '1111-111-1111-1111', '10,000,000원', '9,000,000원', '1,000,000원'],
        ['충무로점', 'OO은행', '2111-111-1111-1111', '10,000,000원', '9,000,000원', '2,000,000원'],
        ['충무로점', 'OO은행', '3111-111-1111-1111', '10,000,000원', '9,000,000원', '3,000,000원'],
        ['충무로점', 'OO은행', '4111-111-1111-1111', '10,000,000원', '9,000,000원', '4,000,000원'],
    ];

    // TODO: EtcSearchDetail 관련 데이터
    // ? 프로시저 데이터 확인 후 detailSearchResult 수정 (isSuccess 이후?) 
    const detailSearchResult = [
        ['충전', '10,000'], ['차감', '10,000'],
    ];

    // TODO: EtcDetailTable 관련 데이터     
    const detailTableColGroup = ['170', '170', '503', '503', '503'];
    const detailTableHead = [
        [{ itemName: '거래일시' }, { itemName: '거래구분' }, { itemName: '거래금액' }, { itemName: '적요' }, { itemName: '발주 건 수' }]
    ];
    const detailTableBody = [
        ['2022/12/31 12:30', '차감', '150,000', '로열티', '10,000'],
        ['2022/12/31 12:30', '차감', '150,000', '로열티', '20,000'],
        ['2022/12/31 12:30', '차감', '150,000', '로열티', '30,000'],
        ['2022/12/31 12:30', '차감', '150,000', '로열티', '40,000'],
        ['2022/12/31 12:30', '차감', '150,000', '로열티', '50,000'],
    ];

    // TODO: 엑셀 프린트 관련 함수
    const handleExcelPrint = () => {
        console.log(`엑셀 다운 버튼 클릭`);
    }; // 엑셀 다운로드 관련 

    return (
        <div id="tab6" className="tab-content active">
            <div className="info-wrap">
                <p>※ 가상계좌 충전/차감 내역을 조회할 수 있습니다.</p>
            </div>
            <div className="board-date-wrap">
                {/* 가상계좌 잔액 */}
                <EtcTable title={`가상 계좌 잔액`} colGroup={colGroup} thead={thead} tbody={tbody} />

                {/* 검색 */}
                <CalanderSearch title={`상세내역`} searchInfo={searchInfo} updateSearchInfo={setSearchInfo} handleSearch={() => console.log('검색')} dateType={'yyyy-MM-dd'} />

                {/* 조회기간 */}
                <EtcSearchDetail searchDate={`${searchInfo.from} ~ ${searchInfo.to}`} searchResult={detailSearchResult} />
            </div>

            {/* 게시판 */}
            <EtcDetailTable colGroup={detailTableColGroup} theadData={detailTableHead} tbodyData={detailTableBody} pageInfo={pageInfo} />

            {/* 엑셀다운, 페이징, 정렬 */}
            <EtcDetailFooter excelFn={handleExcelPrint} pageFn={setPageInfo} dataCnt={detailTableBody.length || 0} pageInfo={pageInfo} />
        </div>
    )
}

export default VirtualAccount;