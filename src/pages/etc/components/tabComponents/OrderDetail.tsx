// type
import { TabComponentsProps } from "types/etcType";

// component
import EtcTable from "../EtcTable";
import EtcSearch from "../EtcSearch";
import EtcSearchDetail from "../EtcSearchDetail";
import EtcDetailTable from "../EtcDetailTable";
// import EtcDetailFooter from "../EtcDetailFooter";

const OrderDetail: React.FC<TabComponentsProps> = ({ pageInfo, searchDate, setPageInfo, setSearchDate, handleExcelPrint }) => {
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
        ['음악 사용료 합계', '10,000'],
        ['공연권료 합계', '10,000'],
    ];
    const detailPriceInfo = [['음악사용료/공연권료는 일할 계산되지 않습니다. (월 단위 요금 청구)']];

    // TODO: EtcDetailTable 관련 데이터  
    const detailTableColGroup = ['170', '170', '170', '84', '104', '84', '98', '98', '*', '150'];
    const detailTableHead = [
        [{ itemName: '일시' }, { itemName: '최종수정일', }, { itemName: '취소일' }, { itemName: '접수자' }, { itemName: '최종수정자' }, { itemName: '취소자' }, { itemName: '상태' }, { itemName: '발주 건 수' }, { itemName: '발주 건 수' }, { itemName: '발주 건 수' }]
    ];
    const detailTableBody = [
        ['2022/12/31 12:30', '2022/12/31 12:30', '2022/12/31 12:30', '홍길동', '홍길동', '홍길동', '배송완료', '10', '디카페인 원두 (콜롬비아/500G) 외 9건', '10,000'],
        ['2022/12/31 12:30', '2022/12/31 12:30', '2022/12/31 12:30', '홍길동', '홍길동', '홍길동', '배송완료', '10', '디카페인 원두 (콜롬비아/500G) 외 9건', '10,000'],
        ['2022/12/31 12:30', '2022/12/31 12:30', '2022/12/31 12:30', '홍길동', '홍길동', '홍길동', '배송완료', '10', '디카페인 원두 (콜롬비아/500G) 외 9건', '10,000'],
        ['2022/12/31 12:30', '2022/12/31 12:30', '2022/12/31 12:30', '홍길동', '홍길동', '홍길동', '배송완료', '10', '디카페인 원두 (콜롬비아/500G) 외 9건', '10,000'],
        ['2022/12/31 12:30', '2022/12/31 12:30', '2022/12/31 12:30', '홍길동', '홍길동', '홍길동', '배송완료', '10', '디카페인 원두 (콜롬비아/500G) 외 9건', '10,000'],
    ];

    return (
        <div id="tab4" className="tab-content active">
            <div className="info-wrap">
                <p>※ 상세 발주 내역을 조회할 수 있습니다.<strong>(가상계좌 자동 차감되므로 정산내역에는 반영되지 않습니다.)</strong></p>
            </div>
            <div className="board-date-wrap">
                {/* <!-- 월별 발주내역 --> */}
                <p className="title bullet">월별 발주금액 통계</p>
                <EtcTable colGroup={colGroup} thead={thead} tbody={tbody} />
                {/* <!-- // 월별 발주내역 --> */}

                <p className="title bullet">일별 발주 상세 내역</p>
                {/* <!-- 검색 --> */}
                <EtcSearch from={searchDate.from} to={searchDate.to} updateDate={setSearchDate} option={['구분 전체', 'test1', 'test2']} />
                {/* <!-- // 검색 --> */}

                {/* <!-- 조회 기간 --> */}
                <EtcSearchDetail searchDate={`${searchDate.from} ~ ${searchDate.to}`} searchResult={detailSearchResult} priceInfo={detailPriceInfo} />
                {/* <!-- // 조회 기간 --> */}

                {/* <!-- 게시판 --> */}
                <EtcDetailTable colGroup={detailTableColGroup} theadData={detailTableHead} tbodyData={detailTableBody} pageInfo={pageInfo} />
                {/* <table className="board-wrap" cellPadding="0" cellSpacing="0">
                    <colgroup>
                        <col width="170" />
                        <col width="170" />
                        <col width="170" />
                        <col width="84" />
                        <col width="104" />
                        <col width="84" />
                        <col width="98" />
                        <col width="98" />
                        <col width="*" />
                        <col width="150" />
                    </colgroup>
                    <thead>

                        <tr>
                            <th>일시</th>
                            <th>최종수정일</th>
                            <th>취소일</th>
                            <th>접수자</th>
                            <th>최종수정자</th>
                            <th>취소자</th>
                            <th>상태</th>
                            <th>발주 건 수</th>
                            <th>발주 건 수</th>
                            <th>발주 건 수</th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr>
                            <td className="align-center">2022/12/31 12:30</td>
                            <td className="align-center">2022/12/31 12:30</td>
                            <td className="align-center">2022/12/31 12:30</td>
                            <td className="align-center">홍길동</td>
                            <td className="align-center">홍길동</td>
                            <td className="align-center">홍길동</td>
                            <td className="align-center">배송완료</td>
                            <td className="align-right">10</td>
                            <td className="align-left order-view">디카페인 원두 (콜롬비아/500G) 외 9건</td>
                            <td className="align-right">10,000</td>
                        </tr>
                        <tr>
                            <td className="align-center">2022/12/31 12:30</td>
                            <td className="align-center">2022/12/31 12:30</td>
                            <td className="align-center">2022/12/31 12:30</td>
                            <td className="align-center">홍길동</td>
                            <td className="align-center">홍길동</td>
                            <td className="align-center">홍길동</td>
                            <td className="align-center">대기</td>
                            <td className="align-right">10</td>
                            <td className="align-left">디카페인 원두 (콜롬비아/500G) 외 9건</td>
                            <td className="align-right">10,000</td>
                        </tr>
                        <tr>
                            <td className="align-center">2022/12/31 12:30</td>
                            <td className="align-center">2022/12/31 12:30</td>
                            <td className="align-center">2022/12/31 12:30</td>
                            <td className="align-center">홍길동</td>
                            <td className="align-center">홍길동</td>
                            <td className="align-center">홍길동</td>
                            <td className="align-center">대기</td>
                            <td className="align-right">10</td>
                            <td className="align-left">디카페인 원두 (콜롬비아/500G) 외 9건</td>
                            <td className="align-right">10,000</td>
                        </tr>
                        <tr>
                            <td className="align-center">2022/12/31 12:30</td>
                            <td className="align-center">2022/12/31 12:30</td>
                            <td className="align-center">2022/12/31 12:30</td>
                            <td className="align-center">홍길동</td>
                            <td className="align-center">홍길동</td>
                            <td className="align-center">홍길동</td>
                            <td className="align-center">배송완료</td>
                            <td className="align-right">10</td>
                            <td className="align-left">디카페인 원두 (콜롬비아/500G) 외 9건</td>
                            <td className="align-right">10,000</td>
                        </tr>
                    </tbody>
                </table> */}
                {/* <!-- // 게시판 --> */}

                {/* <!-- 엑셀다운, 페이징, 정렬 --> */}
                <div className="result-function-wrap">
                    <div className="function">
                        <button className="goast-btn">엑셀다운</button>
                    </div>
                    <div className="paging-wrap">
                        <button className="btn-prev"></button>
                        <ul className="paging">
                            <li className="active">1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                            <li>5</li>
                        </ul>
                        <button className="btn-next"></button>
                    </div>
                    <select className="filter-number" name="" id="">
                        <option value="">50개</option>
                    </select>
                </div>
                {/* <!-- // 엑셀다운, 페이징, 정렬 --> */}
            </div>
        </div>
    )
}

export default OrderDetail;