import { useState } from 'react';
import { format, subMonths, lastDayOfMonth } from 'date-fns';

// type
import { SearchInfoType, PageInfoType } from "types/etc/etcType";

// component
import EtcTable from "../component/EtcTable";
import CalanderSearch from 'pages/common/calanderSearch';
import EtcSearchDetail from "../component/EtcSearchDetail";
import EtcDetailTable from "../component/EtcDetailTable";
import EtcDetailFooter from "../component/EtcDetailFooter";

const Royalty = () => {
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
    const colGroup = ['256', '*', '170', '170', '170'];
    const thead = ['기간', '품목', '공급가', '부가세', '합계'];
    const tbody = [
        ['2022/03/01~2022/03/30', '로열티', '150,000', '150,000', '150,000']
    ];

    // TODO: EtcSearchDetail 관련 데이터
    // ? 프로시저 데이터 확인 후 detailSearchResult 수정 (isSuccess 이후?)
    const detailSearchResult = [
        ['로열티 합계', '10,000'],
        ['공연권료 합계', '10,000'],
    ];
    const detailPriceInfo = [['로열티는 일할 계산되지 않습니다. (월 단위 요금 청구)']];

    // TODO: EtcDetailTable 관련 데이터    
    const detailTableColGroup = ['225', '*', '150', '150', '150'];
    const detailTableHead = [
        [{ itemName: '기간', rowSpan: 2 }, { itemName: '구분', rowSpan: 2 }, { itemName: 'BGM 서비스 이용료', colSpan: 3, className: 'price-area' }],
        [{ itemName: '공급가', className: 'price-area' }, { itemName: '부가세', className: 'price-area' }, { itemName: '합계', className: 'price-area' }]
    ];
    const detailTableBody = [
        ['2022/01', '로열티', '136,364', '136,364', '150,000'],
        ['2022/02', '로열티', '136,364', '136,364', '150,000'],
        ['2022/03', '로열티', '136,364', '136,364', '150,000'],
        ['2022/04', '로열티', '136,364', '136,364', '150,000'],
        ['2022/05', '로열티', '136,364', '136,364', '150,000'],
        ['2022/06', '로열티', '136,364', '136,364', '150,000'],
    ];

    // TODO: 엑셀 프린트 관련 함수
    const handleExcelPrint = () => {
        console.log(`엑셀 다운 버튼 클릭`);
    }; // 엑셀 다운로드 관련 

    return (
        <div id="tab5" className="tab-content active" >
            <div className="info-wrap" >
                <p>※ 매우러 매장 로열티를 조회할 수 있습니다.<strong>(가상계좌 자동 차감되므로 정산내역에는 반영되지 않습니다.) </strong></p >
            </div>
            <div className="board-date-wrap" >
                {/* 로열티 내역 */}
                < EtcTable title={`${format(subMonths(new Date(), 1), 'yyyy년 MM월')} 로열티 내역`
                } colGroup={colGroup} thead={thead} tbody={tbody} />

                {/* 로열티 내역 */}
                < CalanderSearch title={`상세내역`} searchInfo={searchInfo} setSearchInfo={setSearchInfo} handleSearch={() => console.log('검색')} dateType={'yyyy-MM-dd'} />

                {/* 조회 기간> */}
                < EtcSearchDetail searchDate={`${searchInfo.from} ~ ${searchInfo.to}`} searchResult={detailSearchResult} priceInfo={detailPriceInfo} />
            </div>

            {/* 게시판 */}
            <EtcDetailTable colGroup={detailTableColGroup} theadData={detailTableHead} tbodyData={detailTableBody} pageInfo={pageInfo} />

            {/* 엑셀다운, 페이징, 정렬 */}
            < EtcDetailFooter excelFn={handleExcelPrint} pageFn={setPageInfo} dataCnt={detailTableBody.length || 0} pageInfo={pageInfo} />
        </div>

    )
}

export default Royalty;