import { useState, useEffect } from "react";

// type
import { TabItemProps } from "types/etcType";

// component
import EtcTable from "../EtcTable";
import EtcSearch from "../EtcSearch";
import EtcSearchDetail from "../EtcSearchDetail";
import EtcDetailTable from "../EtcDetailTable";
import EtcDetailFooter from "../EtcDetailFooter.tsx";

const DeliveryCharge: React.FC<TabItemProps> = ({ pageInfo, searchDate, handlePageInfo, setSearchDate, handleExcelPrint }) => {
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

    return (
        <div id="tab1" className="tab-content active">
            <div className="info-wrap">
                <p>※ 바나 딜리버리 수수료 내역을 조회할 수 있습니다. <strong>(가상계좌 자동 차감되므로 정산내역에는 반영되지 않습니다.)</strong></p>
            </div>

            <div className="board-date-wrap">
                {/* <!-- 수수료 내역 (EtcTable) --> */}
                <p className="title bullet">2022년 3월 바나 딜리버리 수수료 내역</p>
                <EtcTable colGroup={tableColGroup} thead={tableHead} tbody={tableBody} />
                {/* <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
                    <colgroup>
                        <col width="188" />
                        <col width="*" />
                        <col width="150" />
                        <col width="150" />
                        <col width="150" />
                    </colgroup>
                    <thead>

                        <tr>
                            <th>기간</th>
                            <th>품목</th>
                            <th>수수료 공급가 (2%)</th>
                            <th>부가세 (0.2%)</th>
                            <th>수수료 합계 (2.2%)</th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr>
                            <td className="align-center">22/06/01~22/06/30</td>
                            <td className="align-left">바나 딜리버리 수수료(주문금액의 2%, VAT 별도)</td>
                            <td className="align-right">100,000</td>
                            <td className="align-right">100,000</td>
                            <td className="align-right">100,000</td>
                        </tr>
                    </tbody>
                </table> */}
                {/* <!-- // 수수료 내역 --> */}

                <p className="title bullet">상세내역</p>
                {/* <!-- 검색 (EtcSearch) --> */}
                <EtcSearch from={searchDate.from} to={searchDate.to} updateDate={setSearchDate} option={['구분 전체', 'test1', 'test2']} />
                {/* <div className="search-wrap">
                    <div className="input-wrap">
                        <input type="text" placeholder="2022-03-01" />
                        <i>~</i>
                        <input type="text" placeholder="2022-03-30" />
                    </div>
                    <div className="select-wrap">
                        <select name="" id="">
                            <option value="">구분 전체</option>
                        </select>
                    </div>
                    <button className="btn-search">조회</button>
                </div> */}
                {/* <!-- // 검색 --> */}

                {/* <!-- 조회 기간 (EtcSearchDetail)--> */}
                <EtcSearchDetail searchDate={`${searchDate.from} ~ ${searchDate.to}`} searchResult={detailSearchResult} priceInfo={detailPriceInfo} />
                {/* <div className="search-result-wrap">
                    <div className="search-date">
                        <p>조회기간: 2022-12-31 ~ 2022-12-31</p>
                    </div>
                    <ul className="search-result">
                        <li className="hyphen">바나 딜리버리 주문금액 합계<span className="colon"></span><span className="value">10,000원</span></li>
                        <li className="hyphen">바나 딜리버스 수수료 공급가(주문금액*2%) 합계<span className="colon"></span><span className="value">10,000원</span></li>
                        <li className="hyphen">바나 딜리버리 수수료(수수료 공급가+부가세) 합계<span className="colon"></span><span className="value">10,000원</span></li>
                    </ul>
                    <div className="price-info">
                        <p className="hyphen"><span>주문금액</span><span className="colon"></span>배달비를 제외한 카드/현금/포인트/쿠폰 결제금액의 합계.</p>
                        <p className="hyphen"><span>수수료 공급가</span><span className="colon"></span>주문금액의 2% (부가세 별도.)</p>
                    </div>
                </div> */}
                {/* <!-- 조회 기간 --> */}

                {/* <!-- 게시판 (EtcDetailTable)--> */}
                <EtcDetailTable colGroup={detailTableColGroup} theadData={detailTableHead} tbodyData={detailTableBody} pageInfo={pageInfo} />
                {/* <table className="board-wrap" cellPadding="0" cellSpacing="0">
                    <colgroup>
                        <col width="188" />
                        <col width="*" />
                        <col width="120" />
                        <col width="120" />
                        <col width="150" />
                        <col width="190" />
                        <col width="136" />
                        <col width="150" />
                        <col width="150" />
                        <col width="150" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th rowSpan={2}>결제일시</th>
                            <th rowSpan={2}>메뉴</th>
                            <th rowSpan={2}>주문금액</th>
                            <th rowSpan={2}>배달비</th>
                            <th rowSpan={2}>결제방식</th>
                            <th rowSpan={2}>결제수단</th>
                            <th rowSpan={2}>주문자</th>
                            <th colSpan={3} className="price-area">바나 딜리버리 수수료</th>
                        </tr>
                        <tr>
                            <td className="price-area">수수료 공급가 (2%)</td>
                            <td className="price-area">부가세 (0.2%)</td>
                            <td className="price-area">수수료 합계 (2.2%)</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="align-center">22/06/01~22/06/30</td>
                            <td className="align-left">아메리카노 외 1건</td>
                            <td className="align-right">5,000</td>
                            <td className="align-right">2,900</td>
                            <td className="align-center">현장카드</td>
                            <td className="align-center">카드, 바나포인트</td>
                            <td className="align-center">0101234****</td>
                            <td className="align-right">130,000</td>
                            <td className="align-right">130,000</td>
                            <td className="align-right"><strong>130,000</strong></td>
                        </tr>
                        <tr>
                            <td className="align-center">22/06/01~22/06/30</td>
                            <td className="align-left">아메리카노 외 1건</td>
                            <td className="align-right">5,000</td>
                            <td className="align-right">2,900</td>
                            <td className="align-center">현장카드</td>
                            <td className="align-center">카드, 바나포인트</td>
                            <td className="align-center">0101234****</td>
                            <td className="align-right">130,000</td>
                            <td className="align-right">130,000</td>
                            <td className="align-right"><strong>130,000</strong></td>
                        </tr>
                        <tr>
                            <td className="align-center">22/06/01~22/06/30</td>
                            <td className="align-left">아메리카노 외 1건</td>
                            <td className="align-right">5,000</td>
                            <td className="align-right">2,900</td>
                            <td className="align-center">현장카드</td>
                            <td className="align-center">카드,쿠폰,잔돈포인트</td>
                            <td className="align-center">0101234****</td>
                            <td className="align-right">130,000</td>
                            <td className="align-right">130,000</td>
                            <td className="align-right"><strong>130,000</strong></td>
                        </tr>
                    </tbody>
                </table> */}
                {/* <!-- // 게시판 --> */}

                {/* <!-- 엑셀다운, 페이징, 정렬 (EtcResult)--> */}
                <EtcDetailFooter excelFn={handleExcelPrint} pageFn={handlePageInfo} filterOption={[5, 10, 15, 20, 50]} dataCnt={detailTableBody.length || 0} pageInfo={pageInfo} />
                {/* <div className="result-function-wrap">
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
                </div> */}
                {/* <!-- // 엑셀다운, 페이징, 정렬 --> */}
            </div>
        </div>
    )
}

export default DeliveryCharge;