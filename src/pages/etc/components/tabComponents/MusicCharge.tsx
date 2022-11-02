// type
import { TabComponentsProps } from "types/etcType";

// component
import EtcTable from "../EtcTable";
import EtcSearch from "../EtcSearch";
import EtcSearchDetail from "../EtcSearchDetail";
import EtcDetailTable from "../EtcDetailTable";
import EtcDetailFooter from "../EtcDetailFooter";

const MusicCharge: React.FC<TabComponentsProps> = ({ pageInfo, searchDate, setPageInfo, setSearchDate, handleExcelPrint }) => {
    // TODO: 프로시저
    // isSuccess로 확인 뒤 아래 관련 데이터 업데이트

    // TODO: EtcTable 관련 데이터 (프로시저 데이터 확인 후 수정하기)
    const colGroup = ['188', '*', '150', '150', '150'];
    const thead = ['기간', '품목', '공급가', '부가세', '수수료 합계 (2.2%)'];
    const tbody = [
        ['22/06/01~22/06/30', '음악 사용료', '6,000', '600', '6.600'],
        ['22/06/01~22/06/30', '공연권료', '4,000', '400', '4.400'],
    ];

    // TODO: EtcSearchDetail 관련 데이터
    // ? 프로시저 데이터 확인 후 detailSearchResult 수정 (isSuccess 이후?)
    const detailSearchResult = [
        ['음악 사용료 합계', '10,000'],
        ['공연권료 합계', '10,000'],
    ];
    const detailPriceInfo = [['음악사용료/공연권료는 일할 계산되지 않습니다. (월 단위 요금 청구)']];

    // TODO: EtcDetailTable 관련 데이터 
    const detailTableColGroup = ['188', '*', '150', '150', '150'];
    const detailTableHead = [
        [{ itemName: '기간', rowSpan: 2 }, { itemName: '내용', rowSpan: 2 }, { itemName: 'BGM 서비스 이용료', colSpan: 3, className: 'price-area' }],
        [{ itemName: '공급가', className: "price-area" }, { itemName: '부가세', className: "price-area" }, { itemName: '합계', className: "price-area" }]
    ];
    const detailTableBody = [
        ['22/06/01~22/06/30', '음악사용료1', '130,000', '130,000', '130,000'],
        ['22/06/01~22/06/30', '음악사용료2', '130,000', '130,000', '130,000'],
        ['22/06/01~22/06/30', '음악사용료3', '130,000', '130,000', '130,000'],
        ['22/06/01~22/06/30', '음악사용료4', '130,000', '130,000', '130,000'],
        ['22/06/01~22/06/30', '음악사용료5', '130,000', '130,000', '130,000'],
        ['22/06/01~22/06/30', '음악사용료6', '130,000', '130,000', '130,000'],
        ['22/06/01~22/06/30', '음악사용료7', '130,000', '130,000', '130,000'],
        ['22/06/01~22/06/30', '음악사용료8', '130,000', '130,000', '130,000'],
    ];

    return (
        <div id="tab2" className="tab-content active">
            <div className="info-wrap">
                <p>※ 매월 매장 음악 서비스 이용료를 조회할 수 있습니다. <strong>(가상계좌 자동 차감되므로 정산내역에는 반영되지 않습니다.)</strong></p>
            </div>
            <div className="board-date-wrap">
                {/* <!-- 수수료 내역 --> */}
                <p className="title bullet">2022년 3월 바나 딜리버리 수수료 내역</p>
                <EtcTable colGroup={colGroup} thead={thead} tbody={tbody} />
                {/* <!-- // 수수료 내역 --> */}

                <p className="title bullet">상세내역</p>
                {/* <!-- 검색 --> */}
                <EtcSearch from={searchDate.from} to={searchDate.to} updateDate={setSearchDate} option={['구분 전체', 'test1', 'test2']} />
                {/* <!-- // 검색 --> */}

                {/* <!-- 조회 기간 --> */}
                <EtcSearchDetail searchDate={`${searchDate.from} ~ ${searchDate.to}`} searchResult={detailSearchResult} priceInfo={detailPriceInfo} />
                {/* <!-- // 조회 기간 --> */}

                {/* <!-- 게시판 --> */}
                <EtcDetailTable colGroup={detailTableColGroup} theadData={detailTableHead} tbodyData={detailTableBody} pageInfo={pageInfo} />
                {/* <!-- // 게시판 --> */}

                {/* <!-- 엑셀다운, 페이징, 정렬 --> */}
                <EtcDetailFooter excelFn={handleExcelPrint} pageFn={setPageInfo} dataCnt={detailTableBody.length || 0} pageInfo={pageInfo} />
                {/* <!-- // 엑셀다운, 페이징, 정렬 --> */}
            </div>
        </div>
    )
}

export default MusicCharge;