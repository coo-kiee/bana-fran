import { useState } from 'react';
import { format, subMonths } from 'date-fns';

// type
import { SearchInfoType, PageInfoType, OrderDetailProps } from "types/etc/etcType";

// component
import EtcTable from "../component/EtcTable";
import CalanderSearch from 'pages/common/calanderSearch';
import EtcSearchDetail from "../component/EtcSearchDetail";
import EtcDetailTable from "../component/EtcDetailTable";
import EtcDetailFooter from "../component/EtcDetailFooter";

const OrderDetail: React.FC<OrderDetailProps> = ({ setPopupOrderDetail }) => {
    // TODO: 상태 관련
    const [searchInfo, setSearchInfo] = useState<SearchInfoType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
        to: format(new Date(), 'yyyy-MM-dd')
    }); // etcSearch 내부 검색 날짜
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용 
    const handlePopupOrderDetail = () => {
        console.log('클릭')
        setPopupOrderDetail((prev) => ({ ...prev, show: true }));
    };

    // TODO: 프로시저
    // isSuccess로 확인 뒤 아래 관련 데이터 업데이트

    // TODO: EtcTable 관련 데이터 (프로시저 데이터 확인 후 수정하기)
    const colGroup = ['147', '147', '147', '147', '147', '147', '147', '147', '147', '147',];
    const thead = ['2022-02', '2022-03', '2022-04', '2022-05', '2022-06', '2022-07', '2022-08', '2022-09', '2022-10', '2022-11', '2022-12'];
    const tbody = [
        ['100,000', '100,000', '100,000', '100,000', '100,000', '100,000', '100,000', '100,000', '100,000', '100,000', '100,000'],
    ];

    // TODO: EtcSearchDetail 관련 데이터
    // ? 프로시저 데이터 확인 후 detailSearchResult 수정 (isSuccess 이후?)
    const detailSearchResult = [
        ['발주금액 합계', '10,000'],
    ];

    // TODO: EtcDetailTable 관련 데이터  
    const detailTableColGroup = ['170', '170', '170', '84', '104', '84', '98', '98', '*', '150'];
    const detailTableHead = [
        [{ itemName: '일시' }, { itemName: '최종수정일', }, { itemName: '취소일' }, { itemName: '접수자' }, { itemName: '최종수정자' }, { itemName: '취소자' }, { itemName: '상태' }, { itemName: '발주 건 수' }, { itemName: '발주 건 수' }, { itemName: '발주 건 수' }]
    ];
    const detailTableBody = [
        ['2022/12/31 12:30', '2022/12/31 12:30', '2022/12/31 12:30', '홍길동1', '홍길동', '홍길동', '배송완료', '10', '디카페인 원두 (콜롬비아/500G) 외 9건', '10,000'],
        ['2022/12/31 12:30', '2022/12/31 12:30', '2022/12/31 12:30', '홍길동2', '홍길동', '홍길동', '배송완료', '10', '디카페인 원두 (콜롬비아/500G) 외 9건', '10,000'],
        ['2022/12/31 12:30', '2022/12/31 12:30', '2022/12/31 12:30', '홍길동3', '홍길동', '홍길동', '배송완료', '10', '디카페인 원두 (콜롬비아/500G) 외 9건', '10,000'],
        ['2022/12/31 12:30', '2022/12/31 12:30', '2022/12/31 12:30', '홍길동4', '홍길동', '홍길동', '배송완료', '10', '디카페인 원두 (콜롬비아/500G) 외 9건', '10,000'],
        ['2022/12/31 12:30', '2022/12/31 12:30', '2022/12/31 12:30', '홍길동5', '홍길동', '홍길동', '배송완료', '10', '디카페인 원두 (콜롬비아/500G) 외 9건', '10,000'],
        ['2022/12/31 12:30', '2022/12/31 12:30', '2022/12/31 12:30', '홍길동6', '홍길동', '홍길동', '배송완료', '10', '디카페인 원두 (콜롬비아/500G) 외 9건', '10,000'],
        ['2022/12/31 12:30', '2022/12/31 12:30', '2022/12/31 12:30', '홍길동7', '홍길동', '홍길동', '배송완료', '10', '디카페인 원두 (콜롬비아/500G) 외 9건', '10,000'],
        ['2022/12/31 12:30', '2022/12/31 12:30', '2022/12/31 12:30', '홍길동8', '홍길동', '홍길동', '배송완료', '10', '디카페인 원두 (콜롬비아/500G) 외 9건', '10,000'],
        ['2022/12/31 12:30', '2022/12/31 12:30', '2022/12/31 12:30', '홍길동9', '홍길동', '홍길동', '배송완료', '10', '디카페인 원두 (콜롬비아/500G) 외 9건', '10,000'],
        ['2022/12/31 12:30', '2022/12/31 12:30', '2022/12/31 12:30', '홍길동10', '홍길동', '홍길동', '배송완료', '10', '디카페인 원두 (콜롬비아/500G) 외 9건', '10,000'],
    ];

    // TODO: 엑셀 프린트 관련 함수
    const handleExcelPrint = () => {
        console.log(`엑셀 다운 버튼 클릭`);
    }; // 엑셀 다운로드 관련 

    return (
        <div id="tab4" className="tab-content active">
            <div className="info-wrap">
                <p>※ 상세 발주 내역을 조회할 수 있습니다.<strong>(가상계좌 자동 차감되므로 정산내역에는 반영되지 않습니다.)</strong></p>
            </div>
            <div className="board-date-wrap">
                {/* 월별 발주내역 */}
                <EtcTable title={`월별 발주금액 통계`} colGroup={colGroup} thead={thead} tbody={tbody} />

                {/* 검색 */}
                <CalanderSearch title={`상세내역`} searchInfo={searchInfo} setSearchInfo={setSearchInfo} handleSearch={() => console.log('검색')} dateType={'yyyy-MM-dd'} />

                {/* 조회 기간 */}
                <EtcSearchDetail searchDate={`${searchInfo.from} ~ ${searchInfo.to}`} searchResult={detailSearchResult} />

                {/* 게시판 */}
                <EtcDetailTable colGroup={detailTableColGroup} theadData={detailTableHead} tbodyData={detailTableBody} pageInfo={pageInfo} handlePopupOrderDetail={handlePopupOrderDetail} />

                {/* 엑셀다운, 페이징, 정렬 */}
                <EtcDetailFooter excelFn={handleExcelPrint} pageFn={setPageInfo} dataCnt={detailTableBody.length || 0} pageInfo={pageInfo} />
            </div>
        </div>
    )
}

export default OrderDetail;