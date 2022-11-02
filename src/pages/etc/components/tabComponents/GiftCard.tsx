// type
import { TabItemProps } from "types/etcType";

// component
import EtcTable from "../EtcTable";
import EtcSearch from "../EtcSearch";
import EtcSearchDetail from "../EtcSearchDetail";
import EtcDetailTable from "../EtcDetailTable";
import EtcDetailFooter from "../EtcDetailFooter.tsx";

const GiftCard: React.FC<TabItemProps> = ({ pageInfo, searchDate, handlePageInfo, setSearchDate, handleExcelPrint }) => {
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
        ['음악 사용료 합계', '10,000'],
        ['공연권료 합계', '10,000'],
    ];
    const detailPriceInfo = [['음악사용료/공연권료는 일할 계산되지 않습니다. (월 단위 요금 청구)']];

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

    return (
        <div id="tab3" className="tab-content active">
            <div className="info-wrap">
                <p>※ 실물 상품권 발주/위탁판매내역을 조회할 수 있습니다.<strong>(가상계좌 자동 차감되므로 정산내역에는 반영되지 않습니다.)</strong></p>
            </div>
            <div className="board-date-wrap">
                {/* <!-- 재고 현황 --> */}
                <p className="title bullet">실물 상품권 재고 현황</p>
                <EtcTable colGroup={colGroup} thead={thead} tbody={tbody} />
                {/* <!-- //재고 현황 --> */}

                {/* <!-- 상세 내역 --> */}
                <p className="title bullet">상세내역</p>
                <EtcSearch from={searchDate.from} to={searchDate.to} updateDate={setSearchDate} option={['판매기기 전체', 'test1', 'test2']} />
                {/* <!-- // 상세 내역 --> */}

                {/* <!-- 조회 기간 --> */}
                <EtcSearchDetail searchDate={`${searchDate.from} ~ ${searchDate.to}`} searchResult={detailSearchResult} priceInfo={detailPriceInfo} />
                {/* <!-- // 조회 기간 --> */}

                {/* <!-- 게시판 --> */}
                <EtcDetailTable colGroup={detailTableColGroup} theadData={detailTableHead} tbodyData={detailTableBody} pageInfo={pageInfo} />
                {/* <!-- // 게시판 --> */}

                {/* <!-- 엑셀다운, 페이징, 정렬 --> */}
                <EtcDetailFooter excelFn={handleExcelPrint} pageFn={handlePageInfo} filterOption={[5, 10, 15, 20, 50]} dataCnt={detailTableBody.length || 0} pageInfo={pageInfo} />
                {/* <!-- 엑셀다운, 페이징, 정렬 --> */}
            </div>
        </div>
    )
}

export default GiftCard;